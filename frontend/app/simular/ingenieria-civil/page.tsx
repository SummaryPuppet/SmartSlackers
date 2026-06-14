"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useSimulationBadge } from "@/src/hooks/useSimulationBadge";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { saveSimulationResult } from "@/src/services/simulationService";

type GamePhase = "briefing" | "concrete" | "loads" | "inspection" | "path" | "result";
const PHASE_ORDER: GamePhase[] = ["briefing", "concrete", "loads", "inspection", "path", "result"];

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i, x: parseFloat((Math.random() * 100).toFixed(2)), y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 2.5 + 1).toFixed(1)), opacity: parseFloat((Math.random() * 0.12 + 0.04).toFixed(2)),
  dur: 4 + Math.random() * 5, delay: Math.random() * 4,
}));

const LOAD_QUESTIONS = [
  {
    scenario: "Puente peatonal: carga viva = 4 kN/m². Luz = 20m. ¿Qué viga elegir?",
    options: ["Viga de madera 15×25 cm", "Viga de acero W200×46", "Viga de bambú reforzado"],
    correct: 1,
    explanation: "La viga W200×46 soporta la carga y cumple norma E.060.",
  },
  {
    scenario: "Losa de entrepiso: 5 pisos, carga muerta 5 kN/m², carga viva 2 kN/m²",
    options: ["Losa aligerada h=20cm", "Losa de madera h=10cm", "Losa de bambú h=15cm"],
    correct: 0,
    explanation: "La losa aligerada de 20cm es la elección estándar para estas cargas.",
  },
  {
    scenario: "Columna en primer piso de edificio de 8 pisos. ¿Resistencia del concreto?",
    options: ["f'c = 140 kg/cm²", "f'c = 280 kg/cm²", "f'c = 175 kg/cm²"],
    correct: 1,
    explanation: "Para estructuras de altura, se requiere f'c ≥ 280 kg/cm² según RNE.",
  },
];

const DEFECTS = [
  { id: 0, x: 22, y: 30, label: "Grieta en columna" },
  { id: 1, x: 60, y: 55, label: "Acero expuesto" },
  { id: 2, x: 80, y: 20, label: "Filtración de agua" },
  { id: 3, x: 35, y: 70, label: "Segregación del concreto" },
  { id: 4, x: 55, y: 82, label: "Deformación en viga" },
];

const ACTIVITIES = [
  { id: 0, name: "Estudios de suelo", deps: [] },
  { id: 1, name: "Diseño estructural", deps: [0] },
  { id: 2, name: "Cimentación", deps: [1] },
  { id: 3, name: "Estructura metálica", deps: [2] },
  { id: 4, name: "Losas y techos", deps: [3] },
];

function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["concrete", "loads", "inspection", "path"];
  return (
    <div className="flex items-center gap-1 w-32">
      {phases.map((p, i) => (
        <div key={p} className="h-1.5 flex-1 rounded-full transition-all"
          style={{ background: scores[i] !== undefined ? scores[i] >= 20 ? "#4ade80" : scores[i] >= 10 ? "#fbbf24" : "#f87171" : phase === p ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)" }} />
      ))}
    </div>
  );
}

// ── GAME 1: Mezcla de Concreto (timing) ─────────────────────
function ConcreteGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [pos, setPos] = useState(0);
  const [mixed, setMixed] = useState(false);
  const [result, setResult] = useState<"perfect" | "good" | "fail" | null>(null);
  const doneRef = useRef(false);
  const dirRef = useRef(1);
  const posRef = useRef(0);
  const PERFECT_MIN = 40; const PERFECT_MAX = 60;
  const GOOD_MIN = 28; const GOOD_MAX = 72;

  useEffect(() => {
    const raf = setInterval(() => {
      posRef.current += dirRef.current * 0.9;
      if (posRef.current >= 100) dirRef.current = -1;
      if (posRef.current <= 0) dirRef.current = 1;
      setPos(posRef.current);
    }, 16);
    return () => clearInterval(raf);
  }, []);

  const handleMix = () => {
    if (doneRef.current || mixed) return;
    doneRef.current = true; setMixed(true);
    const p = posRef.current;
    let r: typeof result; let pts: number;
    if (p >= PERFECT_MIN && p <= PERFECT_MAX) { r = "perfect"; pts = 25; }
    else if (p >= GOOD_MIN && p <= GOOD_MAX) { r = "good"; pts = 14; }
    else { r = "fail"; pts = 3; }
    setResult(r);
    setTimeout(() => onComplete(pts), 1500);
  };

  const zone = pos >= PERFECT_MIN && pos <= PERFECT_MAX ? "perfect" : pos >= GOOD_MIN && pos <= GOOD_MAX ? "good" : "fail";

  return (
    <div className="flex flex-col items-center gap-6 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-amber-300 text-xs uppercase tracking-widest mb-1">Planta de Concreto</p>
        <h2 className="text-white text-2xl font-black">Mezcla de Concreto f'c 280</h2>
        <p className="text-white/60 text-sm">Pulsa MEZCLAR cuando el agua llegue a la zona óptima</p>
      </div>
      <div className="w-full bg-black/40 border border-amber-500/20 rounded-2xl p-5">
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>Muy seco</span><span>Óptimo</span><span>Muy húmedo</span>
        </div>
        <div className="relative h-14 rounded-xl overflow-hidden border border-white/10"
          style={{ background: "linear-gradient(to right, #78350f 0%, #78350f 28%, #d97706 28%, #d97706 40%, #16a34a 40%, #16a34a 60%, #d97706 60%, #d97706 72%, #78350f 72%, #78350f 100%)" }}>
          <motion.div className="absolute top-0 bottom-0 w-2 rounded-full bg-white shadow-lg"
            style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
            animate={{ boxShadow: zone === "perfect" ? ["0 0 8px #4ade80", "0 0 20px #4ade80"] : zone === "good" ? ["0 0 8px #fbbf24"] : ["0 0 4px white"] }}
            transition={{ duration: 0.4, repeat: Infinity }} />
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-sm font-bold" style={{ color: zone === "perfect" ? "#4ade80" : zone === "good" ? "#fbbf24" : "#f87171" }}>
            {zone === "perfect" ? "🟢 CONSISTENCIA PERFECTA" : zone === "good" ? "🟡 CONSISTENCIA ACEPTABLE" : "🔴 FUERA DE RANGO"}
          </span>
        </div>
      </div>
      <div className="text-6xl">{zone === "perfect" ? "🏗️" : zone === "good" ? "😐" : "😰"}</div>
      <motion.button onClick={handleMix} disabled={mixed}
        whileHover={!mixed ? { scale: 1.05 } : {}} whileTap={!mixed ? { scale: 0.92 } : {}}
        animate={zone === "perfect" && !mixed ? { boxShadow: ["0 0 15px #d97706", "0 0 40px #d97706", "0 0 15px #d97706"] } : {}}
        transition={{ duration: 0.4, repeat: Infinity }}
        className="px-12 py-5 rounded-2xl text-xl font-black text-white uppercase tracking-widest"
        style={{ background: mixed ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#d97706,#78350f)", opacity: mixed ? 0.5 : 1 }}>
        🏗️ MEZCLAR
      </motion.button>
      {result && (
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className={`text-base font-black ${result === "perfect" ? "text-green-400" : result === "good" ? "text-yellow-400" : "text-red-400"}`}>
          {result === "perfect" ? "✅ ¡Mezcla perfecta! Relación A/C óptima" : result === "good" ? "👍 Mezcla aceptable, dentro de tolerancia" : "❌ Mezcla fuera de especificaciones"}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 2: Análisis de Cargas ───────────────────────────────
function LoadsGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handle = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(idx);
    const correct = idx === LOAD_QUESTIONS[current].correct;
    const ns = score + (correct ? 9 : 0);
    setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1200); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1200);
    }
  };

  const q = LOAD_QUESTIONS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-amber-300 text-xs uppercase tracking-widest mb-1">Análisis Estructural — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">¿Cuál es el elemento correcto?</h2>
      </div>
      <motion.div key={current} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/5 border border-amber-500/20 rounded-2xl p-5">
        <div className="text-4xl text-center mb-3">🏗️</div>
        <p className="text-white font-semibold text-sm leading-relaxed">{q.scenario}</p>
      </motion.div>
      <div className="w-full space-y-3">
        {q.options.map((opt, i) => {
          let bg = "rgba(255,255,255,0.07)"; let border = "rgba(255,255,255,0.15)";
          if (feedback !== null) {
            if (i === q.correct) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (i === feedback) { bg = "rgba(248,113,113,0.2)"; border = "#f87171"; }
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
          className={`text-sm font-bold ${feedback === q.correct ? "text-green-400" : "text-orange-400"}`}>
          {feedback === q.correct ? "✅ ¡Cálculo correcto!" : `💡 ${q.explanation}`}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 3: Inspección de Obra ───────────────────────────────
function InspectionGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [found, setFound] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const doneRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.round((found.length / 5) * 25)), 600); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [found, onComplete]);

  const findDefect = (id: number) => {
    if (found.includes(id) || doneRef.current) return;
    const nf = [...found, id];
    setFound(nf);
    if (nf.length === 5 && !doneRef.current) {
      doneRef.current = true;
      setTimeout(() => onComplete(25), 700);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-amber-300 text-xs uppercase tracking-widest mb-1">Inspección de Obra</p>
        <h2 className="text-white text-xl font-black">Encuentra los 5 Defectos</h2>
        <p className="text-white/60 text-sm">Toca cada defecto en la estructura antes de que llegue el inspector</p>
      </div>
      <div className="flex gap-4 text-sm">
        <span className="text-white/60">⏱ {timeLeft}s</span>
        <span className="text-green-400">✅ {found.length}/5 encontrados</span>
      </div>
      <div className="relative w-full bg-slate-800/80 border border-amber-500/20 rounded-2xl overflow-hidden" style={{ height: 280 }}>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 60px)`,
          }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-900/50 border-t border-amber-500/30" />
        <div className="absolute top-0 left-0 right-0 h-6 bg-slate-700/80 border-b border-white/10" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute bg-amber-900/30 border border-amber-500/20" style={{ left: `${10 + i * 22}%`, bottom: 32, width: "18%", height: "60%" }} />
        ))}
        {DEFECTS.map(def => (
          <motion.button key={def.id} onClick={() => findDefect(def.id)}
            className="absolute text-2xl transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${def.x}%`, top: `${def.y}%` }}
            animate={found.includes(def.id) ? { scale: 0, opacity: 0 } : { scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: found.includes(def.id) ? 0 : Infinity }}
            whileTap={!found.includes(def.id) ? { scale: 1.5 } : {}}>
            {found.includes(def.id) ? "" : "⚠️"}
          </motion.button>
        ))}
        {found.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm pointer-events-none">
            Toca los ⚠️ para marcar defectos
          </div>
        )}
      </div>
      {found.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-2">
          {found.map(id => {
            const d = DEFECTS.find(x => x.id === id)!;
            return (
              <div key={id} className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5 text-green-400 text-xs">
                ✅ {d.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── GAME 4: Ruta Crítica ─────────────────────────────────────
function CriticalPathGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [order, setOrder] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handleActivity = (id: number) => {
    if (submitted || order.includes(id)) return;
    const step = order.length;
    const expected = ACTIVITIES[step].id;
    if (id === expected) {
      const no = [...order, id];
      setOrder(no);
      if (no.length === ACTIVITIES.length && !doneRef.current) {
        doneRef.current = true; setSubmitted(true);
        setTimeout(() => onComplete(Math.max(5, 25 - mistakes * 5)), 800);
      }
    } else {
      setMistakes(m => m + 1); setShake(id);
      setTimeout(() => setShake(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-amber-300 text-xs uppercase tracking-widest mb-1">Gestión de Proyectos</p>
        <h2 className="text-white text-xl font-black">Ruta Crítica del Proyecto</h2>
        <p className="text-white/60 text-sm">Ordena las actividades según las dependencias del proyecto</p>
      </div>
      <div className="flex gap-3 text-sm">
        <span className="text-green-400">{order.length}/5</span>
        <span className="text-red-400">❌ {mistakes} errores</span>
      </div>
      <div className="w-full bg-white/5 border border-amber-500/20 rounded-xl p-4">
        <p className="text-amber-300 text-xs font-bold uppercase mb-3">📋 SECUENCIA ACTUAL:</p>
        <div className="flex flex-wrap gap-2 min-h-8">
          {order.map((id, i) => {
            const act = ACTIVITIES.find(a => a.id === id)!;
            return (
              <motion.div key={id} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-lg px-3 py-1.5">
                <span className="text-amber-300 text-xs font-bold">{i + 1}.</span>
                <span className="text-white text-xs">{act.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <p className="text-white/50 text-xs font-bold uppercase mb-2">Actividades disponibles:</p>
        <div className="grid grid-cols-1 gap-2">
          {ACTIVITIES.map(act => {
            const done = order.includes(act.id);
            const depsOk = act.deps.every(d => order.includes(d));
            return (
              <motion.button key={act.id} onClick={() => handleActivity(act.id)} disabled={done || submitted}
                animate={shake === act.id ? { x: [-5, 5, -4, 4, 0] } : {}}
                whileHover={!done && !submitted ? { scale: 1.02 } : {}}
                className="w-full text-left rounded-xl p-3 border-2 transition-all text-sm"
                style={{
                  background: done ? "rgba(74,222,128,0.1)" : depsOk ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                  borderColor: done ? "#4ade80" : depsOk ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                  opacity: done ? 0.5 : 1,
                  color: done ? "#4ade80" : depsOk ? "white" : "rgba(255,255,255,0.4)",
                }}>
                <div className="flex items-center gap-2">
                  {done ? "✅" : depsOk ? "🔨" : "🔒"}
                  <span className="font-semibold">{act.name}</span>
                  {act.deps.length > 0 && !done && (
                    <span className="text-white/30 text-xs">
                      (requiere: {act.deps.map(d => ACTIVITIES.find(a => a.id === d)!.name).join(", ")})
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      {submitted && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-black">🏗️ ¡Cronograma completado!</motion.p>}
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────
function ResultScreen({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const rank = pct >= 85 ? "Ingeniero Maestro" : pct >= 65 ? "Especialista de Obra" : pct >= 40 ? "Técnico Constructor" : "Cadete de Obra";
  const color = pct >= 85 ? "#4ade80" : pct >= 65 ? "#fbbf24" : pct >= 40 ? "#60a5fa" : "#f87171";
  const phases = ["Concreto", "Cargas", "Inspección", "Ruta Crítica"];
  const circ = 2 * Math.PI * 50;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        await saveSimulationResult(user.uid, "ingenieria-civil", pct, rank, {
          concrete: scores[0] ?? 0,
          loads: scores[1] ?? 0,
          inspection: scores[2] ?? 0,
          path: scores[3] ?? 0,
        });
      } catch { /* silent */ }
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-sm mx-auto">
      <p className="text-amber-300 text-xs uppercase tracking-widest">Evaluación de Ingeniería</p>
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
      <p className="text-2xl font-black text-center" style={{ color }}>🏗️ {rank}</p>
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

export default function IngenieriaCivilGame() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);
  useSimulationBadge(phase);

  const advance = (score: number) => {
    setScores(s => [...s, score]);
    setPhase(PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1]);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#291500 0%,#3d2000 60%,#291500 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-amber-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
      <Navbar variant="dark" title="🏗️ Ing. Civil — Gran Obra" backHref="/simular" rightSlot={<ScoreBar phase={phase} scores={scores} />} />
      <div className="relative max-w-lg mx-auto py-8">
        <AnimatePresence mode="wait">
          {phase === "briefing" && (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-8xl">🏗️</motion.div>
              <h1 className="text-white text-3xl font-black">¡A la Obra!</h1>
              <p className="text-white/70 text-lg">Eres ingeniero civil a cargo de un proyecto multimillonario.</p>
              <div className="w-full bg-white/5 border border-amber-500/20 rounded-2xl p-5 text-left space-y-3">
                {["🔩 Controla la mezcla del concreto en el momento exacto", "📊 Selecciona el elemento estructural correcto para cada carga", "🔍 Encuentra los 5 defectos ocultos en la obra", "📋 Ordena las actividades por la ruta crítica del proyecto"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-sm"><span className="text-white/40 text-xs w-4">{i + 1}.</span>{t}</div>
                ))}
              </div>
              <motion.button onClick={() => setPhase("concrete")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl text-white text-xl font-black" style={{ background: "linear-gradient(135deg,#d97706,#78350f)" }}>
                🦺 Iniciar la Obra
              </motion.button>
            </motion.div>
          )}
          {phase === "concrete" && <motion.div key="g1" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><ConcreteGame onComplete={advance} /></motion.div>}
          {phase === "loads" && <motion.div key="g2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><LoadsGame onComplete={advance} /></motion.div>}
          {phase === "inspection" && <motion.div key="g3" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><InspectionGame onComplete={advance} /></motion.div>}
          {phase === "path" && <motion.div key="g4" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><CriticalPathGame onComplete={advance} /></motion.div>}
          {phase === "result" && <motion.div key="r" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}><ResultScreen scores={scores} /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
