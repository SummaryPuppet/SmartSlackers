import { useState, useEffect, useCallback } from "react";
import { questions, careerResults } from "@/lib/questions";
import type { Career } from "@/types/avatar";

export const TEST_SESSION_KEY = "vocatio_test_session";

export function useTestLogic() {
  const [phase, setPhase] = useState<
    "intro" | "question" | "feedback" | "result"
  >("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setPhase("result");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setTimeLeft(20);
      setPhase("question");
    }
  };

  const handleTimeout = () => {
    setAnswers((prev) => [...prev, "none"]);
    setTimeout(() => nextQuestion(), 1000);
  };

  useEffect(() => {
    if (phase !== "question") return;
    if (timeLeft === 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, handleTimeout, nextQuestion]);

  // Persiste el progreso en localStorage mientras el test está activo
  useEffect(() => {
    if (phase !== "question" && phase !== "feedback") return;
    if (answers.length === 0 && current === 0) return;
    localStorage.setItem(
      TEST_SESSION_KEY,
      JSON.stringify({
        answers,
        current,
        score,
        savedAt: Date.now(),
      }),
    );
  }, [answers, current, score, phase]);

  // Inicia un test completamente nuevo (borra progreso previo)
  const startTest = () => {
    localStorage.removeItem(TEST_SESSION_KEY);
    setAnswers([]);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setPhase("question");
    setTimeLeft(20);
  };

  // Retoma un test guardado desde localStorage
  const resumeTest = (
    savedAnswers: string[],
    savedCurrent: number,
    savedScore: number,
  ) => {
    setAnswers(savedAnswers);
    setCurrent(savedCurrent);
    setScore(savedScore);
    setSelected(null);
    setPhase("question");
    setTimeLeft(20);
  };

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (selected) return;
      setSelected(optionId);

      const chosenOption = questions[current].options.find(
        (o) => o.id === optionId,
      );
      if (chosenOption) {
        setAnswers((prev) => [...prev, chosenOption.career]);
      }

      const bonus = Math.floor(timeLeft * 5);
      setScore((prev) => prev + 100 + bonus);
      setPhase("feedback");
      setTimeout(() => nextQuestion(), 1500);
    },
    [selected, timeLeft, current],
  );

  const getResult = () => {
    const valid = answers.filter((a) => a !== "none");

    if (valid.length < 3) {
      return {
        insufficient: true,
        answered: valid.length,
        careerKey: "" as Career,
      };
    }

    const count: Record<string, number> = {};
    valid.forEach((career) => {
      count[career] = (count[career] || 0) + 1;
    });
    const winner = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
    return {
      ...careerResults[winner],
      careerKey: winner as Career,
      insufficient: false,
    };
  };

  return {
    phase,
    current,
    selected,
    timeLeft,
    score,
    answers,
    question: questions[current],
    total: questions.length,
    startTest,
    resumeTest,
    handleAnswer,
    getResult,
  };
}
