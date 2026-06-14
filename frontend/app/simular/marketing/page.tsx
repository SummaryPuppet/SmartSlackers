"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useSimulationBadge } from "@/src/hooks/useSimulationBadge";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { saveSimulationResult } from "@/src/services/simulationService";

type GamePhase = "briefing" | "target" | "abtest" | "budget" | "metrics" | "result";
const PHASE_ORDER: GamePhase[] = ["briefing", "target", "abtest", "budget", "metrics", "result"];

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i, x: parseFloat((Math.random() * 100).toFixed(2)), y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 2 + 0.5).toFixed(1)), opacity: parseFloat((Math.random() * 0.12 + 0.03).toFixed(2)),
  dur: 4 + Math.random() * 5, delay: Math.random() * 4,
}));

const TARGET_PRODUCTS = [
  {
    product: "Crema antienvejecimiento premium S/. 180",
    options: ["Hombres 18-25 años estudiantes", "Mujeres 35-55 años C+ con poder adquisitivo", "Niños 8-12 años", "Adultos mayores de 70 años"],
    correct: 1,
    reason: "El producto premium apunta a mujeres con mayor poder de compra e interés en cuidado personal."
  },
  {
    product: "App de fintech para microcréditos sin banco",
    options: ["Ejecutivos bancarios seniors", "Emprendedores informales y microempresarios sin historial bancario", "Turistas extranjeros", "Estudiantes universitarios de Lima"],
    correct: 1,
    reason: "El producto resuelve el problema de acceso al crédito para el sector no bancarizado."
  },
  {
    product: "Curso online de programación S/. 399",
    options: ["Adultos mayores jubilados", "Amas de casa sin internet", "Jóvenes 20-35 años interesados en tecnología y empleo", "Directores de empresas Fortune 500"],
    correct: 2,
    reason: "El público está en la etapa de formación profesional y busca empleabilidad en tech."
  },
];

const AB_TESTS = [
  {
    version_a: "\"Curso de marketing digital — Aprende las últimas tendencias del mercado\"",
    version_b: "\"En 30 días consigue tus primeros 3 clientes usando solo Instagram\"",
    winner: "B",
    reason: "B es más específico: tiempo, resultado concreto y canal claro. El CTR sube 3x.",
  },
  {
    version_a: "\"Zapatillas de deporte para todos los estilos de vida activos\"",
    version_b: "\"Corre 40 minutos sin dolor. Probado por 1,200 maratonistas peruanos.\"",
    winner: "B",
    reason: "B tiene prueba social, beneficio específico y credibilidad. Convierte el doble.",
  },
  {
    version_a: "\"Sistema de gestión empresarial — Optimiza tus procesos\"",
    version_b: "\"Reducimos el tiempo administrativo de tu empresa en 4 horas al día — garantizado\"",
    winner: "B",
    reason: "B cuantifica el beneficio con garantía. Las empresas compran resultados, no características.",
  },
];

const KPI_SCENARIOS = [
  {
    question: "Lanzaste 2 campañas en redes. ¿Cuál está funcionando mejor?",
    campaignA: { impressions: 50000, clicks: 500, conversions: 10, cost: 300 },
    campaignB: { impressions: 30000, clicks: 900, conversions: 45, cost: 350 },
    winner: "B",
    reason: "B tiene CTR 3% vs 1% de A, y CPA de S/7.7 vs S/30 de A.",
  },
  {
    question: "¿Qué canal tiene mejor ROAS (retorno sobre gasto publicitario)?",
    campaignA: { name: "Google Ads", spend: 500, revenue: 1200 },
    campaignB: { name: "Meta Ads", spend: 500, revenue: 2800 },
    winner: "B",
    reason: "Meta: ROAS 5.6x vs Google: ROAS 2.4x. Meta genera más ventas por cada sol invertido.",
  },
];

function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["target", "abtest", "budget", "metrics"];
  return (
    <div className="flex items-center gap-1 w-32">
      {phases.map((p, i) => (
        <div key={p} className="h-1.5 flex-1 rounded-full transition-all"
          style={{ background: scores[i] !== undefined ? scores[i] >= 20 ? "#4ade80" : scores[i] >= 10 ? "#f9a8d4" : "#f87171" : phase === p ? "rgba(236,72,153,0.7)" : "rgba(255,255,255,0.15)" }} />
      ))}
    </div>
  );
}

// ── GAME 1: Público Objetivo ─────────────────────────────────
function TargetGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const doneRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = (pts: number) => {
    const ns = score + pts; setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1100); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); setTimeLeft(10); }, 1100);
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
    advance(idx === TARGET_PRODUCTS[current].correct ? 9 : 0);
  };

  const p = TARGET_PRODUCTS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-pink-300 text-xs uppercase tracking-widest mb-1">Agencia Digital — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">¿A quién le vendes esto?</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-pink-400 rounded-full" style={{ width: `${(timeLeft / 10) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span className="text-pink-300/60 text-sm">{timeLeft}s</span>
      </div>
      <motion.div key={current} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/5 border border-pink-500/20 rounded-2xl p-5 text-center">
        <div className="text-4xl mb-3">🎯</div>
        <p className="text-white font-black text-base">{p.product}</p>
      </motion.div>
      <div className="w-full space-y-2">
        {p.options.map((opt, i) => {
          let bg = "rgba(236,72,153,0.1)"; let border = "rgba(236,72,153,0.25)";
          if (feedback !== null) {
            if (i === p.correct) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (i === feedback) { bg = "rgba(248,113,113,0.2)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handle(i)} whileHover={feedback === null ? { scale: 1.02 } : {}}
              className="w-full rounded-xl px-4 py-3 text-white text-sm border-2 text-left transition-colors"
              style={{ background: bg, borderColor: border }}>
              👥 {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`text-sm font-bold ${feedback === p.correct ? "text-green-400" : "text-pink-300"}`}>
          {feedback === p.correct ? "🎯 ¡Segmentación perfecta!" : `💡 ${p.reason}`}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 2: A/B Testing ──────────────────────────────────────
function ABTestGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"A" | "B" | null>(null);
  const doneRef = useRef(false);

  const handle = (version: "A" | "B") => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(version);
    const correct = version === AB_TESTS[current].winner;
    const ns = score + (correct ? 9 : 0);
    setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1200); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1200);
    }
  };

  const t = AB_TESTS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-pink-300 text-xs uppercase tracking-widest mb-1">A/B Testing — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">¿Qué copy tiene mayor CTR?</h2>
        <p className="text-white/60 text-sm">Elige el anuncio que crees que convierte mejor</p>
      </div>
      <div className="w-full space-y-4">
        {(["A", "B"] as const).map(v => {
          const text = v === "A" ? t.version_a : t.version_b;
          const isWinner = v === t.winner;
          let bg = "rgba(236,72,153,0.1)"; let border = "rgba(236,72,153,0.2)";
          if (feedback !== null) {
            if (isWinner) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (feedback === v) { bg = "rgba(248,113,113,0.15)"; border = "#f87171"; }
          }
          return (
            <motion.button key={v} onClick={() => handle(v)} whileHover={feedback === null ? { scale: 1.02 } : {}}
              className="w-full rounded-2xl p-5 text-left border-2 transition-colors"
              style={{ background: bg, borderColor: border }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="rounded-lg px-3 py-1 text-sm font-black text-white" style={{ background: v === "A" ? "#7c3aed" : "#0ea5e9" }}>Versión {v}</span>
                {feedback !== null && isWinner && <span className="text-green-400 text-xs font-bold">✅ GANADOR</span>}
              </div>
              <p className="text-white text-sm leading-relaxed">{text}</p>
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/5 border border-pink-500/20 rounded-xl p-4">
          <p className={`text-sm font-bold mb-1 ${feedback === t.winner ? "text-green-400" : "text-pink-300"}`}>
            {feedback === t.winner ? "🎯 ¡Correcto!" : "📊 La respuesta correcta era:"} Versión {t.winner}
          </p>
          <p className="text-white/70 text-xs">{t.reason}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── GAME 3: Distribución de Presupuesto ──────────────────────
const CHANNELS = [
  { name: "Meta Ads", emoji: "📱", optimal: 4 },
  { name: "Google Ads", emoji: "🔍", optimal: 3 },
  { name: "Email", emoji: "📧", optimal: 2 },
  { name: "Influencers", emoji: "⭐", optimal: 1 },
];

function BudgetGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [allocs, setAllocs] = useState([0, 0, 0, 0]);
  const [submitted, setSubmitted] = useState(false);
  const doneRef = useRef(false);
  const total = allocs.reduce((a, b) => a + b, 0);
  const MAX = 10;

  const adjust = (i: number, d: number) => {
    if (submitted) return;
    const next = [...allocs];
    next[i] = Math.max(0, Math.min(MAX - (total - next[i]), next[i] + d));
    setAllocs(next);
  };

  const submit = () => {
    if (total < MAX || submitted) return;
    setSubmitted(true);
    let pts = 0;
    allocs.forEach((a, i) => {
      const diff = Math.abs(a - CHANNELS[i].optimal);
      if (diff === 0) pts += 7; else if (diff === 1) pts += 4; else if (diff === 2) pts += 1;
    });
    if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(pts, 25)), 1500); }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-pink-300 text-xs uppercase tracking-widest mb-1">Presupuesto Mensual</p>
        <h2 className="text-white text-xl font-black">Distribuye S/. 10,000</h2>
        <p className="text-white/60 text-sm">Asigna unidades de presupuesto a cada canal</p>
      </div>
      <div className="flex gap-3 text-sm">
        <span className={total === MAX ? "text-green-400 font-bold" : "text-white/60"}>
          💰 {total}/{MAX} unidades asignadas
        </span>
      </div>
      <div className="w-full space-y-3">
        {CHANNELS.map((ch, i) => (
          <div key={i} className="w-full bg-white/5 border border-pink-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm">{ch.emoji} {ch.name}</span>
              <span className="text-pink-300 font-black text-lg">{allocs[i]}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full transition-all" style={{
                width: `${(allocs[i] / MAX) * 100}%`,
                background: submitted ? Math.abs(allocs[i] - ch.optimal) === 0 ? "#4ade80" : Math.abs(allocs[i] - ch.optimal) <= 1 ? "#fbbf24" : "#f87171" : "#ec4899",
              }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => adjust(i, -1)} disabled={submitted || allocs[i] <= 0}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition disabled:opacity-40 text-sm">−</button>
              <button onClick={() => adjust(i, 1)} disabled={submitted || total >= MAX}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition disabled:opacity-40 text-sm">+</button>
            </div>
            {submitted && (
              <p className="text-xs mt-1" style={{ color: Math.abs(allocs[i] - ch.optimal) === 0 ? "#4ade80" : "#fbbf24" }}>
                {Math.abs(allocs[i] - ch.optimal) === 0 ? "✅ Perfecto" : `💡 Óptimo: ${ch.optimal} unidades`}
              </p>
            )}
          </div>
        ))}
      </div>
      {!submitted && (
        <motion.button onClick={submit} disabled={total < MAX} whileHover={total >= MAX ? { scale: 1.04 } : {}} whileTap={total >= MAX ? { scale: 0.96 } : {}}
          className="px-10 py-4 rounded-2xl text-white font-black transition"
          style={{ background: total >= MAX ? "linear-gradient(135deg,#ec4899,#be185d)" : "rgba(255,255,255,0.1)", opacity: total < MAX ? 0.5 : 1 }}>
          📊 Aprobar Presupuesto
        </motion.button>
      )}
    </div>
  );
}

// ── GAME 4: Lectura de Métricas ──────────────────────────────
function MetricsGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const doneRef = useRef(false);

  const handle = (winner: string) => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(winner);
    const correct = winner === KPI_SCENARIOS[current].winner;
    const ns = score + (correct ? 13 : 0);
    setScore(ns);
    if (current >= 1) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1300); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1300);
    }
  };

  const s = KPI_SCENARIOS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-pink-300 text-xs uppercase tracking-widest mb-1">Dashboard Analytics — {current + 1}/2</p>
        <h2 className="text-white text-xl font-black">Interpreta las Métricas</h2>
        <p className="text-white/70 text-sm">{s.question}</p>
      </div>
      <div className="w-full grid grid-cols-2 gap-3">
        {(["A", "B"] as const).map(v => {
          const data = v === "A" ? s.campaignA : s.campaignB;
          const isWinner = v === s.winner;
          let bg = "rgba(236,72,153,0.1)"; let border = "rgba(236,72,153,0.2)";
          if (feedback !== null) {
            if (isWinner) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else { bg = "rgba(248,113,113,0.1)"; border = "#f87171"; }
          }
          return (
            <motion.button key={v} onClick={() => handle(v)} whileHover={feedback === null ? { scale: 1.03 } : {}}
              className="rounded-2xl p-4 text-left border-2 transition-all"
              style={{ background: bg, borderColor: border }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-black text-sm">Campaña {v}</span>
                {feedback !== null && isWinner && <span className="text-green-400 text-xs">✅</span>}
              </div>
              {'impressions' in data ? (
                <div className="space-y-1 text-xs">
                  <div className="text-white/60">Impresiones: <span className="text-white font-bold">{data.impressions?.toLocaleString()}</span></div>
                  <div className="text-white/60">Clicks: <span className="text-white font-bold">{data.clicks}</span></div>
                  <div className="text-white/60">Conversiones: <span className="text-pink-300 font-bold">{data.conversions}</span></div>
                  <div className="text-white/60">Costo: <span className="text-white font-bold">S/. {data.cost}</span></div>
                </div>
              ) : (
                <div className="space-y-1 text-xs">
                  <div className="text-white/60">Canal: <span className="text-white font-bold">{'name' in data ? data.name : ''}</span></div>
                  <div className="text-white/60">Inversión: <span className="text-white font-bold">S/. {'spend' in data ? data.spend : ''}</span></div>
                  <div className="text-white/60">Revenue: <span className="text-pink-300 font-bold">S/. {'revenue' in data ? data.revenue : ''}</span></div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/5 border border-pink-500/20 rounded-xl p-4">
          <p className={`text-sm font-bold mb-1 ${feedback === s.winner ? "text-green-400" : "text-pink-300"}`}>
            {feedback === s.winner ? "📊 ¡Análisis correcto!" : `💡 La Campaña ${s.winner} es mejor`}
          </p>
          <p className="text-white/70 text-xs">{s.reason}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────
function ResultScreen({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const rank = pct >= 85 ? "Director Creativo" : pct >= 65 ? "Estratega Digital" : pct >= 40 ? "Ejecutivo de Marketing" : "Trainee de Marketing";
  const color = pct >= 85 ? "#4ade80" : pct >= 65 ? "#f9a8d4" : pct >= 40 ? "#60a5fa" : "#f87171";
  const phases = ["Target", "A/B Test", "Presupuesto", "Métricas"];
  const circ = 2 * Math.PI * 50;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        await saveSimulationResult(user.uid, "marketing", pct, rank, {
          target: scores[0] ?? 0,
          abtest: scores[1] ?? 0,
          budget: scores[2] ?? 0,
          metrics: scores[3] ?? 0,
        });
      } catch { /* silent */ }
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-sm mx-auto">
      <p className="text-pink-300 text-xs uppercase tracking-widest">Campaign Performance Review</p>
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
      <p className="text-2xl font-black text-center" style={{ color }}>📣 {rank}</p>
      <div className="w-full space-y-2">
        {phases.map((name, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-white/60 text-sm w-24 shrink-0">{name}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: (scores[i] ?? 0) >= 20 ? "#4ade80" : (scores[i] ?? 0) >= 12 ? "#f9a8d4" : "#f87171" }}
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

export default function MarketingGame() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);
  useSimulationBadge(phase);

  const advance = (score: number) => {
    setScores(s => [...s, score]);
    setPhase(PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1]);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#2d0035 0%,#450050 60%,#2d0035 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-pink-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
      <Navbar variant="dark" title="📣 Marketing — Agencia Digital" backHref="/simular" rightSlot={<ScoreBar phase={phase} scores={scores} />} />
      <div className="relative max-w-lg mx-auto py-8">
        <AnimatePresence mode="wait">
          {phase === "briefing" && (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center">
              <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl">📣</motion.div>
              <h1 className="text-white text-3xl font-black">¡La Agencia!</h1>
              <p className="text-white/70 text-lg">Eres director de una agencia digital. 4 desafíos de marketing te esperan.</p>
              <div className="w-full bg-white/5 border border-pink-500/20 rounded-2xl p-5 text-left space-y-3">
                {["🎯 Identifica el público objetivo correcto para 3 productos", "📊 Elige el copy de mayor CTR en 3 pruebas A/B", "💰 Distribuye el presupuesto de S/. 10,000 óptimamente", "📈 Interpreta las métricas y detecta la campaña ganadora"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-sm"><span className="text-white/40 text-xs w-4">{i + 1}.</span>{t}</div>
                ))}
              </div>
              <motion.button onClick={() => setPhase("target")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl text-white text-xl font-black" style={{ background: "linear-gradient(135deg,#ec4899,#7c3aed)" }}>
                📣 Abrir la Agencia
              </motion.button>
            </motion.div>
          )}
          {phase === "target" && <motion.div key="g1" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><TargetGame onComplete={advance} /></motion.div>}
          {phase === "abtest" && <motion.div key="g2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><ABTestGame onComplete={advance} /></motion.div>}
          {phase === "budget" && <motion.div key="g3" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><BudgetGame onComplete={advance} /></motion.div>}
          {phase === "metrics" && <motion.div key="g4" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><MetricsGame onComplete={advance} /></motion.div>}
          {phase === "result" && <motion.div key="r" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}><ResultScreen scores={scores} /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
