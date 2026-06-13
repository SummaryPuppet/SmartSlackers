"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { simulations, type Simulation, type Scene } from "@/lib/simulations";

// ─── Scene art renderer ────────────────────────────────────
function SceneArt({ scene, color }: { scene: Scene; color: string }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ background: scene.bg, minHeight: 260, maxHeight: 300 }}
    >
      {scene.elements.map((el, i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none"
          style={{
            fontSize: el.size,
            left: el.x,
            top: el.y,
            zIndex: el.zIndex ?? 1,
            filter:
              i === 0
                ? "drop-shadow(0 12px 24px rgba(0,0,0,0.4))"
                : "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
          }}
          animate={
            el.animate === "float"
              ? { y: [0, -12, 0] }
              : el.animate === "pulse"
              ? { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }
              : el.animate === "spin"
              ? { rotate: [0, 360] }
              : {}
          }
          transition={
            el.animate === "spin"
              ? { duration: 8, repeat: Infinity, ease: "linear" }
              : el.animate !== "none"
              ? {
                  duration: 2.5 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }
              : {}
          }
        >
          {el.emoji}
        </motion.span>
      ))}

      {/* chapter label */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          {scene.chapter}
        </span>
      </div>

      {/* bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      />
      <p
        className="absolute bottom-3 left-4 right-4 z-20 text-sm font-semibold text-white leading-snug"
        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
      >
        {scene.situation}
      </p>
    </div>
  );
}

// ─── Result screen ─────────────────────────────────────────
function ResultScreen({
  simulation,
  score,
  maxScore,
  onRetry,
  onExit,
}: {
  simulation: Simulation;
  score: number;
  maxScore: number;
  onRetry: () => void;
  onExit: () => void;
}) {
  const pct = Math.round((score / maxScore) * 100);
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    let n = 0;
    const step = Math.ceil(pct / 60);
    const interval = setInterval(() => {
      n = Math.min(n + step, pct);
      setDisplayPct(n);
      if (n >= pct) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [pct]);

  const level =
    pct >= 80
      ? { label: "¡Eres un NATURAL!", color: "#16a34a", emoji: "🏆", msg: "Esta carrera fue hecha para ti. Tienes las decisiones, la mentalidad y el instinto. ¡No lo dudes!" }
      : pct >= 60
      ? { label: "¡Tienes madera!", color: "#d97706", emoji: "⭐", msg: "Con práctica y estudio llegarías muy lejos. Tus decisiones muestran que el perfil está ahí." }
      : pct >= 40
      ? { label: "No es tu fuerte... todavía", color: "#ea580c", emoji: "💪", msg: "Hay aptitud, pero necesitas desarrollarla más. El esfuerzo puede cambiar todo. ¡No te rindas!" }
      : { label: "Quizás hay otra carrera para ti", color: "#dc2626", emoji: "🔍", msg: "Esta carrera te desafiaría mucho. Eso no es malo — el mayor reto crea al mejor profesional. O quizás explora otras opciones." };

  const rings = [
    { r: 70, stroke: 8, opacity: 0.15 },
    { r: 55, stroke: 5, opacity: 0.1 },
  ];
  const circumference = 2 * Math.PI * 70;
  const dash = (displayPct / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex flex-col items-center gap-6 px-4 py-8 text-center max-w-md mx-auto"
    >
      {/* circular progress */}
      <div className="relative flex items-center justify-center">
        <svg width={180} height={180} className="-rotate-90">
          {rings.map((ring, i) => (
            <circle
              key={i}
              cx={90}
              cy={90}
              r={ring.r}
              fill="none"
              stroke={simulation.color}
              strokeWidth={ring.stroke}
              opacity={ring.opacity}
            />
          ))}
          <circle
            cx={90}
            cy={90}
            r={70}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={10}
          />
          <motion.circle
            cx={90}
            cy={90}
            r={70}
            fill="none"
            stroke={simulation.color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl">{level.emoji}</span>
          <span
            className="text-3xl font-black"
            style={{ color: simulation.color }}
          >
            {displayPct}%
          </span>
          <span className="text-xs text-slate-500 font-medium">aptitud</span>
        </div>
      </div>

      {/* career badge */}
      <div
        className="flex items-center gap-2 rounded-2xl px-5 py-3 shadow-lg"
        style={{
          background: simulation.gradient,
          boxShadow: `0 8px 32px ${simulation.color}40`,
        }}
      >
        <span className="text-3xl">{simulation.emoji}</span>
        <div className="text-left">
          <p className="text-xs text-white/80 font-medium">Simulaste</p>
          <p className="text-base font-black text-white">{simulation.title}</p>
        </div>
      </div>

      {/* verdict */}
      <div className="space-y-2">
        <h2
          className="text-2xl font-black"
          style={{ color: level.color }}
        >
          {level.label}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
          {level.msg}
        </p>
      </div>

      {/* score detail */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
          <p className="text-2xl font-black text-slate-900">{score}</p>
          <p className="text-xs text-slate-500">puntos obtenidos</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
          <p className="text-2xl font-black text-slate-900">{maxScore}</p>
          <p className="text-xs text-slate-500">puntos posibles</p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg"
          style={{
            background: simulation.gradient,
            boxShadow: `0 8px 24px ${simulation.color}40`,
          }}
        >
          🔄 Volver a intentarlo
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExit}
          className="w-full rounded-xl border border-red-100 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          🔭 Simular otra carrera
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => (window.location.href = "/test")}
          className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          📋 Hacer el test vocacional oficial
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Game engine ───────────────────────────────────────────
function SimulationGame({
  simulation,
  onFinish,
}: {
  simulation: Simulation;
  onFinish: (score: number, max: number) => void;
}) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const scene = simulation.scenes[sceneIdx];
  const progress = ((sceneIdx + (chosen !== null ? 1 : 0)) / simulation.scenes.length) * 100;
  const maxScore = simulation.scenes.length * 25;

  const handleChoice = useCallback(
    (idx: number) => {
      if (chosen !== null) return;
      setChosen(idx);
      setScore((s) => s + scene.choices[idx].points);
      setShowFeedback(true);
    },
    [chosen, scene]
  );

  const handleNext = () => {
    const next = sceneIdx + 1;
    if (next >= simulation.scenes.length) {
      onFinish(score + scene.choices[chosen!].points, maxScore);
    } else {
      setSceneIdx(next);
      setChosen(null);
      setShowFeedback(false);
    }
  };

  const OPTIONS = [
    { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", label: "A" }, // blue
    { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", label: "B" }, // purple
    { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", label: "C" }, // green
    { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "D" }, // amber
  ];

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 pb-8">
      {/* progress bar */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: simulation.gradient }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
          {sceneIdx + 1} / {simulation.scenes.length}
        </span>
        <span
          className="text-xs font-bold"
          style={{ color: simulation.color }}
        >
          {score} pts
        </span>
      </div>

      {/* scene art */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneIdx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
        >
          <SceneArt scene={scene} color={simulation.color} />
        </motion.div>
      </AnimatePresence>

      {/* narrative */}
      <motion.div
        key={`narr-${sceneIdx}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
      >
        <p className="text-sm leading-relaxed text-slate-700">{scene.narrative}</p>
        <p
          className="mt-3 text-sm font-bold"
          style={{ color: simulation.color }}
        >
          {scene.prompt}
        </p>
      </motion.div>

      {/* choices */}
      <div className="flex flex-col gap-3">
        {scene.choices.map((choice, i) => {
          const isChosen = chosen === i;
          const isOther = chosen !== null && !isChosen;
          const opt = OPTIONS[i % OPTIONS.length];

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: isOther ? 0.3 : 1,
                y: 0,
                scale: isChosen ? 1.03 : 1,
              }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              whileHover={chosen === null ? { scale: 1.02, y: -2 } : {}}
              whileTap={chosen === null ? { scale: 0.98 } : {}}
              onClick={() => handleChoice(i)}
              className="w-full rounded-2xl border-2 p-4 text-left transition-all"
              style={{
                background: isChosen ? opt.bg : `${opt.bg}cc`,
                borderColor: isChosen ? opt.color : opt.border,
                cursor: chosen === null ? "pointer" : "default",
                boxShadow: isChosen
                  ? `0 6px 24px ${opt.color}35`
                  : `0 2px 8px ${opt.color}10`,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Letter badge */}
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-sm transition-all"
                  style={{
                    background: isChosen ? opt.color : `${opt.color}20`,
                    color: isChosen ? "white" : opt.color,
                  }}
                >
                  {isChosen ? "✓" : opt.label}
                </div>

                <div className="flex-1 min-w-0">
                  {/* emoji + text */}
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0 leading-snug">{choice.emoji}</span>
                    <p
                      className="text-sm font-medium leading-snug pt-0.5"
                      style={{ color: isChosen ? opt.color : "#1e293b" }}
                    >
                      {choice.text}
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* feedback panel */}
      <AnimatePresence>
        {showFeedback && chosen !== null && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-2xl p-4 border-2"
            style={{
              background: scene.choices[chosen].isGood ? "#f0fdf4" : "#fef3f2",
              borderColor: scene.choices[chosen].isGood ? "#bbf7d0" : "#fecaca",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {scene.choices[chosen].isGood ? "✅" : "💡"}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{
                      color: scene.choices[chosen].isGood ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {scene.choices[chosen].isGood ? "¡Decisión excelente!" : "Momento de aprender"}
                  </p>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-black text-white"
                    style={{
                      background: scene.choices[chosen].isGood ? "#16a34a" : "#ea580c",
                    }}
                  >
                    +{scene.choices[chosen].points} pts
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {scene.choices[chosen].feedback}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="mt-4 w-full rounded-xl py-3 text-sm font-bold text-white shadow"
              style={{ background: simulation.gradient }}
            >
              {sceneIdx + 1 < simulation.scenes.length
                ? "Continuar → Siguiente escena"
                : "🎯 Ver mi resultado final"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Intro screen ──────────────────────────────────────────
function SimulationIntro({
  simulation,
  onStart,
  onBack,
}: {
  simulation: Simulation;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto px-4 py-8 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-8xl mb-4"
      >
        {simulation.emoji}
      </motion.div>

      <div
        className="inline-block rounded-full px-4 py-1.5 text-xs font-bold text-white mb-3"
        style={{ background: simulation.gradient }}
      >
        Simulación de carrera
      </div>

      <h2 className="text-3xl font-black text-slate-900 mb-2">
        {simulation.title}
      </h2>
      <p
        className="text-sm font-semibold mb-5"
        style={{ color: simulation.color }}
      >
        {simulation.tagline}
      </p>

      <div
        className="rounded-2xl p-4 mb-6 text-left border"
        style={{
          background: `${simulation.color}08`,
          borderColor: `${simulation.color}25`,
        }}
      >
        <p className="text-sm text-slate-700 leading-relaxed">
          {simulation.intro}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { n: simulation.scenes.length, label: "Escenas" },
          { n: simulation.scenes.length * 3, label: "Decisiones" },
          { n: "100", label: "Puntos máx." },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3 border"
            style={{
              background: `${simulation.color}08`,
              borderColor: `${simulation.color}20`,
            }}
          >
            <p
              className="text-xl font-black"
              style={{ color: simulation.color }}
            >
              {s.n}
            </p>
            <p className="text-[10px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full rounded-xl py-4 text-base font-bold text-white shadow-xl"
          style={{
            background: simulation.gradient,
            boxShadow: `0 12px 32px ${simulation.color}40`,
          }}
        >
          🎬 Comenzar la simulación
        </motion.button>
        <button
          onClick={onBack}
          className="text-sm text-slate-500 hover:text-slate-700 transition"
        >
          ← Elegir otra carrera
        </button>
      </div>
    </motion.div>
  );
}

// ─── Career selector ───────────────────────────────────────
function CareerSelector({
  onSelect,
}: {
  onSelect: (sim: Simulation) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-4 py-1.5 text-xs font-bold text-white mb-3"
        >
          ✨ Simulador de carreras
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-black text-slate-900 sm:text-4xl"
        >
          Vive la carrera antes de elegirla
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto"
        >
          Toma decisiones reales como un profesional. Al final sabrás qué tan apto eres — del 0% al 100%.
        </motion.p>
      </div>

      {/* ── Featured: Astronauta (real game) ── */}
      <motion.a
        href="/simular/astronauta"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        whileHover={{ y: -4, scale: 1.01 }}
        className="group relative mb-6 flex overflow-hidden rounded-3xl p-6 shadow-2xl cursor-pointer"
        style={{
          background: "radial-gradient(ellipse at top left, #0f0c29 0%, #000510 100%)",
          border: "1.5px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 60px rgba(220,38,38,0.25)",
          textDecoration: "none",
        }}
      >
        {/* Stars background inside card */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 2 + 0.5,
                height: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.7 + 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl flex-shrink-0"
          >
            🚀
          </motion.div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ background: "linear-gradient(135deg,#dc2626,#f97316)" }}>
                🎮 JUEGO REAL
              </span>
              <span className="rounded-full px-3 py-1 text-xs font-bold text-white/80 border border-white/20">
                Modo experimental
              </span>
            </div>
            <h3 className="text-white text-2xl font-black mb-1">Astronauta — Misión Apolo X</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              No es una encuesta. Es un juego real: lanza el cohete con timing perfecto, esquiva asteroides en tiempo real, aterriza en la Luna con física real y recoge rocas lunares. ¿Tienes lo que se necesita?
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {["🚀 Lanzamiento", "☄️ Asteroides", "🌕 Aterrizaje", "🧑‍🚀 Paseo Lunar"].map((f) => (
                <span key={f} className="rounded-full px-3 py-1 text-xs font-medium text-white/70" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white/60 text-2xl group-hover:text-white transition"
            >
              →
            </motion.div>
          </div>
        </div>
      </motion.a>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {simulations.map((sim, i) => (
          <motion.button
            key={sim.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(sim)}
            className="group relative overflow-hidden rounded-3xl p-5 text-left shadow-lg transition-shadow hover:shadow-xl"
            style={{
              background: `linear-gradient(145deg, ${sim.color}15 0%, ${sim.color}05 100%)`,
              border: `1.5px solid ${sim.color}25`,
            }}
          >
            {/* glow */}
            <div
              className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-50"
              style={{ background: sim.color }}
            />

            <div className="relative z-10">
              <div className="mb-3 flex items-start justify-between">
                <motion.span
                  className="text-5xl"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                >
                  {sim.emoji}
                </motion.span>
                <span
                  className="rounded-full px-2 py-1 text-[10px] font-bold text-white"
                  style={{ background: sim.gradient }}
                >
                  {sim.scenes.length} escenas
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1">
                {sim.title}
              </h3>
              <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                {sim.tagline}
              </p>

              <div
                className="mt-4 flex items-center gap-2 text-xs font-bold"
                style={{ color: sim.color }}
              >
                <span>Simular ahora</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Page root ─────────────────────────────────────────────
type Phase = "select" | "intro" | "playing" | "result";

export default function SimularPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selected, setSelected] = useState<Simulation | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [finalMax, setFinalMax] = useState(100);

  const handleSelect = (sim: Simulation) => {
    setSelected(sim);
    setPhase("intro");
  };

  const handleStart = () => setPhase("playing");

  const handleFinish = (score: number, max: number) => {
    setFinalScore(score);
    setFinalMax(max);
    setPhase("result");
  };

  const handleRetry = () => {
    setFinalScore(0);
    setPhase("intro");
  };

  const handleExit = () => {
    setSelected(null);
    setFinalScore(0);
    setPhase("select");
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top left,rgba(220,38,38,0.10),transparent 30%),radial-gradient(circle at bottom right,rgba(244,63,94,0.08),transparent 30%),linear-gradient(180deg,#fff5f5 0%,#fef2f2 100%)",
      }}
    >
      {/* Top nav */}
      <div className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <a
            href="/"
            className="flex items-center gap-2 text-slate-600 transition hover:text-red-600"
          >
            <span className="text-lg">←</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-500 text-white text-sm font-black shadow">
              VT
            </div>
          </a>

          <div className="flex-1">
            <h1 className="text-sm font-extrabold text-slate-900">
              Simular Carrera
            </h1>
            {selected && (
              <p className="text-xs text-slate-500">{selected.title}</p>
            )}
          </div>

          {selected && phase !== "select" && (
            <button
              onClick={handleExit}
              className="text-xs text-slate-500 hover:text-red-600 transition font-medium"
            >
              Cambiar carrera
            </button>
          )}
        </div>

        {/* progress strip for playing */}
        {phase === "playing" && selected && (
          <div
            className="h-0.5 transition-all"
            style={{ background: selected.gradient }}
          />
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {phase === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CareerSelector onSelect={handleSelect} />
          </motion.div>
        )}

        {phase === "intro" && selected && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SimulationIntro
              simulation={selected}
              onStart={handleStart}
              onBack={handleExit}
            />
          </motion.div>
        )}

        {phase === "playing" && selected && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SimulationGame simulation={selected} onFinish={handleFinish} />
          </motion.div>
        )}

        {phase === "result" && selected && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultScreen
              simulation={selected}
              score={finalScore}
              maxScore={finalMax}
              onRetry={handleRetry}
              onExit={handleExit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
