"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

type GamePhase = "briefing" | "diagnose" | "defib" | "surgery" | "icu" | "result";

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: parseFloat((Math.random() * 100).toFixed(2)),
  y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 3 + 1).toFixed(1)),
  opacity: parseFloat((Math.random() * 0.15 + 0.05).toFixed(2)),
  dur: 4 + Math.random() * 5,
  delay: Math.random() * 4,
}));

const PATIENTS = [
  {
    symptoms: ["Fiebre 39°C", "Tos seca persistente", "Pérdida de olfato", "Fatiga extrema"],
    options: ["Gripe común", "COVID-19", "Bronquitis aguda", "Neumonía"],
    correct: 1,
  },
  {
    symptoms: ["Dolor pecho izquierdo", "Sudoración fría", "Dolor en brazo izq.", "Náuseas"],
    options: ["Reflujo gástrico", "Ansiedad severa", "Infarto agudo de miocardio", "Costocondritis"],
    correct: 2,
  },
  {
    symptoms: ["Dolor abdominal derecho", "Náuseas", "Fiebre 38.5°C", "Rebote positivo"],
    options: ["Gastritis aguda", "Apendicitis", "Cólico renal", "Pancreatitis"],
    correct: 1,
  },
];

const SURGERY_TOOLS = ["🧤", "💉", "🔪", "🩹", "🧵"];
const SURGERY_NAMES = ["Guantes", "Anestesia", "Bisturí", "Hemostasia", "Sutura"];
const SURGERY_ORDER = [1, 0, 2, 3, 4];

function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["diagnose", "defib", "surgery", "icu"];
  return (
    <div className="flex items-center gap-1 w-32">
      {phases.map((p, i) => (
        <div
          key={p}
          className="h-1.5 flex-1 rounded-full transition-all"
          style={{
            background:
              scores[i] !== undefined
                ? scores[i] >= 20 ? "#4ade80" : scores[i] >= 10 ? "#fbbf24" : "#f87171"
                : phase === p ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

// ── GAME 1: Diagnóstico ──────────────────────────────────────
function DiagnoseGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [patient, setPatient] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(8);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef(false);

  const advance = useCallback((pts: number) => {
    const ns = score + pts;
    if (patient >= 2) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 1200); }
    } else {
      setTimeout(() => { setPatient(p => p + 1); setSelected(null); setFeedback(null); setTimeLeft(8); }, 1100);
    }
    setScore(ns);
  }, [score, patient, onComplete]);

  useEffect(() => {
    if (doneRef.current || feedback !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFeedback("wrong");
          advance(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [patient, feedback, advance]);

  const handleSelect = (idx: number) => {
    if (feedback !== null || doneRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(idx);
    const correct = PATIENTS[patient].correct === idx;
    setFeedback(correct ? "correct" : "wrong");
    advance(correct ? (timeLeft >= 6 ? 9 : timeLeft >= 3 ? 7 : 5) : 0);
  };

  const p = PATIENTS[patient];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-red-300 text-xs uppercase tracking-widest mb-1">Urgencias — Paciente {patient + 1}/3</p>
        <h2 className="text-white text-xl font-black">¿Cuál es el diagnóstico?</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: timeLeft > 4 ? "#4ade80" : "#f87171", width: `${(timeLeft / 8) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span className="text-white/60 text-sm">{timeLeft}s</span>
      </div>
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-red-300 text-xs font-semibold uppercase tracking-wider mb-3">🩺 Síntomas presentados:</p>
        <div className="grid grid-cols-2 gap-2">
          {p.symptoms.map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
              <span className="text-red-400">•</span>
              <span className="text-white text-sm">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-3">
        {p.options.map((opt, i) => {
          let bg = "rgba(255,255,255,0.07)"; let border = "rgba(255,255,255,0.12)";
          if (feedback !== null) {
            if (p.correct === i) { bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; }
            else if (selected === i) { bg = "rgba(248,113,113,0.2)"; border = "#f87171"; }
          }
          return (
            <motion.button key={i} onClick={() => handleSelect(i)} whileHover={!feedback ? { scale: 1.03 } : {}} whileTap={!feedback ? { scale: 0.97 } : {}}
              className="rounded-xl px-4 py-3 text-left text-white text-sm font-semibold border transition-colors"
              style={{ background: bg, borderColor: border }}>
              {String.fromCharCode(65 + i)}. {opt}
            </motion.button>
          );
        })}
      </div>
      {feedback && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`text-base font-black ${feedback === "correct" ? "text-green-400" : "text-red-400"}`}>
          {feedback === "correct" ? "✅ ¡Diagnóstico correcto!" : `❌ Era: ${p.options[p.correct]}`}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 2: Desfibrilador ────────────────────────────────────
function DefibGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [ecgPhase, setEcgPhase] = useState<"normal" | "flat" | "done">("normal");
  const [result, setResult] = useState<"perfect" | "good" | "miss" | null>(null);
  const windowOpenRef = useRef(false);
  const doneRef = useRef(false);
  const windowStartRef = useRef(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const delay = 3000 + Math.random() * 3000;
    const t1 = setTimeout(() => {
      setEcgPhase("flat");
      windowOpenRef.current = true;
      windowStartRef.current = Date.now();
      const t2 = setTimeout(() => {
        windowOpenRef.current = false;
        if (!doneRef.current) {
          doneRef.current = true;
          setResult("miss");
          setEcgPhase("done");
          setTimeout(() => onComplete(0), 1500);
        }
      }, 2500);
      return () => clearTimeout(t2);
    }, delay);

    const ticker = setInterval(() => setTick(t => t + 1), 80);
    return () => { clearTimeout(t1); clearInterval(ticker); };
  }, [onComplete]);

  const handleDefib = () => {
    if (doneRef.current) return;
    if (windowOpenRef.current) {
      doneRef.current = true;
      const elapsed = Date.now() - windowStartRef.current;
      const r = elapsed < 900 ? "perfect" : "good";
      const pts = elapsed < 900 ? 25 : elapsed < 2000 ? 16 : 8;
      setResult(r); setEcgPhase("done");
      setTimeout(() => onComplete(pts), 1500);
    }
  };

  const ecgX = (tick * 4) % 400;
  return (
    <div className="flex flex-col items-center gap-6 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-red-300 text-xs uppercase tracking-widest mb-1">Sala de Reanimación</p>
        <h2 className="text-white text-2xl font-black">Usa el Desfibrilador</h2>
        <p className="text-white/60 text-sm mt-1">Actúa cuando el ritmo cardíaco se detenga</p>
      </div>
      <div className="w-full bg-black/60 border border-green-500/30 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-400 text-xs font-mono">♥ MONITOR ECG</span>
          <span className={`text-xs font-mono font-bold ${ecgPhase === "flat" ? "text-red-400 animate-pulse" : ecgPhase === "done" && result !== "miss" ? "text-green-400" : "text-green-400"}`}>
            {ecgPhase === "flat" ? "⚠ ASISTOLIA" : ecgPhase === "done" && result !== "miss" ? "✓ RITMO RESTAURADO" : "NSR"}
          </span>
        </div>
        <svg viewBox="0 0 400 80" className="w-full h-16 overflow-hidden">
          {ecgPhase === "flat" ? (
            <motion.line x1="0" y1="40" x2="400" y2="40" stroke="#f87171" strokeWidth="2.5"
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.35, repeat: Infinity }} />
          ) : ecgPhase === "done" && result !== "miss" ? (
            <path d="M0,40 L60,40 L65,15 L70,65 L75,40 L130,40 L135,15 L140,65 L145,40 L200,40 L205,15 L210,65 L215,40 L270,40 L275,15 L280,65 L285,40 L400,40"
              fill="none" stroke="#4ade80" strokeWidth="2.5" />
          ) : (
            <g transform={`translate(${-400 + ecgX}, 0)`}>
              {[-400, 0, 400].map(offset => (
                <path key={offset} transform={`translate(${offset}, 0)`}
                  d="M0,40 L60,40 L65,15 L70,65 L75,40 L130,40 L135,15 L140,65 L145,40 L200,40 L205,15 L210,65 L215,40 L270,40 L275,15 L280,65 L285,40 L400,40"
                  fill="none" stroke="#4ade80" strokeWidth="2.5" />
              ))}
            </g>
          )}
        </svg>
      </div>
      <div className="text-6xl">{ecgPhase === "flat" ? "😰" : result === "perfect" || result === "good" ? "😊" : result === "miss" ? "😢" : "😐"}</div>
      <motion.button onClick={handleDefib} disabled={ecgPhase === "done"}
        whileTap={ecgPhase !== "done" ? { scale: 0.92 } : {}}
        animate={ecgPhase === "flat" ? { boxShadow: ["0 0 15px #dc2626", "0 0 50px #dc2626", "0 0 15px #dc2626"] } : {}}
        transition={{ duration: 0.35, repeat: Infinity }}
        className="px-14 py-5 rounded-2xl text-xl font-black text-white uppercase tracking-widest transition"
        style={{ background: ecgPhase === "flat" ? "#dc2626" : "rgba(255,255,255,0.15)", opacity: ecgPhase === "done" ? 0.5 : 1 }}>
        ⚡ DESCARGA ELÉCTRICA
      </motion.button>
      {result && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className={`text-base font-black ${result === "perfect" ? "text-green-400" : result === "good" ? "text-yellow-400" : "text-red-400"}`}>
          {result === "perfect" ? "⚡ ¡Perfecto! Corazón reactivado" : result === "good" ? "✅ Buen timing — paciente estable" : "❌ Llegaste demasiado tarde..."}
        </motion.p>
      )}
    </div>
  );
}

// ── GAME 3: Cirugía Express ──────────────────────────────────
function SurgeryGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(25);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(x => {
        if (x <= 1) {
          if (!doneRef.current) { doneRef.current = true; setDone(true); setTimeout(() => onComplete(Math.max(0, 25 - mistakes * 5)), 1000); }
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mistakes, onComplete]);

  const handleTool = (idx: number) => {
    if (doneRef.current) return;
    const step = sequence.length;
    if (SURGERY_ORDER[step] === idx) {
      const next = [...sequence, idx];
      setSequence(next);
      if (next.length === 5) {
        doneRef.current = true; setDone(true);
        setTimeout(() => onComplete(Math.max(5, 25 - mistakes * 4)), 800);
      }
    } else {
      setMistakes(m => m + 1); setShake(idx);
      setTimeout(() => setShake(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-red-300 text-xs uppercase tracking-widest mb-1">Quirófano Central</p>
        <h2 className="text-white text-2xl font-black">Secuencia Quirúrgica</h2>
        <p className="text-white/60 text-sm">Usa los instrumentos en el orden correcto del protocolo</p>
      </div>
      <div className="flex gap-4 text-sm">
        <span className="text-white/60">⏱ {timeLeft}s</span>
        <span className="text-red-400">❌ {mistakes} errores</span>
        <span className="text-green-400">✅ {sequence.length}/5</span>
      </div>
      <div className="flex gap-2">
        {SURGERY_ORDER.map((toolIdx, step) => (
          <div key={step} className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border-2 transition-all"
            style={{
              background: sequence.length > step ? "rgba(74,222,128,0.2)" : step === sequence.length ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)",
              borderColor: sequence.length > step ? "#4ade80" : step === sequence.length ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)",
            }}>
            {sequence.length > step ? SURGERY_TOOLS[toolIdx] : step === sequence.length ? "?" : "·"}
          </div>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {SURGERY_TOOLS.map((tool, i) => {
          const used = sequence.includes(i);
          const isNext = SURGERY_ORDER[sequence.length] === i;
          return (
            <motion.button key={i} onClick={() => handleTool(i)} disabled={used || done}
              animate={shake === i ? { x: [-6, 6, -5, 5, 0] } : {}}
              whileHover={!used && !done ? { scale: 1.1 } : {}} whileTap={!used && !done ? { scale: 0.9 } : {}}
              className="flex flex-col items-center gap-1.5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all"
                style={{
                  background: used ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
                  borderColor: used ? "rgba(255,255,255,0.08)" : isNext ? "#fbbf24" : "rgba(255,255,255,0.25)",
                  opacity: used ? 0.35 : 1,
                }}>
                {tool}
              </div>
              <span className="text-white/60 text-xs">{SURGERY_NAMES[i]}</span>
            </motion.button>
          );
        })}
      </div>
      {done && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-black text-lg">✅ ¡Cirugía completada con éxito!</motion.p>}
    </div>
  );
}

// ── GAME 4: UCI ──────────────────────────────────────────────
function ICUGame({ onComplete }: { onComplete: (s: number) => void }) {
  const o2Ref = useRef(72); const bpRef = useRef(162); const stableRef = useRef(0);
  const [o2, setO2] = useState(72); const [bp, setBP] = useState(162);
  const [timeLeft, setTimeLeft] = useState(20); const [stableTime, setStableTime] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const drift = setInterval(() => {
      o2Ref.current = Math.max(55, Math.min(100, o2Ref.current + (Math.random() > 0.6 ? -1 : 0)));
      bpRef.current = Math.max(65, Math.min(195, bpRef.current + (Math.random() > 0.4 ? 1.5 : -0.5)));
      setO2(Math.round(o2Ref.current)); setBP(Math.round(bpRef.current));
    }, 500);
    return () => clearInterval(drift);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const ok = o2Ref.current >= 94 && bpRef.current >= 90 && bpRef.current <= 130;
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

  const adjO2 = (d: number) => { o2Ref.current = Math.max(55, Math.min(100, o2Ref.current + d * 4)); setO2(Math.round(o2Ref.current)); };
  const adjBP = (d: number) => { bpRef.current = Math.max(65, Math.min(195, bpRef.current + d * 6)); setBP(Math.round(bpRef.current)); };
  const o2ok = o2 >= 94; const bpok = bp >= 90 && bp <= 130;

  return (
    <div className="flex flex-col items-center gap-4 px-4 max-w-sm mx-auto">
      <div className="text-center">
        <p className="text-red-300 text-xs uppercase tracking-widest mb-1">UCI — Cuidados Intensivos</p>
        <h2 className="text-white text-xl font-black">Estabiliza al Paciente</h2>
        <p className="text-white/60 text-xs mt-1">SpO₂ ≥ 94% · PA entre 90–130 mmHg</p>
      </div>
      <div className="flex gap-4 text-sm">
        <span className="text-white/60">⏱ {timeLeft}s</span>
        <span className={stableTime > 0 ? "text-green-400 font-bold" : "text-white/30"}>✅ Estable: {stableTime}s</span>
      </div>
      <div className="text-5xl">{o2ok && bpok ? "😊" : o2 < 85 || bp > 165 ? "😰" : "😐"}</div>
      {[
        { label: "🫁 SpO₂", val: o2, ok: o2ok, max: 100, min: 55, unit: "%", adj: adjO2, hint: "94–100%" },
        { label: "❤️ Presión Arterial", val: bp, ok: bpok, max: 195, min: 65, unit: " mmHg", adj: adjBP, hint: "90–130" },
      ].map(({ label, val, ok, max, min, unit, adj, hint }) => (
        <div key={label} className="w-full bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-white text-sm font-semibold">{label}</span>
            <span className={`font-black text-lg tabular-nums ${ok ? "text-green-400" : "text-red-400"}`}>{val}{unit}</span>
          </div>
          <div className="text-white/40 text-xs mb-2">Rango normal: {hint}</div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all" style={{ width: `${((val - min) / (max - min)) * 100}%`, background: ok ? "#4ade80" : "#f87171" }} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => adj(-1)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition text-sm">−</button>
            <button onClick={() => adj(1)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition text-sm">+</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────
function ResultScreen({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const rank = pct >= 85 ? "Médico Estrella" : pct >= 65 ? "Residente Brillante" : pct >= 40 ? "Estudiante Prometedor" : "Practicante Novato";
  const color = pct >= 85 ? "#4ade80" : pct >= 65 ? "#fbbf24" : pct >= 40 ? "#60a5fa" : "#f87171";
  const phases = ["Diagnóstico", "Desfibrilador", "Cirugía", "UCI"];
  const circ = 2 * Math.PI * 50;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-sm mx-auto">
      <p className="text-sky-300 text-xs uppercase tracking-widest">Evaluación Médica Completa</p>
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <motion.circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{pct}%</span>
          <span className="text-white/50 text-xs">aptitud médica</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-2xl font-black" style={{ color }}>🏥 {rank}</p>
        <p className="text-white/50 text-sm mt-1">{pct >= 85 ? "Tienes pasta de médico. Sigue adelante." : pct >= 65 ? "Buen potencial clínico. Sigue practicando." : pct >= 40 ? "Aún hay mucho por aprender." : "La medicina requiere dedicación total."}</p>
      </div>
      <div className="w-full space-y-2">
        {phases.map((name, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-white/60 text-sm w-28 shrink-0">{name}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: scores[i] >= 20 ? "#4ade80" : scores[i] >= 12 ? "#fbbf24" : "#f87171" }}
                initial={{ width: 0 }} animate={{ width: `${((scores[i] ?? 0) / 25) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.15 }} />
            </div>
            <span className="text-white font-bold text-sm w-10 text-right">{scores[i] ?? 0}/25</span>
          </div>
        ))}
      </div>
      <button onClick={() => { window.location.href = "/simular"; }}
        className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition">
        ← Volver al simulador
      </button>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
const PHASE_ORDER: GamePhase[] = ["briefing", "diagnose", "defib", "surgery", "icu", "result"];

export default function MedicinaGame() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);

  const advance = (score: number) => {
    const ns = [...scores, score];
    setScores(ns);
    const next = PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1];
    setPhase(next);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#082848 0%,#0c3a6b 60%,#082848 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-sky-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
      <Navbar variant="dark" title="🏥 Medicina — ER Simulator" backHref="/simular" rightSlot={<ScoreBar phase={phase} scores={scores} />} />
      <div className="relative max-w-lg mx-auto py-8">
        <AnimatePresence mode="wait">
          {phase === "briefing" && (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-8xl">🏥</motion.div>
              <h1 className="text-white text-3xl font-black">¡Bienvenido al Hospital!</h1>
              <p className="text-white/70 text-lg">Eres médico de urgencias. 4 situaciones críticas te esperan.</p>
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
                {["🩺 Diagnostica 3 pacientes con síntomas reales", "⚡ Usa el desfibrilador en el instante justo", "🔪 Ejecuta la secuencia quirúrgica correcta", "💊 Estabiliza los signos vitales en UCI"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="text-white/40 text-xs w-4">{i + 1}.</span>{t}
                  </div>
                ))}
              </div>
              <motion.button onClick={() => setPhase("diagnose")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl text-white text-xl font-black shadow-2xl"
                style={{ background: "linear-gradient(135deg,#0284c7,#0369a1)" }}>
                🏥 Entrar al Hospital
              </motion.button>
            </motion.div>
          )}
          {phase === "diagnose" && (
            <motion.div key="d1" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}>
              <DiagnoseGame onComplete={advance} />
            </motion.div>
          )}
          {phase === "defib" && (
            <motion.div key="d2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}>
              <DefibGame onComplete={advance} />
            </motion.div>
          )}
          {phase === "surgery" && (
            <motion.div key="d3" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}>
              <SurgeryGame onComplete={advance} />
            </motion.div>
          )}
          {phase === "icu" && (
            <motion.div key="d4" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}>
              <ICUGame onComplete={advance} />
            </motion.div>
          )}
          {phase === "result" && (
            <motion.div key="r" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
              <ResultScreen scores={scores} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
