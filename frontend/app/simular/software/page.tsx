"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useSimulationBadge } from "@/src/hooks/useSimulationBadge";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { saveSimulationResult } from "@/src/services/simulationService";

type GamePhase = "briefing" | "debug" | "algorithm" | "deploy" | "security" | "result";
const PHASE_ORDER: GamePhase[] = ["briefing", "debug", "algorithm", "deploy", "security", "result"];

const PARTICLES = Array.from({ length: 35 }, (_, i) => ({
  id: i, x: parseFloat((Math.random() * 100).toFixed(2)), y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 2 + 0.5).toFixed(1)), opacity: parseFloat((Math.random() * 0.15 + 0.04).toFixed(2)),
  dur: 3 + Math.random() * 5, delay: Math.random() * 4,
}));

const DEBUG_SNIPPETS = [
  {
    title: "calcPrecio.js — FÁCIL",
    lines: [
      "function calcPrecio(precio, cantidad) {",
      "  let total = preceo * cantidad;",
      "  return total;",
      "}",
    ],
    bugLine: 1,
    explanation: "Typo: 'preceo' no existe. Debería ser 'precio'.",
  },
  {
    title: "checkEdad.js — FÁCIL",
    lines: [
      "function esMayorDeEdad(edad) {",
      "  const minima = 18;",
      "  if (edad = minima) {",
      "    return true;",
      "  }",
      "  return false;",
      "}",
    ],
    bugLine: 2,
    explanation: "Asignación en lugar de comparación: usa === en vez de =.",
  },
  {
    title: "fetchUser.js — DIFÍCIL",
    lines: [
      "async function getUsuario(id) {",
      "  const res = await fetch('/api/users/' + id);",
      "  const data = res.json();",
      "  return data.nombre;",
      "}",
    ],
    bugLine: 2,
    explanation: "Falta 'await' antes de res.json(). Devuelve una Promise sin resolver.",
  },
];

const ALGO_QUESTIONS = [
  {
    problem: "Tienes una lista con 1,000 emails registrados. ¿Cómo verificas rápido si un nuevo email ya existe?",
    options: [
      "Recorrer todos los emails uno por uno hasta encontrarlo",
      "Guardar los emails en un Set y verificar con .has() en O(1)",
      "Ordenar la lista y buscar manualmente",
    ],
    correct: 1,
    hint: "Un Set permite buscar en tiempo constante O(1).",
  },
  {
    problem: "Tu función tiene 2 bucles anidados sobre una lista de 200 elementos. ¿Cuántas operaciones realiza?",
    options: [
      "200 operaciones",
      "400 operaciones",
      "40,000 operaciones — complejidad O(n²)",
    ],
    correct: 2,
    hint: "200 × 200 = 40,000. Dos bucles anidados = O(n²).",
  },
  {
    problem: "DIFÍCIL: Debes detectar si 'amor' y 'roma' son anagramas. ¿Cuál es el enfoque más eficiente?",
    options: [
      "Ordenar ambos strings y comparar — O(n log n)",
      "Contar frecuencia de cada letra con un objeto/HashMap — O(n)",
      "Generar todas las permutaciones de una y comparar — O(n!)",
    ],
    correct: 1,
    hint: "Contar frecuencias en un HashMap es la solución más eficiente: O(n).",
  },
];

const VULN_LINES = [
  { code: "eval(req.body.codigo)", isVuln: true, type: "Ejecución de código arbitrario" },
  { code: "const userId = parseInt(req.params.id, 10)", isVuln: false, type: "" },
  { code: 'res.send("<p>Hola " + req.query.nombre + "</p>")', isVuln: true, type: "XSS — input sin sanitizar" },
  { code: "const hash = await bcrypt.hash(req.body.password, 12)", isVuln: false, type: "" },
  { code: 'const apiKey = "sk_live_abc987_produccion"', isVuln: true, type: "Credencial expuesta en código" },
];

function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["debug", "algorithm", "deploy", "security"];
  return (
    <div className="flex items-center gap-1 w-32">
      {phases.map((p, i) => (
        <div key={p} className="h-1.5 flex-1 rounded-full transition-all"
          style={{ background: scores[i] !== undefined ? scores[i] >= 20 ? "#4ade80" : scores[i] >= 10 ? "#fbbf24" : "#f87171" : phase === p ? "rgba(74,222,128,0.7)" : "rgba(255,255,255,0.15)" }} />
      ))}
    </div>
  );
}

// ── GAME 1: Debug Hunt ───────────────────────────────────────
function DebugGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const doneRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = (pts: number) => {
    const ns = score + pts;
    setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1100); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setSelected(null); setTimeLeft(15); }, 1100);
    }
  };

  useEffect(() => {
    if (doneRef.current || selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setSelected(-1);
          advance(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, selected]);

  const handleLine = (lineIdx: number) => {
    if (doneRef.current || selected !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(lineIdx);
    const correct = lineIdx === DEBUG_SNIPPETS[current].bugLine;
    advance(correct ? (timeLeft >= 10 ? 9 : 6) : 0);
  };

  const s = DEBUG_SNIPPETS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-green-300 text-xs uppercase tracking-widest mb-1">IDE — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">Encuentra el Bug 🐛</h2>
        <p className="text-green-400 font-mono text-sm">{s.title}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: timeLeft > 8 ? "#4ade80" : "#f87171", width: `${(timeLeft / 15) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span className="text-green-400/60 text-sm font-mono">{timeLeft}s</span>
      </div>
      <div className="w-full bg-black/70 border border-green-500/20 rounded-xl overflow-hidden">
        <div className="bg-green-900/20 px-4 py-2 text-green-400/60 text-xs font-mono border-b border-green-500/10">{s.title}.js — click en la línea bugueada</div>
        {s.lines.map((line, i) => {
          const isSelected = selected === i;
          const isCorrect = i === s.bugLine;
          let bg = "transparent"; let border = "transparent";
          if (selected !== null) {
            if (isCorrect) { bg = "rgba(74,222,128,0.15)"; border = "#4ade80"; }
            else if (isSelected) { bg = "rgba(248,113,113,0.15)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handleLine(i)} disabled={selected !== null}
              whileHover={selected === null ? { backgroundColor: "rgba(74,222,128,0.07)" } : {}}
              className="w-full text-left px-4 py-2 font-mono text-sm border-l-2 transition-colors flex gap-3"
              style={{ background: bg, borderLeftColor: border }}>
              <span className="text-green-500/30 w-5 text-right shrink-0">{i + 1}</span>
              <span style={{ color: selected !== null && isCorrect ? "#4ade80" : selected !== null && isSelected ? "#f87171" : "#86efac" }}>{line}</span>
            </motion.button>
          );
        })}
      </div>
      {selected !== null && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`w-full rounded-xl p-3 text-sm border ${selected === s.bugLine ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
          {selected === s.bugLine ? `✅ ¡Bug encontrado! ${s.explanation}` : `❌ El bug estaba en línea ${s.bugLine + 1}: ${s.explanation}`}
        </motion.div>
      )}
    </div>
  );
}

// ── GAME 2: Algoritmo Óptimo ─────────────────────────────────
function AlgorithmGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<number | null>(null);
  const doneRef = useRef(false);

  const handle = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    setFeedback(idx);
    const correct = idx === ALGO_QUESTIONS[current].correct;
    const ns = score + (correct ? 9 : 0);
    setScore(ns);
    if (current >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1100); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); }, 1100);
    }
  };

  const q = ALGO_QUESTIONS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-green-300 text-xs uppercase tracking-widest mb-1">Whiteboard — {current + 1}/3</p>
        <h2 className="text-white text-xl font-black">¿Cuál es el algoritmo óptimo?</h2>
      </div>
      <motion.div key={current} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="w-full bg-black/50 border border-green-500/20 rounded-xl p-5">
        <p className="text-green-400/60 text-xs font-mono mb-2">PROBLEMA:</p>
        <p className="text-white font-semibold">{q.problem}</p>
      </motion.div>
      <div className="w-full space-y-3">
        {q.options.map((opt, i) => {
          let bg = "rgba(0,0,0,0.4)"; let border = "rgba(74,222,128,0.2)";
          if (feedback !== null) {
            if (i === q.correct) { bg = "rgba(74,222,128,0.15)"; border = "#4ade80"; }
            else if (i === feedback) { bg = "rgba(248,113,113,0.15)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handle(i)} whileHover={feedback === null ? { scale: 1.02 } : {}}
              className="w-full rounded-xl px-4 py-3 text-left font-mono text-sm border-2 transition-colors"
              style={{ background: bg, borderColor: border, color: feedback !== null && i === q.correct ? "#4ade80" : "#86efac" }}>
              {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-bold font-mono text-sm ${feedback === q.correct ? "text-green-400" : "text-red-400"}`}>
          {feedback === q.correct ? `✅ ¡Correcto! ${q.hint}` : `❌ ${q.hint}`}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 3: Deploy Window ────────────────────────────────────
function DeployGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [pos, setPos] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const [result, setResult] = useState<"perfect" | "good" | "fail" | null>(null);
  const doneRef = useRef(false);
  const dirRef = useRef(1);
  const posRef = useRef(0);
  const GREEN_MIN = 38; const GREEN_MAX = 62;
  const YELLOW_MIN = 25; const YELLOW_MAX = 75;

  useEffect(() => {
    const raf = setInterval(() => {
      posRef.current += dirRef.current * 1.2;
      if (posRef.current >= 100) dirRef.current = -1;
      if (posRef.current <= 0) dirRef.current = 1;
      setPos(posRef.current);
    }, 16);
    return () => clearInterval(raf);
  }, []);

  const handleDeploy = () => {
    if (doneRef.current || deployed) return;
    doneRef.current = true; setDeployed(true);
    const p = posRef.current;
    let r: typeof result; let pts: number;
    if (p >= GREEN_MIN && p <= GREEN_MAX) { r = "perfect"; pts = 25; }
    else if (p >= YELLOW_MIN && p <= YELLOW_MAX) { r = "good"; pts = 15; }
    else { r = "fail"; pts = 0; }
    setResult(r);
    setTimeout(() => onComplete(pts), 1500);
  };

  const zone = pos >= GREEN_MIN && pos <= GREEN_MAX ? "green" : pos >= YELLOW_MIN && pos <= YELLOW_MAX ? "yellow" : "red";

  return (
    <div className="flex flex-col items-center gap-6 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-green-300 text-xs uppercase tracking-widest mb-1">Pipeline CI/CD</p>
        <h2 className="text-white text-2xl font-black">Ventana de Deploy</h2>
        <p className="text-white/60 text-sm">Haz deploy en la ventana verde de mantenimiento</p>
      </div>
      <div className="w-full bg-black/60 border border-green-500/20 rounded-2xl p-5">
        <div className="flex justify-between text-xs font-mono mb-3">
          <span className="text-red-400">🔴 Horario Pico</span>
          <span className="text-yellow-400">🟡 Moderado</span>
          <span className="text-green-400">🟢 Mantenimiento</span>
          <span className="text-yellow-400">🟡 Moderado</span>
          <span className="text-red-400">🔴 Horario Pico</span>
        </div>
        <div className="relative h-12 rounded-xl overflow-hidden border border-white/10" style={{
          background: "linear-gradient(to right, #7f1d1d 0%, #7f1d1d 25%, #78350f 25%, #78350f 38%, #14532d 38%, #14532d 62%, #78350f 62%, #78350f 75%, #7f1d1d 75%, #7f1d1d 100%)"
        }}>
          <motion.div className="absolute top-0 bottom-0 w-1 rounded-full bg-white shadow-lg" style={{ left: `${pos}%` }}
            animate={!deployed ? { boxShadow: zone === "green" ? ["0 0 8px #4ade80", "0 0 20px #4ade80"] : ["0 0 4px white"] } : {}}
            transition={{ duration: 0.4, repeat: Infinity }} />
        </div>
        <div className="flex justify-between text-xs text-white/30 font-mono mt-2">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-mono font-black" style={{ color: zone === "green" ? "#4ade80" : zone === "yellow" ? "#fbbf24" : "#f87171" }}>
          {zone === "green" ? "✅ DEPLOY AHORA" : zone === "yellow" ? "⚠️ CON RIESGO" : "❌ ALTO RIESGO"}
        </div>
      </div>
      <motion.button onClick={handleDeploy} disabled={deployed}
        whileHover={!deployed ? { scale: 1.05 } : {}} whileTap={!deployed ? { scale: 0.93 } : {}}
        animate={zone === "green" && !deployed ? { boxShadow: ["0 0 15px #4ade80", "0 0 40px #4ade80", "0 0 15px #4ade80"] } : {}}
        transition={{ duration: 0.4, repeat: Infinity }}
        className="px-12 py-5 rounded-2xl text-xl font-black text-white uppercase font-mono"
        style={{ background: deployed ? "rgba(255,255,255,0.1)" : zone === "green" ? "#16a34a" : zone === "yellow" ? "#d97706" : "#991b1b", opacity: deployed ? 0.5 : 1 }}>
        🚀 DEPLOY TO PRODUCTION
      </motion.button>
      {result && (
        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className={`text-lg font-black font-mono ${result === "perfect" ? "text-green-400" : result === "good" ? "text-yellow-400" : "text-red-400"}`}>
          {result === "perfect" ? "🚀 Deploy perfecto — cero downtime" : result === "good" ? "⚠️ Deploy con advertencias menores" : "💥 Deploy fallido — revisa los logs"}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 4: Security Audit ───────────────────────────────────
function SecurityGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [flagged, setFlagged] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const doneRef = useRef(false);

  const toggle = (i: number) => {
    if (submitted) return;
    setFlagged(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const submit = () => {
    setSubmitted(true);
    const vulnIndices = VULN_LINES.map((l, i) => l.isVuln ? i : -1).filter(i => i >= 0);
    let pts = 0;
    flagged.forEach(i => { if (VULN_LINES[i].isVuln) pts += 9; else pts -= 3; });
    vulnIndices.forEach(i => { if (!flagged.includes(i)) pts -= 2; });
    if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.max(0, Math.min(pts, 25))), 1500); }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-green-300 text-xs uppercase tracking-widest mb-1">Security Audit</p>
        <h2 className="text-white text-xl font-black">Detecta las Vulnerabilidades</h2>
        <p className="text-white/60 text-sm">Marca todas las líneas con fallas de seguridad</p>
      </div>
      <div className="w-full bg-black/70 border border-green-500/20 rounded-xl overflow-hidden">
        <div className="bg-green-900/20 px-4 py-2 text-green-400/60 text-xs font-mono border-b border-green-500/10">
          security-review.js — selecciona líneas vulnerables
        </div>
        {VULN_LINES.map((line, i) => {
          const isFlagged = flagged.includes(i);
          let bg = "transparent"; let border = "transparent"; let textColor = "#86efac";
          if (submitted) {
            if (line.isVuln && isFlagged) { bg = "rgba(74,222,128,0.15)"; border = "#4ade80"; textColor = "#4ade80"; }
            else if (line.isVuln && !isFlagged) { bg = "rgba(248,113,113,0.15)"; border = "#f87171"; textColor = "#f87171"; }
            else if (!line.isVuln && isFlagged) { bg = "rgba(251,191,36,0.1)"; border = "#fbbf24"; textColor = "#fbbf24"; }
          } else if (isFlagged) { bg = "rgba(248,113,113,0.2)"; border = "#f87171"; }
          return (
            <motion.button key={i} onClick={() => toggle(i)} disabled={submitted}
              whileHover={!submitted ? { backgroundColor: "rgba(74,222,128,0.07)" } : {}}
              className="w-full text-left px-4 py-2.5 font-mono text-xs border-l-2 transition-colors flex gap-3 items-center"
              style={{ background: bg, borderLeftColor: border }}>
              <span className="text-green-500/30 w-5 text-right shrink-0">{i + 1}</span>
              <span className="flex-1" style={{ color: textColor }}>{line.code}</span>
              {isFlagged && !submitted && <span className="text-red-400 text-base">🚨</span>}
              {submitted && line.isVuln && <span className="text-red-300 text-xs shrink-0">{line.type}</span>}
            </motion.button>
          );
        })}
      </div>
      {!submitted ? (
        <motion.button onClick={submit} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="px-10 py-4 rounded-2xl text-white font-black font-mono" style={{ background: "linear-gradient(135deg,#16a34a,#14532d)" }}>
          🔒 Enviar Security Report
        </motion.button>
      ) : (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-bold font-mono text-center">
          Vulnerabilidades: SQL Injection, XSS, Credencial expuesta
        </motion.p>
      )}
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────
function ResultScreen({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const rank = pct >= 85 ? "Arquitecto de Software" : pct >= 65 ? "Senior Developer" : pct >= 40 ? "Junior Developer" : "Trainee";
  const color = pct >= 85 ? "#4ade80" : pct >= 65 ? "#fbbf24" : pct >= 40 ? "#60a5fa" : "#f87171";
  const phases = ["Debug", "Algoritmo", "Deploy", "Security"];
  const circ = 2 * Math.PI * 50;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        await saveSimulationResult(user.uid, "software", pct, rank, {
          debug: scores[0] ?? 0,
          algorithm: scores[1] ?? 0,
          deploy: scores[2] ?? 0,
          security: scores[3] ?? 0,
        });
      } catch { /* silent */ }
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-sm mx-auto">
      <p className="text-green-300 text-xs uppercase tracking-widest font-mono">Code Review Final</p>
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <motion.circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white font-mono">{pct}%</span>
          <span className="text-white/50 text-xs font-mono">aptitud</span>
        </div>
      </div>
      <p className="text-2xl font-black text-center font-mono" style={{ color }}>💻 {rank}</p>
      <div className="w-full space-y-2">
        {phases.map((name, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-white/60 text-sm font-mono w-20 shrink-0">{name}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: (scores[i] ?? 0) >= 20 ? "#4ade80" : (scores[i] ?? 0) >= 12 ? "#fbbf24" : "#f87171" }}
                initial={{ width: 0 }} animate={{ width: `${((scores[i] ?? 0) / 25) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.15 }} />
            </div>
            <span className="text-white font-bold text-sm font-mono w-10 text-right">{scores[i] ?? 0}/25</span>
          </div>
        ))}
      </div>
      <button onClick={() => { window.location.href = "/simular"; }} className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition font-mono">
        ← Volver al simulador
      </button>
    </div>
  );
}

export default function SoftwareGame() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);
  useSimulationBadge(phase);

  const advance = (score: number) => {
    setScores(s => [...s, score]);
    setPhase(PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1]);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#042904 0%,#063d06 60%,#042904 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-green-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ opacity: [p.opacity, p.opacity * 0.2, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
      <Navbar variant="dark" title="💻 Software — Hackathon 48h" backHref="/simular" rightSlot={<ScoreBar phase={phase} scores={scores} />} />
      <div className="relative max-w-lg mx-auto py-8">
        <AnimatePresence mode="wait">
          {phase === "briefing" && (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl">💻</motion.div>
              <h1 className="text-white text-3xl font-black font-mono">¡Hackathon!</h1>
              <p className="text-white/70 text-lg">Eres dev senior. 48 horas para demostrar que eres el mejor.</p>
              <div className="w-full bg-black/50 border border-green-500/20 rounded-2xl p-5 text-left space-y-3 font-mono">
                {["🐛 Encuentra el bug en 3 snippets de código", "⚡ Elige el algoritmo de menor complejidad", "🚀 Haz deploy en la ventana de mantenimiento", "🔒 Detecta las vulnerabilidades de seguridad"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-green-400/80 text-sm"><span className="text-green-500/40 w-4">{i + 1}.</span>{t}</div>
                ))}
              </div>
              <motion.button onClick={() => setPhase("debug")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl text-white text-xl font-black font-mono" style={{ background: "linear-gradient(135deg,#16a34a,#14532d)" }}>
                {'>'} npm start
              </motion.button>
            </motion.div>
          )}
          {phase === "debug" && <motion.div key="g1" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><DebugGame onComplete={advance} /></motion.div>}
          {phase === "algorithm" && <motion.div key="g2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><AlgorithmGame onComplete={advance} /></motion.div>}
          {phase === "deploy" && <motion.div key="g3" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><DeployGame onComplete={advance} /></motion.div>}
          {phase === "security" && <motion.div key="g4" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><SecurityGame onComplete={advance} /></motion.div>}
          {phase === "result" && <motion.div key="r" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}><ResultScreen scores={scores} /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
