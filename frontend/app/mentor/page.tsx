"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { careers, type Career } from "@/lib/careers";
import {
  showBadgeNotification,
  trackBadgeEvent,
} from "@/src/services/badgeService";
import { apiFetch } from "@/lib/api";
import { onAuthStateChanged } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../src/firebase/config";
import { useTranslation } from "@/lib/i18n";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type MentorInfo = {
  name: string;
  title: string;
};

function getMentorCareers(t: (key: string) => string) {
  return [
    {
      id: "software",
      icon: "💻",
      color: "#dc2626",
      tagline: t("mentor.softwareTagline"),
    },
    {
      id: "medicina",
      icon: "🩺",
      color: "#059669",
      tagline: t("mentor.medicinaTagline"),
    },
    {
      id: "derecho",
      icon: "⚖️",
      color: "#b45309",
      tagline: t("mentor.derechoTagline"),
    },
    {
      id: "negocios",
      icon: "📊",
      color: "#7c3aed",
      tagline: t("mentor.negociosTagline"),
    },
    {
      id: "psicologia",
      icon: "🧠",
      color: "#7c3aed",
      tagline: t("mentor.psicologiaTagline"),
    },
    {
      id: "ingenieria",
      icon: "🏗️",
      color: "#dc2626",
      tagline: t("mentor.ingenieriaTagline"),
    },
  ] as const;
}

function getCareerInfo(id: string): Career | undefined {
  return careers.find((c) => c.id === id);
}

function getCareerTitle(id: string, t: (key: string) => string): string {
  const titleMap: Record<string, string> = {
    software: t("mentor.careerSoftware"),
    medicina: t("mentor.careerMedicina"),
    derecho: t("mentor.careerDerecho"),
    negocios: t("mentor.careerNegocios"),
    psicologia: t("mentor.careerPsicologia"),
    ingenieria: t("mentor.careerIngenieria"),
  };
  return titleMap[id] || id;
}

function TypingIndicator() {
  const { t } = useTranslation();
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
      <span className="ml-2 text-xs text-slate-400">{t("mentor.escribiendo")}</span>
    </div>
  );
}

function ConnectionError({
  message,
  onRetry,
  careerColor,
}: {
  message: string;
  onRetry: () => void;
  careerColor: string;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto my-4 max-w-md"
    >
      <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 shadow-lg shadow-red-500/10">
        {/* Decorative top bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${careerColor}, ${careerColor}88, ${careerColor})`,
          }}
        />

        <div className="px-6 py-5 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 12,
              delay: 0.15,
            }}
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100"
          >
            <svg
              className="h-7 w-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 00-.707-7.071M12 8v4m0 4h.01"
              />
            </svg>
          </motion.div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900">
            {t("mentor.noSePudoConectar")}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            {message ||
              t("mentor.verificaBackend")}
          </p>

          {/* Retry button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-shadow hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${careerColor}, ${careerColor}cc)`,
              boxShadow: `0 4px 14px ${careerColor}30`,
            }}
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t("mentor.reintentar")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function MessageBubble({
  message,
  mentorName,
}: {
  message: Message;
  mentorName: string;
}) {
  const { t } = useTranslation();
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
            {t("mentor.tu")}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ClearChatModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center">
          {t("mentor.limpiarConversacion")}
        </h3>
        <p className="mt-2 text-sm text-slate-500 text-center">
          {t("mentor.confirmarLimpiar")}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {t("common.cancelar")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/25 transition hover:shadow-xl"
          >
            {t("common.limpiar")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CareerSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const { t } = useTranslation();
  const MENTOR_CAREERS = getMentorCareers(t);
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
            {t("mentor.tuMentorDe")}{" "}
            <span className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
              {t("mentor.entrevistas")}
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-500">
            {t("mentor.descripcionMentor")}
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
                    {getCareerTitle(mentorCareer.id, t)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {mentorCareer.tagline}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-600 opacity-0 transition-opacity group-hover:opacity-100">
                    {t("mentor.empezarEntrevista")}
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
              title: t("mentor.feedbackReal"),
              desc: t("mentor.feedbackRealDesc"),
            },
            {
              icon: "🧠",
              title: t("mentor.preguntasReales"),
              desc: t("mentor.preguntasRealesDesc"),
            },
            {
              icon: "📈",
              title: t("mentor.mejoraContinua"),
              desc: t("mentor.mejoraContinuaDesc"),
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
  const { t, locale } = useTranslation();
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mentorInfo, setMentorInfo] = useState<MentorInfo | null>(null);
  const [started, setStarted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef   = useRef<HTMLDivElement>(null);
  const inputRef         = useRef<HTMLTextAreaElement>(null);
  const recognitionRef   = useRef<{ stop: () => void } | null>(null);
  const isMutedRef       = useRef(false);

  const [isMuted, setIsMuted]       = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Sincroniza isMutedRef y cancela audio al silenciar ──
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted && typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, [isMuted]);

  // Limpia audio al desmontar
  useEffect(() => {
    return () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
  }, []);

  // ── TTS: voz robótica para respuestas del mentor ──
  const speak = useCallback((text: string) => {
    if (isMutedRef.current || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance  = new SpeechSynthesisUtterance(text);
    utterance.lang   = "es-PE";
    utterance.pitch  = 0.75;
    utterance.rate   = 0.88;
    utterance.volume = 1;
    const trySpeak = () => {
      const voices  = window.speechSynthesis.getVoices();
      const esVoice = voices.find((v) => v.lang.startsWith("es"));
      if (esVoice) utterance.voice = esVoice;
      window.speechSynthesis.speak(utterance);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak;
    } else {
      trySpeak();
    }
  }, []);

  // ── STT: micrófono del usuario ──
  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = typeof window !== "undefined"
      ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      : null;
    if (!SR) return;
    window.speechSynthesis?.cancel();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SR();
    recognition.lang           = "es-PE";
    recognition.interimResults = true;
    recognition.continuous     = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognition.onend   = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const saveChatHistory = useCallback(
    async (careerId: string, msgs: Message[]) => {
      if (!userId) return;
      const docId = `${userId}_${careerId}`;
      const docRef = doc(db, "ChatHistories", docId);
      await setDoc(
        docRef,
        {
          userId,
          careerId,
          messages: msgs,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    },
    [userId],
  );

  const loadChatHistory = useCallback(
    async (careerId: string): Promise<Message[]> => {
      if (!userId) return [];
      const docId = `${userId}_${careerId}`;
      const docRef = doc(db, "ChatHistories", docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().messages || [];
      }
      return [];
    },
    [userId],
  );

  const clearChat = useCallback(async () => {
    if (!userId || !selectedCareerId) return;
    const docId = `${userId}_${selectedCareerId}`;
    const docRef = doc(db, "ChatHistories", docId);
    await deleteDoc(docRef);
    setMessages([]);
    setMentorInfo(null);
    setShowClearModal(false);
    setStarted(false);
    setSelectedCareerId(null);
  }, [userId, selectedCareerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
  }, [started]);

  const startInterview = useCallback(
    async (careerId: string) => {
      setSelectedCareerId(careerId);
      setStarted(true);
      setIsLoading(true);
      setConnectionError(null);
      setIsConnected(null);

      try {
        const existingMessages = await loadChatHistory(careerId);

        if (existingMessages.length > 0) {
          setMessages(existingMessages);
          setIsConnected(true);
          setIsLoading(false);
          return;
        }

        const initialUserMessage: Message = {
          role: "user",
          content: t("mentor.saludoInicial"),
        };

        const res = await apiFetch(`/api/mentor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [initialUserMessage],
            careerId,
            locale,
          }),
        });

        if (!res.ok) {
          setIsConnected(false);
          throw new Error(
            t("mentor.errorServidor"),
          );
        }

        setIsConnected(true);
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
          throw new Error(t("mentor.respuestaInvalida"));
        }

        speak(assistantContent);

        const finalMessages: Message[] = [
          initialUserMessage,
          { role: "assistant", content: assistantContent },
        ];
        await saveChatHistory(careerId, finalMessages);
      } catch (error) {
        setIsConnected(false);
        const errorMsg =
          error instanceof Error
            ? error.message
            : t("mentor.errorDesconocido");
        setConnectionError(errorMsg);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    },
    [loadChatHistory, saveChatHistory, speak, t],
  );

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !selectedCareerId) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setConnectionError(null);

    try {
      const res = await apiFetch(`/api/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          careerId: selectedCareerId,
          locale,
        }),
      });

      if (!res.ok) {
        setIsConnected(false);
        throw new Error(t("mentor.errorServidorSimple"));
      }

      setIsConnected(true);
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
        throw new Error(t("mentor.respuestaInvalida"));
      }

      speak(assistantContent);

      const finalMessages: Message[] = [
        ...newMessages,
        { role: "assistant", content: assistantContent },
      ];
      await saveChatHistory(selectedCareerId, finalMessages);

      // Badge: track mentor usage
      try {
        const user = auth.currentUser;
        if (user) {
          const { newBadges } = await trackBadgeEvent(user.uid, "mentor_used");
          newBadges.forEach((b) => showBadgeNotification(b));
        }
      } catch {
        /* silent */
      }
    } catch (error) {
      setIsConnected(false);
      const errorMsg =
        error instanceof Error
          ? error.message
          : t("mentor.errorDesconocido");
      setConnectionError(errorMsg);
      await saveChatHistory(selectedCareerId, newMessages);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, selectedCareerId, saveChatHistory, speak, t]);

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
    setIsConnected(null);
    setConnectionError(null);
  };

  const retryConnection = () => {
    if (selectedCareerId) {
      startInterview(selectedCareerId);
    }
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
                {mentorInfo?.name || t("mentor.mentoriaIA")}
              </h1>
              <p className="text-xs text-slate-500">
                {mentorInfo?.title || careerInfo?.title || ""}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Botón mute/unmute TTS */}
            <button
              onClick={() => setIsMuted((m) => !m)}
              title={isMuted ? t("mentor.habilitarVoz") : t("mentor.deshabilitarVoz")}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${
                isMuted
                  ? "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
                  : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <button
              onClick={() => setShowClearModal(true)}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {t("mentor.limpiarChat")}
            </button>
            {isConnected === true && (
              <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-medium text-green-700">
                  {t("mentor.enLinea")}
                </span>
              </div>
            )}
            {isConnected === false && (
              <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="text-[10px] font-medium text-red-600">
                  {t("mentor.desconectado")}
                </span>
              </div>
            )}
            {isConnected === null && (
              <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse" />
                <span className="text-[10px] font-medium text-slate-500">
                  {t("mentor.conectando")}
                </span>
              </div>
            )}
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
                {t("mentor.entrevistaDe")} {careerInfo?.title || selectedCareerId}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {t("mentor.tuMentorTeDara")}
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

          {/* Connection error card */}
          {connectionError && !isLoading && (
            <ConnectionError
              message={connectionError}
              onRetry={retryConnection}
              careerColor={careerColor}
            />
          )}

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
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? t("mentor.escuchando") : t("mentor.escribeTuRespuesta")}
                rows={1}
                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:ring-2 ${
                  isListening
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200 animate-pulse"
                    : "border-slate-200 focus:border-red-400 focus:ring-red-100"
                }`}
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 120) + "px";
                }}
              />
            </div>

            {/* Botón de micrófono */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isListening ? stopListening : startListening}
              title={isListening ? t("mentor.detenerGrabacion") : t("mentor.hablarConMentor")}
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg shadow-sm transition-all ${
                isListening
                  ? "bg-red-600 text-white shadow-red-500/40 shadow-lg ring-4 ring-red-200"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-red-600"
              }`}
            >
              {isListening ? "⏹" : "🎙️"}
            </motion.button>

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
            {t("mentor.presionaEnter")} · {t("mentor.shiftEnter")}
          </p>
        </div>
      </div>

      {showClearModal && (
        <ClearChatModal
          onConfirm={clearChat}
          onCancel={() => setShowClearModal(false)}
        />
      )}
    </div>
  );
}
