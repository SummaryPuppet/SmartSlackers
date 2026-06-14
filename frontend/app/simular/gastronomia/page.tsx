"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useSimulationBadge } from "@/src/hooks/useSimulationBadge";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { saveSimulationResult } from "@/src/services/simulationService";

type GamePhase = "briefing" | "miseplace" | "temperature" | "plating" | "pairing" | "result";
const PHASE_ORDER: GamePhase[] = ["briefing", "miseplace", "temperature", "plating", "pairing", "result"];

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: parseFloat((Math.random() * 100).toFixed(2)),
  y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 3 + 1).toFixed(1)),
  opacity: parseFloat((Math.random() * 0.12 + 0.04).toFixed(2)),
  dur: 4 + Math.random() * 6,
  delay: Math.random() * 4,
}));

const RECIPE_INGREDIENTS = ["🧅 Cebolla", "🧄 Ajo", "🍅 Tomate", "🌿 Albahaca"];
const ALL_INGREDIENTS = ["🧅 Cebolla", "🧄 Ajo", "🍅 Tomate", "🌿 Albahaca", "🥕 Zanahoria", "🌶️ Rocoto", "🍋 Limón", "🥦 Brócoli"];

const PLATING_ITEMS = [
  { emoji: "🍚", name: "Arroz", pos: 0 },
  { emoji: "🥩", name: "Lomo", pos: 1 },
  { emoji: "🫛", name: "Frejoles", pos: 2 },
  { emoji: "🥗", name: "Ensalada", pos: 3 },
  { emoji: "🍋", name: "Limón", pos: 4 },
];

const PAIRING_QUESTIONS = [
  { dish: "Ceviche de corvina", options: ["Chicha morada", "Vino tinto robusto", "Whisky en roca"], correct: 0 },
  { dish: "Lomo saltado", options: ["Cerveza rubia", "Inca Kola", "Pisco sour"], correct: 2 },
  { dish: "Arroz con leche", options: ["Café americano", "Mate de coca", "Agua tónica"], correct: 1 },
];

function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["miseplace", "temperature", "plating", "pairing"];
  return (
    <div className="flex items-center gap-1 w-32">
      {phases.map((p, i) => (
        <div key={p} className="h-1.5 flex-1 rounded-full transition-all"
          style={{ background: scores[i] !== undefined ? scores[i] >= 20 ? "#4ade80" : scores[i] >= 10 ? "#fbbf24" : "#f87171" : phase === p ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)" }} />
      ))}
    </div>
  );
}

// ── GAME 1: Mise en Place (caída) ────────────────────────────
interface FallingItem { id: number; ingredient: string; x: number; y: number; isRecipe: boolean; caught: boolean; }

const FALLING_ITEM_POOL: FallingItem[] = Array.from({ length: 18 }, (_, i) => {
  const isRecipe = i < 8;
  const src = isRecipe ? RECIPE_INGREDIENTS : ALL_INGREDIENTS.filter(x => !RECIPE_INGREDIENTS.includes(x));
  return {
    id: i, ingredient: src[i % src.length],
    x: 5 + (i * 17) % 85, y: -15 - (i * 28) % 120,
    isRecipe, caught: false,
  };
});

function MisePlaceGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [items, setItems] = useState<FallingItem[]>(FALLING_ITEM_POOL.map(f => ({ ...f })));
  const [caught, setCaught] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(18);
  const doneRef = useRef(false);

  useEffect(() => {
    const fall = setInterval(() => {
      setItems(prev => prev.map(item => item.caught ? item : { ...item, y: item.y + 3.5 }));
    }, 80);
    return () => clearInterval(fall);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(x => {
        if (x <= 1) {
          if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.max(0, 25 - mistakes * 3)), 800); }
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mistakes, onComplete]);

  const catchItem = (id: number) => {
    if (doneRef.current) return;
    const item = items.find(i => i.id === id);
    if (!item || item.caught) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, caught: true } : i));
    if (item.isRecipe) {
      setCaught(c => c + 1);
    } else {
      setMistakes(m => m + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-orange-300 text-xs uppercase tracking-widest mb-1">Cocina del Restaurante</p>
        <h2 className="text-white text-xl font-black">¡Mise en Place!</h2>
        <p className="text-white/60 text-sm">Captura solo los ingredientes de la receta</p>
      </div>
      <div className="flex gap-4 text-sm">
        <span className="text-white/60">⏱ {timeLeft}s</span>
        <span className="text-green-400">✅ {caught} capturados</span>
        <span className="text-red-400">❌ {mistakes} errores</span>
      </div>
      <div className="bg-white/5 border border-orange-500/20 rounded-xl px-3 py-2 flex gap-2 flex-wrap">
        <span className="text-orange-300 text-xs font-bold">Receta:</span>
        {RECIPE_INGREDIENTS.map(r => <span key={r} className="text-white text-xs">{r}</span>)}
      </div>
      <div className="relative w-full bg-black/30 border border-white/10 rounded-2xl overflow-hidden" style={{ height: 280 }}>
        {items.filter(i => !i.caught && i.y < 290 && i.y > -30).map(item => (
          <motion.button key={item.id} onClick={() => catchItem(item.id)}
            className="absolute text-2xl cursor-pointer select-none"
            style={{ left: `${item.x}%`, top: item.y, transform: "translateX(-50%)" }}
            whileTap={{ scale: 1.4 }}>
            {item.ingredient.split(" ")[0]}
          </motion.button>
        ))}
        {items.every(i => i.caught || i.y > 290) && !doneRef.current && (
          <div className="absolute inset-0 flex items-center justify-center text-green-400 font-black text-lg">¡Completado!</div>
        )}
      </div>
    </div>
  );
}

// ── GAME 2: Temperatura ──────────────────────────────────────
function TemperatureGame({ onComplete }: { onComplete: (s: number) => void }) {
  const tempRef = useRef(120);
  const stableRef = useRef(0);
  const [temp, setTemp] = useState(120);
  const [timeLeft, setTimeLeft] = useState(20);
  const [stableTime, setStableTime] = useState(0);
  const doneRef = useRef(false);
  const TARGET_MIN = 175; const TARGET_MAX = 185;

  useEffect(() => {
    const drift = setInterval(() => {
      tempRef.current = Math.max(80, Math.min(240, tempRef.current + (Math.random() > 0.5 ? -2 : 1)));
      setTemp(Math.round(tempRef.current));
    }, 400);
    return () => clearInterval(drift);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const ok = tempRef.current >= TARGET_MIN && tempRef.current <= TARGET_MAX;
      if (ok) { stableRef.current += 1; setStableTime(stableRef.current); }
      else { stableRef.current = 0; setStableTime(0); }
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(25, stableRef.current * 2)), 800); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onComplete]);

  const adjust = (d: number) => { tempRef.current = Math.max(80, Math.min(240, tempRef.current + d * 8)); setTemp(Math.round(tempRef.current)); };
  const ok = temp >= TARGET_MIN && temp <= TARGET_MAX;
  const tooHot = temp > TARGET_MAX; const tooCold = temp < TARGET_MIN;

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-sm mx-auto">
      <div className="text-center">
        <p className="text-orange-300 text-xs uppercase tracking-widest mb-1">Horno Principal</p>
        <h2 className="text-white text-xl font-black">Control de Temperatura</h2>
        <p className="text-white/60 text-sm">Mantén el horno a 175–185°C para el soufflé</p>
      </div>
      <div className="flex gap-4 text-sm">
        <span className="text-white/60">⏱ {timeLeft}s</span>
        <span className={stableTime > 0 ? "text-green-400 font-bold" : "text-white/30"}>🎯 Estable: {stableTime}s</span>
      </div>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <motion.circle cx="60" cy="60" r="50" fill="none"
            stroke={ok ? "#4ade80" : tooHot ? "#f87171" : "#60a5fa"} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 50}
            strokeDashoffset={2 * Math.PI * 50 * (1 - Math.max(0, Math.min(1, (temp - 80) / 160)))}
            className="-rotate-90 origin-center" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black" style={{ color: ok ? "#4ade80" : tooHot ? "#f87171" : "#60a5fa" }}>{temp}°</span>
          <span className="text-white/50 text-xs">Celsius</span>
        </div>
      </div>
      <div className="text-4xl">{ok ? "👨‍🍳" : tooHot ? "🔥" : "🥶"}</div>
      <p className={`text-sm font-bold ${ok ? "text-green-400" : tooHot ? "text-red-400" : "text-blue-400"}`}>
        {ok ? "¡Temperatura perfecta!" : tooHot ? "¡Demasiado caliente!" : "¡Necesita más calor!"}
      </p>
      <div className="flex gap-4">
        <motion.button onClick={() => adjust(-1)} whileTap={{ scale: 0.93 }}
          className="w-20 h-20 rounded-2xl text-3xl font-black text-white border-2 border-blue-500/40" style={{ background: "rgba(96,165,250,0.15)" }}>🥶 −</motion.button>
        <motion.button onClick={() => adjust(1)} whileTap={{ scale: 0.93 }}
          className="w-20 h-20 rounded-2xl text-3xl font-black text-white border-2 border-red-500/40" style={{ background: "rgba(248,113,113,0.15)" }}>🔥 +</motion.button>
      </div>
    </div>
  );
}

// ── GAME 3: Emplatado ────────────────────────────────────────
function PlatingGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handlePlace = (pos: number) => {
    if (doneRef.current) return;
    const step = placed.length;
    const expected = step;
    if (pos === expected) {
      const np = [...placed, pos];
      setPlaced(np);
      if (np.length === PLATING_ITEMS.length) {
        doneRef.current = true; setDone(true);
        setTimeout(() => onComplete(Math.max(5, 25 - mistakes * 4)), 800);
      }
    } else {
      setMistakes(m => m + 1); setShake(pos);
      setTimeout(() => setShake(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-orange-300 text-xs uppercase tracking-widest mb-1">Estación de Presentación</p>
        <h2 className="text-white text-xl font-black">Emplatado Artístico</h2>
        <p className="text-white/60 text-sm">Coloca cada elemento en el orden correcto para el plato</p>
      </div>
      <div className="flex gap-3 text-sm">
        <span className="text-green-400">{placed.length}/5 colocados</span>
        <span className="text-red-400">❌ {mistakes} errores</span>
      </div>
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 rounded-full bg-white/5 border-4 border-white/20 flex items-center justify-center">
          <span className="text-white/20 text-sm">Plato</span>
        </div>
        {PLATING_ITEMS.map((item, i) => {
          const angle = (i * 360) / PLATING_ITEMS.length - 90;
          const rad = (angle * Math.PI) / 180;
          const r = 72;
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          return (
            <div key={i} className="absolute text-3xl -translate-x-1/2 -translate-y-1/2 transition-all"
              style={{ left: `${x}%`, top: `${y}%`, opacity: placed.includes(i) ? 1 : 0.15, fontSize: placed.includes(i) ? "2rem" : "1.5rem" }}>
              {item.emoji}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {PLATING_ITEMS.map((item, i) => (
          <motion.button key={i} onClick={() => handlePlace(i)} disabled={placed.includes(i) || done}
            animate={shake === i ? { x: [-6, 6, -5, 5, 0] } : {}}
            whileHover={!placed.includes(i) && !done ? { scale: 1.1 } : {}}
            whileTap={!placed.includes(i) && !done ? { scale: 0.9 } : {}}
            className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all"
              style={{
                background: placed.includes(i) ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.1)",
                borderColor: placed.includes(i) ? "#4ade80" : placed.length === i ? "#fbbf24" : "rgba(255,255,255,0.2)",
                opacity: placed.includes(i) ? 0.4 : 1,
              }}>
              {item.emoji}
            </div>
            <span className="text-white/60 text-xs">{item.name}</span>
          </motion.button>
        ))}
      </div>
      {done && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-black text-lg">🍽️ ¡Plato perfecto!</motion.p>}
    </div>
  );
}

// ── GAME 4: Maridaje ─────────────────────────────────────────
function PairingGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handle = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(idx);
    const correct = idx === PAIRING_QUESTIONS[current].correct;
    const pts = correct ? 9 : 0;
    const ns = score + pts;
    setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1200); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1100);
    }
  };

  const q = PAIRING_QUESTIONS[current];
  return (
    <div className="flex flex-col items-center gap-6 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-orange-300 text-xs uppercase tracking-widest mb-1">Sommelier — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">Maridaje Perfecto</h2>
        <p className="text-white/60 text-sm">¿Qué bebida marida mejor con este plato?</p>
      </div>
      <motion.div key={current} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
        className="w-full bg-white/5 border border-orange-500/20 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🍽️</div>
        <p className="text-white text-lg font-black">{q.dish}</p>
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
              className="w-full rounded-xl px-4 py-3 text-white font-semibold text-sm border-2 text-left transition-colors"
              style={{ background: bg, borderColor: border }}>
              {["🍷", "🍺", "🥃"][i % 3]} {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`font-black ${feedback === q.correct ? "text-green-400" : "text-red-400"}`}>
          {feedback === q.correct ? "✅ ¡Maridaje perfecto!" : `❌ El mejor maridaje es: ${q.options[q.correct]}`}
        </motion.p>
      )}
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────
function ResultScreen({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const rank = pct >= 85 ? "Chef Estrella" : pct >= 65 ? "Sous Chef" : pct >= 40 ? "Cocinero de Línea" : "Aprendiz de Cocina";
  const color = pct >= 85 ? "#4ade80" : pct >= 65 ? "#fbbf24" : pct >= 40 ? "#60a5fa" : "#f87171";
  const phases = ["Mise en Place", "Temperatura", "Emplatado", "Maridaje"];
  const circ = 2 * Math.PI * 50;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        await saveSimulationResult(user.uid, "gastronomia", pct, rank, {
          miseplace: scores[0] ?? 0,
          temperature: scores[1] ?? 0,
          plating: scores[2] ?? 0,
          pairing: scores[3] ?? 0,
        });
      } catch { /* silent */ }
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-sm mx-auto">
      <p className="text-orange-300 text-xs uppercase tracking-widest">Evaluación de Chef</p>
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <motion.circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{pct}%</span>
          <span className="text-white/50 text-xs">aptitud culinaria</span>
        </div>
      </div>
      <p className="text-2xl font-black text-center" style={{ color }}>👨‍🍳 {rank}</p>
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

export default function GastronomiaGame() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);
  useSimulationBadge(phase);

  const advance = (score: number) => {
    setScores(s => [...s, score]);
    setPhase(PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1]);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#3d1500 0%,#5c2000 60%,#3d1500 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-orange-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
      <Navbar variant="dark" title="👨‍🍳 Gastronomía — Restaurante Estrella" backHref="/simular" rightSlot={<ScoreBar phase={phase} scores={scores} />} />
      <div className="relative max-w-lg mx-auto py-8">
        <AnimatePresence mode="wait">
          {phase === "briefing" && (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center">
              <motion.div animate={{ rotate: [-5, 5, -5], y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl">👨‍🍳</motion.div>
              <h1 className="text-white text-3xl font-black">¡A las Fogones!</h1>
              <p className="text-white/70 text-lg">Eres el chef principal. El servicio nocturno comenzó.</p>
              <div className="w-full bg-white/5 border border-orange-500/20 rounded-2xl p-5 text-left space-y-3">
                {["🧅 Captura los ingredientes correctos antes de que caigan", "🌡️ Mantén el horno a la temperatura exacta del soufflé", "🍽️ Emplata el plato en el orden correcto", "🍷 Recomienda el maridaje ideal para cada plato"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-sm"><span className="text-white/40 text-xs w-4">{i + 1}.</span>{t}</div>
                ))}
              </div>
              <motion.button onClick={() => setPhase("miseplace")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl text-white text-xl font-black" style={{ background: "linear-gradient(135deg,#ea580c,#7c2d12)" }}>
                🍳 Entrar a la Cocina
              </motion.button>
            </motion.div>
          )}
          {phase === "miseplace" && <motion.div key="g1" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><MisePlaceGame onComplete={advance} /></motion.div>}
          {phase === "temperature" && <motion.div key="g2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><TemperatureGame onComplete={advance} /></motion.div>}
          {phase === "plating" && <motion.div key="g3" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><PlatingGame onComplete={advance} /></motion.div>}
          {phase === "pairing" && <motion.div key="g4" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><PairingGame onComplete={advance} /></motion.div>}
          {phase === "result" && <motion.div key="r" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}><ResultScreen scores={scores} /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
