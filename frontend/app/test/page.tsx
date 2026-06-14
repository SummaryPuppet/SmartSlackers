"use client";
import { useState, useEffect } from "react";
import { useTestLogic, TEST_SESSION_KEY } from "../components/test/useTestLogic";
import TestIntro from "../components/test/TestIntro";
import QuestionCard from "../components/test/QuestionCard";
import ResultScreen from "../components/test/ResultScreen";
import Navbar from "@/components/Navbar";

type SavedSession = { answers: string[]; current: number; score: number; savedAt: number };

export default function TestPage() {
  const logic = useTestLogic();
  const [savedSession, setSavedSession] = useState<SavedSession | null>(null);

  // Detecta sesión en progreso al cargar la página
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TEST_SESSION_KEY);
      if (!raw) return;
      const data: SavedSession = JSON.parse(raw);
      if (Array.isArray(data.answers) && data.answers.length > 0 && data.current < 10) {
        setSavedSession(data);
      }
    } catch { /* ignore */ }
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

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #fff2f2 0%, #fff6f5 45%, #faf5f5 100%)",
    }}>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", minHeight: "calc(100vh - 57px)" }}>
        {logic.phase === "intro" && (
          <TestIntro
            onStart={handleStart}
            hasSession={!!savedSession}
            sessionProgress={savedSession ? { current: savedSession.current, total: 10 } : undefined}
            onResume={handleResume}
          />
        )}
        {(logic.phase === "question" || logic.phase === "feedback") && (
          <QuestionCard
            question={logic.question}
            current={logic.current}
            total={logic.total}
            timeLeft={logic.timeLeft}
            selected={logic.selected}
            score={logic.score}
            onAnswer={logic.handleAnswer}
          />
        )}
        {logic.phase === "result" && (
          <ResultScreen result={logic.getResult()} score={logic.score} />
        )}
      </div>
    </main>
  );
}
