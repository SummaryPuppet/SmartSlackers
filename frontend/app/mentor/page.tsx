"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { careers, type Career } from "@/lib/careers";
import Navbar from "@/components/Navbar";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type MentorInfo = {
  name: string;
  title: string;
};

const MENTOR_API_URL = process.env.NEXT_PUBLIC_MENTOR_API_URL || "http://127.0.0.1:8000";

const MENTOR_CAREERS = [
  {
    id: "software",
    icon: "💻",
    color: "#dc2626",
    tagline: "Entrevista técnica de ingeniería de software",
  },
  {
    id: "medicina",
    icon: "🩺",
    color: "#059669",
    tagline: "Entrevista de admisión a medicina",
  },
  {
    id: "derecho",
    icon: "⚖️",
    color: "#b45309",
    tagline: "Entrevista de admisión a derecho",
  },
  {
    id: "negocios",
    icon: "📊",
    color: "#7c3aed",
    tagline: "Entrevista de selección empresarial",
  },
  {
    id: "psicologia",
    icon: "🧠",
    color: "#7c3aed",
    tagline: "Entrevista de admisión a psicología",
  },
  {
    id: "ingenieria",
    icon: "🏗️",
    color: "#dc2626",
    tagline: "Entrevista de admisión a ingeniería",
  },
] as const;

function getCareerInfo(id: string): Career | undefined {
  return careers.find((c) => c.id === id);
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-slate-400"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="ml-2 text-xs text-slate-400">Escribiendo...</span>
    </div>
  );
}

function MessageBubble({
  message,
  mentorName,
}: {
  message: Message;
  mentorName: string;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}
      >
        {!isUser && (
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-xs font-bold text-white shadow-md">
            {mentorName.charAt(0)}
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20 rounded-br-md"
              : "bg-white text-slate-800 shadow-md border border-slate-100 rounded-bl-md"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {isUser && (
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
            TÚ
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CareerSelector({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const selectedCareer = (id: string) => {
    onSelect(id);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.08),transparent_30%),linear-gradient(180deg,#fff5f5_0%,#fef2f2_100%)]">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 via-rose-500 to-orange-400 text-5xl shadow-2xl shadow-red-500/30"
          >
            🤖
          </motion.div>
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
            Tu Mentor de{" "}
            <span className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
              Entrevistas
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-500">
            Practica entrevistas reales con un mentor IA que se adapta a tu
            carrera. Recibe feedback personalizado y mejora tu confianza.
          </p>
        </motion.div>

        {/* Career cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENTOR_CAREERS.map((mentorCareer, i) => {
            const careerInfo = getCareerInfo(mentorCareer.id);
            return (
              <motion.button
                key={mentorCareer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectedCareer(mentorCareer.id)}
                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-6 text-left shadow-lg backdrop-blur-xl transition-shadow hover:shadow-2xl"
                style={{
                  boxShadow: `0 8px 30px ${mentorCareer.color}15`,
                }}
              >
                <div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 transition-opacity group-hover:opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${mentorCareer.color}, transparent)`,
                  }}
                />
                <div className="relative">
                  <span className="mb-3 inline-block text-3xl">
                    {mentorCareer.icon}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    {careerInfo?.title || mentorCareer.id}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {mentorCareer.tagline}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Empezar entrevista
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: "🎯",
              title: "Feedback real",
              desc: "Recibe evaluación detallada de cada respuesta",
            },
            {
              icon: "🧠",
              title: "Preguntas reales",
              desc: "Basadas en entrevistas reales de empresas y universidades",
            },
            {
              icon: "📈",
              title: "Mejora continua",
              desc: "Practica tantas veces como quieras sin presión",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/60 bg-white/60 p-5 text-center backdrop-blur-sm"
            >
              <span className="text-2xl">{item.icon}</span>
              <h4 className="mt-2 text-sm font-bold text-slate-900">
                {item.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function MentorPage() {
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mentorInfo, setMentorInfo] = useState<MentorInfo | null>(null);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
  }, [started]);

  const startInterview = useCallback(async (careerId: string) => {
    setSelectedCareerId(careerId);
    setStarted(true);
    setIsLoading(true);

    try {
      const res = await fetch(`${MENTOR_API_URL}/api/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content:
                "Hola, estoy listo para comenzar la entrevista. Por favor preséntate y empecemos.",
            },
          ],
          careerId,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al conectar con el mentor");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let mentorSet = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.mentor && !mentorSet) {
              setMentorInfo(parsed.mentor);
              mentorSet = true;
            } else if (parsed.content) {
              assistantContent += parsed.content;
              setMessages([{ role: "assistant", content: assistantContent }]);
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // skip malformed lines
          }
        }
      }

      if (!assistantContent) {
        throw new Error("No se recibió respuesta del mentor");
      }
    } catch (error) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hubo un error al conectar. Verifica que el backend esté corriendo en " +
            MENTOR_API_URL +
            ". Error: " +
            (error instanceof Error ? error.message : "desconocido"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !selectedCareerId) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${MENTOR_API_URL}/api/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          careerId: selectedCareerId,
        }),
      });

      if (!res.ok) {
        throw new Error("Error del mentor");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assistantContent += parsed.content;
              setMessages([
                ...newMessages,
                { role: "assistant", content: assistantContent },
              ]);
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // skip malformed lines
          }
        }
      }

      if (!assistantContent) {
        throw new Error("No se recibió respuesta del mentor");
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Disculpa, tuve un problema técnico. Verifica que el backend esté corriendo. (" +
            (error instanceof Error ? error.message : "error") +
            ")",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, selectedCareerId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setSelectedCareerId(null);
    setMessages([]);
    setInput("");
    setMentorInfo(null);
    setStarted(false);
  };

  if (!started) {
    return <CareerSelector onSelect={startInterview} />;
  }

  const careerInfo = selectedCareerId ? getCareerInfo(selectedCareerId) : null;
  const careerColor = careerInfo?.color || "#dc2626";

  return (
    <div className="flex h-screen flex-col bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.06),transparent_30%),linear-gradient(180deg,#fef9f9_0%,#fff5f5_100%)]">
      {/* Chat Header */}
      <div className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <button
            onClick={resetChat}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ←
          </button>

          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${careerColor}, ${careerColor}cc)`,
              }}
            >
              {careerInfo?.emoji || "🤖"}
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900">
                {mentorInfo?.name || "Mentor IA"}
              </h1>
              <p className="text-xs text-slate-500">
                {mentorInfo?.title || careerInfo?.title || ""}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-green-700">
                En línea
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl">
          {/* Welcome message if no messages yet */}
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${careerColor}, ${careerColor}bb)`,
                }}
              >
                {careerInfo?.emoji || "🤖"}
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Entrevista de{" "}
                {careerInfo?.title || selectedCareerId}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Tu mentor te dará la bienvenida. Responde con naturalidad como
                si fuera una entrevista real.
              </p>
            </motion.div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              mentorName={mentorInfo?.name || "Mentor"}
            />
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${careerColor}, ${careerColor}cc)`,
                  }}
                >
                  {mentorInfo?.name?.charAt(0) || "M"}
                </div>
                <div className="rounded-2xl bg-white shadow-md border border-slate-100 rounded-bl-md">
                  <TypingIndicator />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-end gap-3">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu respuesta..."
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-800 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25 transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </motion.button>
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-400">
            Presiona Enter para enviar · Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
}
