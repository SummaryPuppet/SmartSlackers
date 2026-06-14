"use client";
import { useTestLogic } from "../components/test/useTestLogic";
import TestIntro from "../components/test/TestIntro";
import QuestionCard from "../components/test/QuestionCard";
import ResultScreen from "../components/test/ResultScreen";

export default function TestPage() {
  const logic = useTestLogic();

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #fff2f2 0%, #fff6f5 45%, #faf5f5 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem"
    }}>
      {logic.phase === "intro" && (
        <TestIntro onStart={logic.startTest} />
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
        <ResultScreen result={logic.getResult()} score={logic.score} answers={logic.answers} />
      )}
    </main>
  );
}