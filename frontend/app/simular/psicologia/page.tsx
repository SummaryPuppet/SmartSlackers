"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

type GamePhase = "briefing" | "emotion" | "technique" | "response" | "crisis" | "result";
const PHASE_ORDER: GamePhase[] = ["briefing", "emotion", "technique", "response", "crisis", "result"];

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i, x: parseFloat((Math.random() * 100).toFixed(2)), y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 2 + 0.5).toFixed(1)), opacity: parseFloat((Math.random() * 0.1 + 0.03).toFixed(2)),
  dur: 5 + Math.random() * 6, delay: Math.random() * 4,
}));

const EMOTION_CASES = [
  { quote: "\"Siento que nada tiene sentido. Trabajo todo el día pero al llegar a casa estoy vacío por dentro.\"", options: ["Ansiedad", "Depresión", "Frustración", "Tristeza"], correct: 1 },
  { quote: "\"¡No puedo más! Cada pequeña cosa me hace explotar. Siento que voy a perder el control.\"", options: ["Tristeza", "Aburrimiento", "Ira desregulada", "Timidez"], correct: 2 },
  { quote: "\"Antes de hablar en público, mi corazón se acelera, sudo y quiero salir corriendo.\"", options: ["Depresión", "Ansiedad social", "Indiferencia", "Orgullo"], correct: 1 },
  { quote: "\"Mi pareja me dejó hace 3 meses pero aún lloro todos los días y no puedo comer bien.\"", options: ["Ansiedad generalizada", "Duelo complicado", "Euforia", "Enojo"], correct: 1 },
  { quote: "\"Últimamente me siento raro, como si observara mi propia vida desde afuera.\"", options: ["Alegría extrema", "Disociación", "Confianza alta", "Timidez"], correct: 1 },
];

const TECHNIQUE_CASES = [
  { scenario: "Paciente con pensamientos automáticos negativos sobre sí mismo: 'soy un fracasado'", options: ["Terapia Cognitivo-Conductual", "Psicoanálisis clásico", "Gestalt integrativa", "Hipnosis regresiva"], correct: 0 },
  { scenario: "Paciente que no puede procesar un trauma de infancia y lo evita hablar", options: ["Conductismo puro", "EMDR o terapia de trauma", "Exposición sin apoyo", "Análisis transaccional"], correct: 1 },
  { scenario: "Paciente que necesita explorar su propósito de vida y autorrealización", options: ["TCC estricta", "Psicoanálisis freudiano", "Terapia humanista-existencial", "Conductismo operante"], correct: 2 },
];

const RESPONSE_SCENARIOS = [
  {
    patient: "\"No sirvo para nada. Estoy seguro de que todos me odian en el trabajo.\"",
    options: [
      "\"Eso es falso, seguro exageras las cosas.\"",
      "\"Parece que estás teniendo pensamientos muy dolorosos sobre ti mismo. Cuéntame más.\"",
      "\"Tienes que ser más positivo y pensar en lo bueno.\"",
    ],
    correct: 1,
  },
  {
    patient: "\"¿Para qué sigo viniendo? Terapia no sirve de nada.\"",
    options: [
      "\"Entiendo tu frustración. ¿Qué esperabas que cambiara hasta ahora?\"",
      "\"Si no confías en el proceso, no podemos continuar.\"",
      "\"Tienes razón, la terapia no sirve para todos.\"",
    ],
    correct: 0,
  },
  {
    patient: "\"Ayer pensé en hacerme daño pero no lo hice.\"",
    options: [
      "\"Eso no es bueno. ¿Por qué pensaste eso?\"",
      "\"Gracias por contarme. Eso requiere valentía. ¿Puedes contarme más sobre ese momento?\"",
      "\"Debes llamar al 113 inmediatamente.\"",
    ],
    correct: 1,
  },
];

const CRISIS_STEPS = [
  { id: 0, text: "Escuchar activamente sin juzgar", order: 0 },
  { id: 1, text: "Evaluar el riesgo suicida (ideación, plan, medio, intención)", order: 1 },
  { id: 2, text: "Establecer un plan de seguridad con el paciente", order: 2 },
  { id: 3, text: "Contactar a la red de apoyo familiar con consentimiento", order: 3 },
  { id: 4, text: "Derivar a servicio de urgencias si el riesgo es inminente", order: 4 },
];

function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["emotion", "technique", "response", "crisis"];
  return (
    <div className="flex items-center gap-1 w-32">
      {phases.map((p, i) => (
        <div key={p} className="h-1.5 flex-1 rounded-full transition-all"
          style={{ background: scores[i] !== undefined ? scores[i] >= 20 ? "#4ade80" : scores[i] >= 10 ? "#c4b5fd" : "#f87171" : phase === p ? "rgba(196,181,253,0.7)" : "rgba(255,255,255,0.15)" }} />
      ))}
    </div>
  );
}

// ── GAME 1: Identificar Emoción ──────────────────────────────
function EmotionGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const doneRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = (pts: number) => {
    const ns = score + pts; setScore(ns);
    if (current >= 4) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1100); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); setTimeLeft(10); }, 1000);
    }
  };

  useEffect(() => {
    if (doneRef.current || feedback !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFeedback(-1); advance(0); return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, feedback]);

  const handle = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setFeedback(idx);
    advance(idx === EMOTION_CASES[current].correct ? 5 : 0);
  };

  const c = EMOTION_CASES[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-purple-300 text-xs uppercase tracking-widest mb-1">Sala de Terapia — {current + 1}/5</p>
        <h2 className="text-white text-xl font-black">¿Qué emoción predomina?</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-purple-400 rounded-full" style={{ width: `${(timeLeft / 10) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span className="text-purple-300/60 text-sm">{timeLeft}s</span>
      </div>
      <motion.div key={current} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/5 border border-purple-500/20 rounded-2xl p-5">
        <div className="flex gap-3 items-start">
          <span className="text-3xl shrink-0">🛋️</span>
          <p className="text-white/90 text-sm leading-relaxed italic">{c.quote}</p>
        </div>
      </motion.div>
      <div className="w-full grid grid-cols-2 gap-3">
        {c.options.map((opt, i) => {
          let bg = "rgba(139,92,246,0.1)"; let border = "rgba(139,92,246,0.25)";
          if (feedback !== null) {
            if (i === c.correct) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (i === feedback) { bg = "rgba(248,113,113,0.2)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handle(i)} whileHover={feedback === null ? { scale: 1.03 } : {}}
              className="rounded-xl px-3 py-3 text-white text-sm font-semibold border-2 transition-colors"
              style={{ background: bg, borderColor: border }}>
              {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`font-bold text-sm ${feedback === c.correct ? "text-green-400" : "text-purple-300"}`}>
          {feedback === c.correct ? "✅ Identificación correcta" : `💡 La emoción principal es: ${c.options[c.correct]}`}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 2: Técnica Terapéutica ──────────────────────────────
function TechniqueGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handle = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(idx);
    const correct = idx === TECHNIQUE_CASES[current].correct;
    const ns = score + (correct ? 9 : 0);
    setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1100); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1100);
    }
  };

  const tc = TECHNIQUE_CASES[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-purple-300 text-xs uppercase tracking-widest mb-1">Selección de Técnica — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">¿Qué enfoque aplicas?</h2>
      </div>
      <motion.div key={current} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/5 border border-purple-500/20 rounded-2xl p-5">
        <div className="flex gap-3">
          <span className="text-3xl shrink-0">📋</span>
          <p className="text-white text-sm leading-relaxed">{tc.scenario}</p>
        </div>
      </motion.div>
      <div className="w-full space-y-2">
        {tc.options.map((opt, i) => {
          let bg = "rgba(139,92,246,0.1)"; let border = "rgba(139,92,246,0.25)";
          if (feedback !== null) {
            if (i === tc.correct) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (i === feedback) { bg = "rgba(248,113,113,0.2)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handle(i)} whileHover={feedback === null ? { scale: 1.02 } : {}}
              className="w-full rounded-xl px-4 py-3 text-white text-sm font-medium border-2 text-left transition-colors"
              style={{ background: bg, borderColor: border }}>
              {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-sm font-bold ${feedback === tc.correct ? "text-green-400" : "text-purple-300"}`}>
          {feedback === tc.correct ? "✅ ¡Técnica adecuada para este caso!" : `💡 Lo óptimo es: ${tc.options[tc.correct]}`}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 3: Respuesta Empática ───────────────────────────────
function ResponseGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handle = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(idx);
    const correct = idx === RESPONSE_SCENARIOS[current].correct;
    const ns = score + (correct ? 9 : 1);
    setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1100); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1200);
    }
  };

  const s = RESPONSE_SCENARIOS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-purple-300 text-xs uppercase tracking-widest mb-1">Sesión de Terapia — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">¿Cómo respondes?</h2>
      </div>
      <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/5 border border-purple-500/20 rounded-2xl p-5">
        <div className="flex gap-3">
          <span className="text-3xl shrink-0">🧑</span>
          <p className="text-white/90 text-sm leading-relaxed italic">{s.patient}</p>
        </div>
      </motion.div>
      <div className="w-full space-y-2">
        {s.options.map((opt, i) => {
          let bg = "rgba(139,92,246,0.1)"; let border = "rgba(139,92,246,0.25)";
          if (feedback !== null) {
            if (i === s.correct) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (i === feedback && i !== s.correct) { bg = "rgba(248,113,113,0.15)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handle(i)} whileHover={feedback === null ? { scale: 1.02 } : {}}
              className="w-full rounded-xl px-4 py-3 text-white text-sm border-2 text-left transition-colors"
              style={{ background: bg, borderColor: border }}>
              🗣 {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-sm font-bold ${feedback === s.correct ? "text-green-400" : "text-purple-300"}`}>
          {feedback === s.correct ? "✅ Respuesta terapéutica óptima" : "💡 Un psicólogo valida primero, luego indaga."}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 4: Manejo de Crisis ─────────────────────────────────
function CrisisGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [order, setOrder] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handle = (id: number) => {
    if (done || order.includes(id)) return;
    const step = order.length;
    const expected = CRISIS_STEPS.find(s => s.order === step)!.id;
    if (id === expected) {
      const no = [...order, id];
      setOrder(no);
      if (no.length === CRISIS_STEPS.length && !doneRef.current) {
        doneRef.current = true; setDone(true);
        setTimeout(() => onComplete(Math.max(5, 25 - mistakes * 4)), 800);
      }
    } else {
      setMistakes(m => m + 1); setShake(id);
      setTimeout(() => setShake(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-purple-300 text-xs uppercase tracking-widest mb-1">Intervención en Crisis</p>
        <h2 className="text-white text-xl font-black">Protocolo de Crisis Suicida</h2>
        <p className="text-white/60 text-sm">Ordena los pasos correctos del protocolo de intervención</p>
      </div>
      <div className="flex gap-3 text-sm">
        <span className="text-purple-300">{order.length}/5 pasos</span>
        <span className="text-red-400">❌ {mistakes} errores</span>
      </div>
      <div className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-4">
        <p className="text-purple-300 text-xs font-bold uppercase mb-3">Protocolo ejecutado:</p>
        <div className="space-y-1.5 min-h-8">
          {order.map((id, i) => {
            const step = CRISIS_STEPS.find(s => s.id === id)!;
            return (
              <motion.div key={id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-purple-500/10 border border-purple-400/20 rounded-lg px-3 py-1.5">
                <span className="text-purple-400 text-xs font-bold w-4">{i + 1}.</span>
                <span className="text-white text-xs">{step.text}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="w-full space-y-2">
        {CRISIS_STEPS.map(step => {
          const placed = order.includes(step.id);
          const isNext = order.length === step.order;
          return (
            <motion.button key={step.id} onClick={() => handle(step.id)} disabled={placed || done}
              animate={shake === step.id ? { x: [-5, 5, -4, 4, 0] } : {}}
              whileHover={!placed && !done ? { scale: 1.02 } : {}}
              className="w-full text-left rounded-xl p-3 border-2 text-sm transition-all"
              style={{
                background: placed ? "rgba(74,222,128,0.1)" : "rgba(139,92,246,0.1)",
                borderColor: placed ? "#4ade80" : isNext ? "#8b5cf6" : "rgba(139,92,246,0.25)",
                opacity: placed ? 0.5 : 1,
                color: placed ? "#4ade80" : "white",
              }}>
              {placed ? "✅" : isNext ? "▶" : "○"} {step.text}
            </motion.button>
          );
        })}
      </div>
      {done && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-black">🧠 ¡Protocolo ejecutado correctamente!</motion.p>}
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────
function ResultScreen({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const rank = pct >= 85 ? "Psicólogo Clínico" : pct >= 65 ? "Terapeuta Certificado" : pct >= 40 ? "Asistente de Salud Mental" : "Estudiante de Conducta";
  const color = pct >= 85 ? "#4ade80" : pct >= 65 ? "#c4b5fd" : pct >= 40 ? "#60a5fa" : "#f87171";
  const phases = ["Emociones", "Técnica", "Respuesta", "Crisis"];
  const circ = 2 * Math.PI * 50;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-sm mx-auto">
      <p className="text-purple-300 text-xs uppercase tracking-widest">Evaluación Clínica</p>
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <motion.circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{pct}%</span>
          <span className="text-white/50 text-xs">empatía clínica</span>
        </div>
      </div>
      <p className="text-2xl font-black text-center" style={{ color }}>🧠 {rank}</p>
      <div className="w-full space-y-2">
        {phases.map((name, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-white/60 text-sm w-24 shrink-0">{name}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: (scores[i] ?? 0) >= 20 ? "#4ade80" : (scores[i] ?? 0) >= 12 ? "#c4b5fd" : "#f87171" }}
                initial={{ width: 0 }} animate={{ width: `${((scores[i] ?? 0) / 25) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.15 }} />
            </div>
            <span className="text-white font-bold text-sm w-10 text-right">{scores[i] ?? 0}/25</span>
          </div>
        ))}
      </div>
      <button onClick={() => { window.location.href = "/simular"; }} className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition">
        ← Volver al simulador
      </button>
    </div>
  );
}

export default function PsicologiaGame() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);

  const advance = (score: number) => {
    setScores(s => [...s, score]);
    setPhase(PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1]);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#1e0b40 0%,#2d1260 60%,#1e0b40 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-purple-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
      <Navbar variant="dark" title="🧠 Psicología — Consulta Clínica" backHref="/simular" rightSlot={<ScoreBar phase={phase} scores={scores} />} />
      <div className="relative max-w-lg mx-auto py-8">
        <AnimatePresence mode="wait">
          {phase === "briefing" && (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl">🧠</motion.div>
              <h1 className="text-white text-3xl font-black">La Consulta</h1>
              <p className="text-white/70 text-lg">Eres psicólogo clínico. Tus pacientes necesitan ayuda real.</p>
              <div className="w-full bg-white/5 border border-purple-500/20 rounded-2xl p-5 text-left space-y-3">
                {["💬 Identifica la emoción predominante en 5 pacientes", "🎯 Elige la técnica terapéutica correcta para cada caso", "🗣 Responde empáticamente a situaciones difíciles", "🚨 Ejecuta el protocolo de intervención en crisis"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-sm"><span className="text-white/40 text-xs w-4">{i + 1}.</span>{t}</div>
                ))}
              </div>
              <motion.button onClick={() => setPhase("emotion")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl text-white text-xl font-black" style={{ background: "linear-gradient(135deg,#7c3aed,#4c1d95)" }}>
                🛋️ Iniciar Consulta
              </motion.button>
            </motion.div>
          )}
          {phase === "emotion" && <motion.div key="g1" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><EmotionGame onComplete={advance} /></motion.div>}
          {phase === "technique" && <motion.div key="g2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><TechniqueGame onComplete={advance} /></motion.div>}
          {phase === "response" && <motion.div key="g3" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><ResponseGame onComplete={advance} /></motion.div>}
          {phase === "crisis" && <motion.div key="g4" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><CrisisGame onComplete={advance} /></motion.div>}
          {phase === "result" && <motion.div key="r" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}><ResultScreen scores={scores} /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
