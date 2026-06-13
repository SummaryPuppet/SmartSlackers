import os
from abc import ABC, abstractmethod
from collections.abc import AsyncIterator

import httpx
from dotenv import load_dotenv

load_dotenv()


class LLMProvider(ABC):
    @abstractmethod
    async def chat(self, messages: list[dict]) -> str:
        ...

    @abstractmethod
    async def chat_stream(self, messages: list[dict]) -> AsyncIterator[str]:
        ...


class GroqProvider(LLMProvider):
    def __init__(self, model: str, api_key: str, temperature: float, max_tokens: int):
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        from groq import AsyncGroq

        self.client = AsyncGroq(api_key=api_key)

    async def chat(self, messages: list[dict]) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        return response.choices[0].message.content or ""

    async def chat_stream(self, messages: list[dict]) -> AsyncIterator[str]:
        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta
            if delta.content:
                yield delta.content


class OpenAIProvider(LLMProvider):
    def __init__(self, model: str, api_key: str, temperature: float, max_tokens: int):
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        from openai import AsyncOpenAI

        self.client = AsyncOpenAI(api_key=api_key)

    async def chat(self, messages: list[dict]) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        return response.choices[0].message.content or ""

    async def chat_stream(self, messages: list[dict]) -> AsyncIterator[str]:
        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta
            if delta.content:
                yield delta.content


class OllamaProvider(LLMProvider):
    def __init__(self, model: str, base_url: str, temperature: float, max_tokens: int):
        self.model = model
        self.base_url = base_url.rstrip("/")
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.client = httpx.AsyncClient(timeout=120.0)

    async def chat(self, messages: list[dict]) -> str:
        response = await self.client.post(
            f"{self.base_url}/api/chat",
            json={
                "model": self.model,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": self.temperature,
                    "num_predict": self.max_tokens,
                },
            },
        )
        response.raise_for_status()
        return response.json()["message"]["content"]

    async def chat_stream(self, messages: list[dict]) -> AsyncIterator[str]:
        async with self.client.stream(
            "POST",
            f"{self.base_url}/api/chat",
            json={
                "model": self.model,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": self.temperature,
                    "num_predict": self.max_tokens,
                },
            },
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line:
                    continue
                import json

                data = json.loads(line)
                if "message" in data and "content" in data["message"]:
                    yield data["message"]["content"]


def get_provider() -> LLMProvider:
    provider_name = os.getenv("LLM_PROVIDER", "groq").lower()
    model = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
    api_key = os.getenv("LLM_API_KEY", "")
    temperature = float(os.getenv("LLM_TEMPERATURE", "0.8"))
    max_tokens = int(os.getenv("LLM_MAX_TOKENS", "800"))

    if provider_name == "groq":
        if not api_key:
            raise ValueError("LLM_API_KEY is required for Groq provider")
        return GroqProvider(model, api_key, temperature, max_tokens)

    elif provider_name == "openai":
        if not api_key:
            raise ValueError("LLM_API_KEY is required for OpenAI provider")
        return OpenAIProvider(model, api_key, temperature, max_tokens)

    elif provider_name == "ollama":
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        return OllamaProvider(model, base_url, temperature, max_tokens)

    else:
        raise ValueError(f"Unknown LLM provider: {provider_name}. Use groq, openai, or ollama.")
