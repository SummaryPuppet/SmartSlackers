"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

type GamePhase = "briefing" | "blueprint" | "materials" | "balance" | "presentation" | "result";
const PHASE_ORDER: GamePhase[] = ["briefing", "blueprint", "materials", "balance", "presentation", "result"];

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i, x: parseFloat((Math.random() * 100).toFixed(2)), y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 2 + 0.5).toFixed(1)), opacity: parseFloat((Math.random() * 0.1 + 0.03).toFixed(2)),
  dur: 5 + Math.random() * 5, delay: Math.random() * 4,
}));

const ROOMS = [
  { id: 0, emoji: "🛏️", name: "Dormitorio", needed: true },
  { id: 1, emoji: "🚿", name: "Baño", needed: true },
  { id: 2, emoji: "🍳", name: "Cocina", needed: true },
  { id: 3, emoji: "🛋️", name: "Sala", needed: true },
  { id: 4, emoji: "🚗", name: "Garaje", needed: false },
  { id: 5, emoji: "🌿", name: "Jardín", needed: false },
];

const MATERIALS = [
  { zone: "Cimentación", options: ["Concreto armado", "Madera blanda", "Adobe"], correct: 0, emoji: "🏗️" },
  { zone: "Estructura", options: ["Acero galvanizado", "Bambú", "Plástico PVC"], correct: 0, emoji: "🔩" },
  { zone: "Paredes", options: ["Ladrillo cocido", "Cartón piedra", "Papel prensado"], correct: 0, emoji: "🧱" },
  { zone: "Techumbre", options: ["Losa aligerada", "Hojas de palmera", "Tela plastificada"], correct: 0, emoji: "🏠" },
];

const CLIENT_QUESTIONS = [
  {
    question: "El cliente pide reducir el presupuesto a la mitad. ¿Qué propones?",
    options: [
      "Usar materiales de baja calidad para ahorrar",
      "Revisar el diseño y optimizar espacios sin sacrificar calidad",
      "Decirle que es imposible y cobrar más",
    ],
    correct: 1,
  },
  {
    question: "El cliente quiere ventanas enormes en todas las paredes. ¿Qué le explicas?",
    options: [
      "Se puede hacer sin problemas, el cliente siempre tiene razón",
      "Evalúa orientación solar y carga estructural antes de decidir",
      "No es posible en ningún caso por normas",
    ],
    correct: 1,
  },
  {
    question: "La municipalidad pide cambiar los planos. ¿Cómo actúas?",
    options: [
      "Ignoras el pedido y continúas con los planos originales",
      "Revisas el Reglamento Nacional de Edificaciones y coordinas los cambios",
      "Le dices al cliente que pelee con la municipalidad",
    ],
    correct: 1,
  },
];

function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["blueprint", "materials", "balance", "presentation"];
  return (
    <div className="flex items-center gap-1 w-32">
      {phases.map((p, i) => (
        <div key={p} className="h-1.5 flex-1 rounded-full transition-all"
          style={{ background: scores[i] !== undefined ? scores[i] >= 20 ? "#4ade80" : scores[i] >= 10 ? "#fbbf24" : "#f87171" : phase === p ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)" }} />
      ))}
    </div>
  );
}

// ── GAME 1: Plano de la Casa ─────────────────────────────────
function BlueprintGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<{ id: number; ok: boolean } | null>(null);
  const doneRef = useRef(false);

  const neededRooms = ROOMS.filter(r => r.needed);

  const handleRoom = (id: number) => {
    if (doneRef.current || placed.includes(id) || done) return;
    const room = ROOMS.find(r => r.id === id)!;
    if (room.needed) {
      const np = [...placed, id];
      setFlash({ id, ok: true }); setTimeout(() => setFlash(null), 500);
      setPlaced(np);
      if (np.length === neededRooms.length) {
        doneRef.current = true; setDone(true);
        setTimeout(() => onComplete(Math.max(5, 25 - mistakes * 5)), 800);
      }
    } else {
      setMistakes(m => m + 1); setFlash({ id, ok: false }); setTimeout(() => setFlash(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-blue-300 text-xs uppercase tracking-widest mb-1">Estudio de Arquitectura</p>
        <h2 className="text-white text-xl font-black">Diseña el Plano de la Casa</h2>
        <p className="text-white/60 text-sm">El cliente pidió: dormitorio, baño, cocina y sala. ¡Solo esos!</p>
      </div>
      <div className="flex gap-3 text-sm">
        <span className="text-green-400">✅ {placed.length}/{neededRooms.length}</span>
        <span className="text-red-400">❌ {mistakes} errores</span>
      </div>
      <div className="w-full bg-white/5 border border-blue-500/20 rounded-2xl p-4">
        <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">📋 PLANO ACTUAL:</p>
        <div className="grid grid-cols-4 gap-2 min-h-16">
          {placed.map(id => {
            const room = ROOMS.find(r => r.id === id)!;
            return (
              <motion.div key={id} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-1 bg-blue-500/20 rounded-lg p-2 border border-blue-400/30">
                <span className="text-2xl">{room.emoji}</span>
                <span className="text-blue-300 text-xs">{room.name}</span>
              </motion.div>
            );
          })}
          {placed.length === 0 && <div className="col-span-4 text-center text-white/30 text-sm py-4">Agrega habitaciones</div>}
        </div>
      </div>
      <div className="w-full">
        <p className="text-white/50 text-xs font-bold uppercase mb-2">Habitaciones disponibles:</p>
        <div className="grid grid-cols-3 gap-2">
          {ROOMS.map(room => (
            <motion.button key={room.id} onClick={() => handleRoom(room.id)}
              disabled={placed.includes(room.id) || done}
              animate={flash?.id === room.id ? { scale: flash.ok ? [1, 1.3, 1] : [1, 0.8, 1] } : {}}
              whileHover={!placed.includes(room.id) && !done ? { scale: 1.05 } : {}}
              className="flex flex-col items-center gap-1 rounded-xl p-3 border-2 transition-all"
              style={{
                background: placed.includes(room.id) ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.07)",
                borderColor: placed.includes(room.id) ? "#4ade80" : "rgba(255,255,255,0.2)",
                opacity: placed.includes(room.id) ? 0.4 : 1,
              }}>
              <span className="text-3xl">{room.emoji}</span>
              <span className="text-white text-xs">{room.name}</span>
              {!room.needed && <span className="text-yellow-400 text-[10px]">⚠ No pedido</span>}
            </motion.button>
          ))}
        </div>
      </div>
      {done && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-black">🏠 ¡Plano completado!</motion.p>}
    </div>
  );
}

// ── GAME 2: Materiales ───────────────────────────────────────
function MaterialsGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handle = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(idx);
    const correct = idx === MATERIALS[current].correct;
    const pts = correct ? 7 : 0;
    const ns = score + pts;
    setScore(ns);
    if (current >= 3) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1100); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1000);
    }
  };

  const m = MATERIALS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-blue-300 text-xs uppercase tracking-widest mb-1">Selección de Materiales — {current + 1}/4</p>
        <h2 className="text-white text-xl font-black">¿Qué material usas?</h2>
      </div>
      <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/5 border border-blue-500/20 rounded-2xl p-5 text-center">
        <div className="text-5xl mb-3">{m.emoji}</div>
        <p className="text-white text-lg font-black">{m.zone}</p>
        <p className="text-white/50 text-sm mt-1">¿Cuál es el material estructuralmente correcto?</p>
      </motion.div>
      <div className="w-full space-y-3">
        {m.options.map((opt, i) => {
          let bg = "rgba(255,255,255,0.07)"; let border = "rgba(255,255,255,0.15)";
          if (feedback !== null) {
            if (i === m.correct) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (i === feedback) { bg = "rgba(248,113,113,0.2)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handle(i)} whileHover={feedback === null ? { scale: 1.02 } : {}}
              className="w-full rounded-xl px-4 py-3 text-white font-semibold text-sm border-2 text-left transition-colors"
              style={{ background: bg, borderColor: border }}>
              {["🧱", "🪵", "⚙️"][i]} {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`font-black ${feedback === m.correct ? "text-green-400" : "text-red-400"}`}>
          {feedback === m.correct ? "✅ ¡Correcto! Material adecuado" : `❌ El correcto es: ${m.options[m.correct]}`}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 3: Balance Estructural ──────────────────────────────
function BalanceGame({ onComplete }: { onComplete: (s: number) => void }) {
  const tiltRef = useRef(0);
  const [tilt, setTilt] = useState(0);
  const [floors, setFloors] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [corrections, setCorrections] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const drift = setInterval(() => {
      tiltRef.current += (Math.random() - 0.45) * 3;
      tiltRef.current = Math.max(-40, Math.min(40, tiltRef.current));
      setTilt(tiltRef.current);
    }, 600);

    const addFloor = setInterval(() => {
      setFloors(f => Math.min(f + 1, 8));
    }, 4000);

    return () => { clearInterval(drift); clearInterval(addFloor); };
  }, []);

  useEffect(() => {
    if (Math.abs(tiltRef.current) > 35 && !doneRef.current) {
      doneRef.current = true;
      setTimeout(() => onComplete(Math.max(0, Math.round(corrections * 2.5))), 800);
    }
  }, [tilt, corrections, onComplete]);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(25, corrections * 2 + 5)), 500); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [corrections, onComplete]);

  const correct = (dir: number) => {
    if (doneRef.current) return;
    tiltRef.current -= dir * 12;
    tiltRef.current = Math.max(-40, Math.min(40, tiltRef.current));
    setTilt(tiltRef.current);
    setCorrections(c => c + 1);
  };

  const danger = Math.abs(tilt) > 25;
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-sm mx-auto">
      <div className="text-center">
        <p className="text-blue-300 text-xs uppercase tracking-widest mb-1">Análisis Estructural</p>
        <h2 className="text-white text-xl font-black">Mantén la Torre en Pie</h2>
        <p className="text-white/60 text-sm">Usa los soportes para equilibrar el edificio</p>
      </div>
      <div className="flex gap-4 text-sm">
        <span className="text-white/60">⏱ {timeLeft}s</span>
        <span className="text-blue-300">{floors} pisos</span>
        <span className={danger ? "text-red-400 animate-pulse font-bold" : "text-white/40"}>
          {danger ? "⚠ PELIGRO" : `Inclinación: ${tilt.toFixed(0)}°`}
        </span>
      </div>
      <div className="flex items-end justify-center" style={{ height: 200 }}>
        <motion.div style={{ rotate: tilt, originY: 1, originX: 0.5 }} className="flex flex-col-reverse items-center gap-0.5">
          {Array.from({ length: floors }).map((_, i) => (
            <div key={i} className="rounded-sm text-2xl flex items-center justify-center border border-blue-400/30"
              style={{ width: 60 - i * 3, height: 22, background: i === 0 ? "rgba(37,99,235,0.5)" : `rgba(37,99,235,${0.2 + i * 0.05})` }}>
              {i === floors - 1 ? "🏗️" : ""}
            </div>
          ))}
          <div className="w-20 h-3 rounded-sm" style={{ background: "rgba(37,99,235,0.8)" }} />
        </motion.div>
      </div>
      <div className="flex gap-4">
        <motion.button onClick={() => correct(1)} whileTap={{ scale: 0.92 }}
          className="w-24 h-16 rounded-2xl text-white font-black text-sm border-2 border-blue-400/30" style={{ background: "rgba(37,99,235,0.2)" }}>
          ← Soporte<br />Izquierdo
        </motion.button>
        <motion.button onClick={() => correct(-1)} whileTap={{ scale: 0.92 }}
          className="w-24 h-16 rounded-2xl text-white font-black text-sm border-2 border-blue-400/30" style={{ background: "rgba(37,99,235,0.2)" }}>
          Soporte →<br />Derecho
        </motion.button>
      </div>
      {Math.abs(tilt) > 35 && !doneRef.current && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 font-black">💥 ¡El edificio colapsó!</motion.p>
      )}
    </div>
  );
}

// ── GAME 4: Presentación al Cliente ─────────────────────────
function PresentationGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handle = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(idx);
    const correct = idx === CLIENT_QUESTIONS[current].correct;
    const pts = correct ? 9 : 2;
    const ns = score + pts;
    setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1200); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1100);
    }
  };

  const q = CLIENT_QUESTIONS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-blue-300 text-xs uppercase tracking-widest mb-1">Reunión con el Cliente — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">¿Cómo respondes?</h2>
      </div>
      <motion.div key={current} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/5 border border-blue-500/20 rounded-2xl p-5">
        <div className="flex gap-3 items-start">
          <span className="text-3xl">🧑‍💼</span>
          <p className="text-white text-sm leading-relaxed font-semibold">{q.question}</p>
        </div>
      </motion.div>
      <div className="w-full space-y-3">
        {q.options.map((opt, i) => {
          let bg = "rgba(255,255,255,0.07)"; let border = "rgba(255,255,255,0.15)";
          if (feedback !== null) {
            if (i === q.correct) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (i === feedback && i !== q.correct) { bg = "rgba(248,113,113,0.15)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handle(i)} whileHover={feedback === null ? { scale: 1.02 } : {}}
              className="w-full rounded-xl px-4 py-3 text-white text-sm border-2 text-left transition-colors"
              style={{ background: bg, borderColor: border }}>
              {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`font-bold text-sm ${feedback === q.correct ? "text-green-400" : "text-orange-400"}`}>
          {feedback === q.correct ? "✅ Respuesta profesional" : "💡 Un arquitecto siempre busca la solución técnica correcta"}
        </motion.p>
      )}
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────
function ResultScreen({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const rank = pct >= 85 ? "Arquitecto Maestro" : pct >= 65 ? "Diseñador Brillante" : pct >= 40 ? "Proyectista Novato" : "Estudiante de Arte";
  const color = pct >= 85 ? "#4ade80" : pct >= 65 ? "#fbbf24" : pct >= 40 ? "#60a5fa" : "#f87171";
  const phases = ["Planos", "Materiales", "Equilibrio", "Presentación"];
  const circ = 2 * Math.PI * 50;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-sm mx-auto">
      <p className="text-blue-300 text-xs uppercase tracking-widest">Evaluación Arquitectónica</p>
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <motion.circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{pct}%</span>
          <span className="text-white/50 text-xs">aptitud</span>
        </div>
      </div>
      <p className="text-2xl font-black text-center" style={{ color }}>🏛️ {rank}</p>
      <div className="w-full space-y-2">
        {phases.map((name, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-white/60 text-sm w-28 shrink-0">{name}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: (scores[i] ?? 0) >= 20 ? "#4ade80" : (scores[i] ?? 0) >= 12 ? "#fbbf24" : "#f87171" }}
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

export default function ArquitecturaGame() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);

  const advance = (score: number) => {
    setScores(s => [...s, score]);
    setPhase(PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1]);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#001a3d 0%,#002966 60%,#001a3d 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-blue-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
      <Navbar variant="dark" title="🏛️ Arquitectura — Estudio Creativo" backHref="/simular" rightSlot={<ScoreBar phase={phase} scores={scores} />} />
      <div className="relative max-w-lg mx-auto py-8">
        <AnimatePresence mode="wait">
          {phase === "briefing" && (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl">🏛️</motion.div>
              <h1 className="text-white text-3xl font-black">¡Al Estudio!</h1>
              <p className="text-white/70 text-lg">Eres arquitecto. Tienes un proyecto completo que entregar hoy.</p>
              <div className="w-full bg-white/5 border border-blue-500/20 rounded-2xl p-5 text-left space-y-3">
                {["📐 Diseña el plano con solo las habitaciones necesarias", "🧱 Elige los materiales estructuralmente correctos", "🏗️ Mantén la torre equilibrada mientras crece", "🤝 Responde al cliente con criterio profesional"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-sm"><span className="text-white/40 text-xs w-4">{i + 1}.</span>{t}</div>
                ))}
              </div>
              <motion.button onClick={() => setPhase("blueprint")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl text-white text-xl font-black" style={{ background: "linear-gradient(135deg,#2563eb,#1e3a8a)" }}>
                📐 Abrir el Estudio
              </motion.button>
            </motion.div>
          )}
          {phase === "blueprint" && <motion.div key="g1" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><BlueprintGame onComplete={advance} /></motion.div>}
          {phase === "materials" && <motion.div key="g2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><MaterialsGame onComplete={advance} /></motion.div>}
          {phase === "balance" && <motion.div key="g3" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><BalanceGame onComplete={advance} /></motion.div>}
          {phase === "presentation" && <motion.div key="g4" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><PresentationGame onComplete={advance} /></motion.div>}
          {phase === "result" && <motion.div key="r" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}><ResultScreen scores={scores} /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
