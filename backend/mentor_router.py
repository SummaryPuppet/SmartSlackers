import os
import json
from typing import AsyncGenerator

import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from mentor import get_mentor, get_mentor_info, build_system_message

load_dotenv()

router = APIRouter()

GROQ_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", "0.8"))
LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", "800"))


class MentorRequest(BaseModel):
    messages: list[dict[str, str]]
    careerId: str
    locale: str = "es"


async def stream_mentor_response(
    messages: list[dict[str, str]],
    career_id: str,
    locale: str = "es",
) -> AsyncGenerator[str, None]:
    mentor_info = get_mentor_info(career_id)
    system_msg = build_system_message(career_id, locale)

    yield f"data: {json.dumps({'mentor': mentor_info})}\n\n"

    api_messages = [{"role": "system", "content": system_msg}]
    for msg in messages:
        api_messages.append({"role": msg["role"], "content": msg["content"]})

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            async with client.stream(
                "POST",
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": LLM_MODEL,
                    "messages": api_messages,
                    "temperature": LLM_TEMPERATURE,
                    "max_tokens": LLM_MAX_TOKENS,
                    "stream": True,
                },
            ) as response:
                if response.status_code != 200:
                    body = await response.aread()
                    error_msg = json.loads(body).get("error", {}).get("message", str(response.status_code))
                    yield f"data: {json.dumps({'error': error_msg})}\n\n"
                    yield "data: [DONE]\n\n"
                    return

                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    try:
                        parsed = json.loads(data)
                        delta = parsed["choices"][0].get("delta", {})
                        content = delta.get("content")
                        if content:
                            yield f"data: {json.dumps({'content': content})}\n\n"
                    except (json.JSONDecodeError, KeyError, IndexError):
                        continue

        yield "data: [DONE]\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
        yield "data: [DONE]\n\n"


@router.post("/api/mentor")
async def mentor_chat(req: MentorRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="LLM API key not configured")

    if not req.messages:
        raise HTTPException(status_code=400, detail="Messages cannot be empty")

    return StreamingResponse(
        stream_mentor_response(req.messages, req.careerId, req.locale),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
