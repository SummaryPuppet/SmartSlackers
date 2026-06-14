"use client";
import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { loadAvatar } from "@/src/services/avatarService";
import type { AvatarConfig } from "@/types/avatar";
import { useTestLogic, TEST_SESSION_KEY } from "../components/test/useTestLogic";
import TestIntro from "../components/test/TestIntro";
import QuestionCard from "../components/test/QuestionCard";
import ResultScreen from "../components/test/ResultScreen";
import Navbar from "@/components/Navbar";
import DinosaurSVG from "@/app/components/avatar/DinosaurSVG";
import AvatarSVG from "@/app/components/avatar/AvatarSVG";
import { motion, AnimatePresence } from "framer-motion";

type SavedSession = { answers: string[]; current: number; score: number; savedAt: number };

export default function TestPage() {
  const logic = useTestLogic();
  const [savedSession, setSavedSession]   = useState<SavedSession | null>(null);
  const [avatarConfig, setAvatarConfig]   = useState<AvatarConfig | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // Detecta sesión en progreso al cargar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TEST_SESSION_KEY);
      if (!raw) return;
      const data: SavedSession = JSON.parse(raw);
      if (Array.isArray(data.answers) && data.answers.length > 0 && data.current < 10) {
        setSavedSession(data);
      }
    } catch (err) {
      console.error("[TestPage] Failed to parse saved session:", err);
      localStorage.removeItem(TEST_SESSION_KEY);
    }
  }, []);

  // Carga avatar del usuario para el banner "en progreso"
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      loadAvatar(user.uid)
        .then((saved) => { if (saved) setAvatarConfig(saved.config); })
        .catch((err) => console.error("[TestPage] Failed to load avatar:", err));
    });
    return () => unsub();
  }, []);

  const handleResume = () => {
    if (!savedSession) return;
    logic.resumeTest(savedSession.answers, savedSession.current, savedSession.score);
    setSavedSession(null);
  };

  const handleStart = () => {
    setSavedSession(null);
    logic.startTest();
  };

  const handleExitConfirm = useCallback(() => {
    setShowExitModal(false);
    window.location.href = "/";
  }, []);

  const isInProgress = logic.phase === "question" || logic.phase === "feedback";

  const isDino = !avatarConfig || (avatarConfig.avatarType ?? "dino") === "dino";

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #fff2f2 0%, #fff6f5 45%, #faf5f5 100%)",
    }}>
      <Navbar />

      {/* ── Botón "Salir" visible durante el test ── */}
      <AnimatePresence>
        {isInProgress && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExitModal(true)}
            style={{
              position: "fixed",
              top: "70px",
              right: "16px",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(255,0,0,0.2)",
              borderRadius: "20px",
              color: "#cc2b2b",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            ✕ Salir del test
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Modal de confirmación de salida ── */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "1rem",
            }}
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(255,255,255,0.98)",
                borderRadius: "20px",
                padding: "2rem 1.75rem",
                maxWidth: "380px",
                width: "100%",
                textAlign: "center",
                boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
              }}
            >
              {/* Avatar con punto pulsante */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
                {isDino
                  ? <DinosaurSVG size={80} />
                  : <AvatarSVG config={avatarConfig!} size={80} />
                }
                <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ position: "absolute", width: "14px", height: "14px", borderRadius: "50%", background: "#f59e0b", opacity: 0.75, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#d97706", flexShrink: 0 }} />
                </span>
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e1e1e", marginBottom: "8px" }}>
                ¿Salir del test?
              </h3>
              <p style={{ fontSize: "13px", color: "#5c5c5c", lineHeight: 1.6, marginBottom: "6px" }}>
                Tu progreso está guardado en la pregunta{" "}
                <strong style={{ color: "#cc2b2b" }}>{logic.current + 1} de {logic.total}</strong>.
              </p>
              <p style={{ fontSize: "12px", color: "#888", marginBottom: "20px" }}>
                Puedes continuar desde tu perfil o desde la pantalla de inicio del test.
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowExitModal(false)}
                  style={{
                    flex: 1, padding: "12px",
                    background: "linear-gradient(135deg, #ffb3b3, #ff7f7f)",
                    border: "none", borderRadius: "12px",
                    color: "#1e1e1e", fontWeight: 700, fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Continuar test
                </button>
                <button
                  onClick={handleExitConfirm}
                  style={{
                    flex: 1, padding: "12px",
                    background: "transparent",
                    border: "1px solid rgba(0,0,0,0.15)", borderRadius: "12px",
                    color: "#5c5c5c", fontWeight: 600, fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Salir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", minHeight: "calc(100vh - 57px)" }}>
        {logic.phase === "intro" ? (
          <TestIntro
            onStart={handleStart}
            hasSession={!!savedSession}
            sessionProgress={savedSession ? { current: savedSession.current, total: 10 } : undefined}
            onResume={handleResume}
            avatarConfig={avatarConfig}
          />
        ) : isInProgress ? (
          <QuestionCard
            question={logic.question}
            current={logic.current}
            total={logic.total}
            timeLeft={logic.timeLeft}
            selected={logic.selected}
            score={logic.score}
            onAnswer={logic.handleAnswer}
          />
        ) : logic.phase === "result" ? (
          <ResultScreen result={logic.getResult()} score={logic.score} answers={logic.answers} />
        ) : null}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </main>
  );
}
