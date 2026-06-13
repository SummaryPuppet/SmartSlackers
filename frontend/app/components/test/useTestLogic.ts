import { useState, useEffect, useCallback } from "react";
import { questions, careerResults } from "@/lib/questions";

export function useTestLogic() {
  const [phase, setPhase] = useState<
    "intro" | "question" | "feedback" | "result"
  >("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]); // guarda career, no letra
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (phase !== "question") return;
    if (timeLeft === 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  const startTest = () => {
    setPhase("question");
    setTimeLeft(20);
  };

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (selected) return;
      setSelected(optionId);

      // Guardamos la carrera que apunta esa opción
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

  const handleTimeout = () => {
    setAnswers((prev) => [...prev, "none"]);
    setTimeout(() => nextQuestion(), 1000);
  };

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

  // Contar qué carrera acumuló más respuestas
  const getResult = () => {
    const count: Record<string, number> = {};
    answers.forEach((career) => {
      if (career === "none") return;
      count[career] = (count[career] || 0) + 1;
    });
    const winner =
      Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "software";
    return { ...careerResults[winner], careerKey: winner };
  };

  return {
    phase,
    current,
    selected,
    timeLeft,
    score,
    question: questions[current],
    total: questions.length,
    startTest,
    handleAnswer,
    getResult,
  };
}
