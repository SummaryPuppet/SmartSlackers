"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

type GamePhase = "briefing" | "evidence" | "objection" | "terms" | "argument" | "result";
const PHASE_ORDER: GamePhase[] = ["briefing", "evidence", "objection", "terms", "argument", "result"];

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: parseFloat((Math.random() * 100).toFixed(2)),
  y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 2 + 0.5).toFixed(1)),
  opacity: parseFloat((Math.random() * 0.12 + 0.04).toFixed(2)),
  dur: 5 + Math.random() * 5,
  delay: Math.random() * 4,
}));

const EVIDENCE_CARDS = [
  { text: "Grabación de la llamada telefónica del acusado", admissible: true },
  { text: "Opinión del vecino sin presenciar los hechos", admissible: false },
  { text: "Huella dactilar hallada en la escena del crimen", admissible: true },
  { text: "Rumor escuchado en el mercado", admissible: false },
  { text: "Informe pericial del médico forense", admissible: true },
  { text: "Confusión del testigo sobre la fecha exacta", admissible: false },
  { text: "Video de cámara de seguridad del edificio", admissible: true },
  { text: "Declaración anónima sin verificar", admissible: false },
];

const TESTIMONIES = [
  { id: 0, text: "Yo estaba en casa el martes por la noche, sin salir en ningún momento." },
  { id: 1, text: "Conozco al Sr. García desde hace más de 15 años, es una persona muy honesta." },
  { id: 2, text: "El martes por la noche sí salí un momento a comprar en la bodega de la esquina." },
  { id: 3, text: "Nunca he tenido ningún problema con la víctima, teníamos buena relación." },
];
const CONTRADICTION_IDX = 2;

const LEGAL_TERMS = [
  { term: "Presunción de inocencia", def: "Toda persona es inocente hasta que se pruebe lo contrario" },
  { term: "Habeas corpus", def: "Garantía que protege la libertad personal contra detenciones arbitrarias" },
  { term: "In dubio pro reo", def: "En caso de duda, se favorece al acusado" },
  { term: "Cosa juzgada", def: "Resolución judicial firme que no puede ser revisada" },
  { term: "Nulidad procesal", def: "Invalidación de actos procesales por vicios de forma o fondo" },
];

const ARGUMENT_CARDS = [
  { id: 0, text: "La evidencia forense sitúa al acusado en la escena del crimen", strength: 4 },
  { id: 1, text: "El acusado tiene antecedentes de conducta similar", strength: 2 },
  { id: 2, text: "Tres testigos independientes corroboran la misma versión", strength: 3 },
  { id: 3, text: "El móvil económico es claro y documentado", strength: 1 },
];

function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["evidence", "objection", "terms", "argument"];
  return (
    <div className="flex items-center gap-1 w-32">
      {phases.map((p, i) => (
        <div key={p} className="h-1.5 flex-1 rounded-full transition-all"
          style={{ background: scores[i] !== undefined ? scores[i] >= 20 ? "#4ade80" : scores[i] >= 10 ? "#fbbf24" : "#f87171" : phase === p ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)" }} />
      ))}
    </div>
  );
}

// ── GAME 1: Evidencia Admisible ──────────────────────────────
function EvidenceGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(6);
  const doneRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextCard = useCallback((pts: number) => {
    const ns = score + pts;
    setScore(ns);
    if (current >= EVIDENCE_CARDS.length - 1) {
      if (!doneRef.current) { doneRef.current = true; setTimeout(() => onComplete(Math.min(ns, 25)), 900); }
    } else {
      setTimeout(() => { setCurrent(c => c + 1); setFeedback(null); setTimeLeft(6); }, 900);
    }
  }, [score, current, onComplete]);

  useEffect(() => {
    if (doneRef.current || feedback !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFeedback(false);
          nextCard(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, feedback, nextCard]);

  const judge = (admissible: boolean) => {
    if (doneRef.current || feedback !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const correct = admissible === EVIDENCE_CARDS[current].admissible;
    setFeedback(correct);
    nextCard(correct ? 3 : 0);
  };

  const card = EVIDENCE_CARDS[current];
  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-amber-300 text-xs uppercase tracking-widest mb-1">Sala de Audiencias — {current + 1}/{EVIDENCE_CARDS.length}</p>
        <h2 className="text-white text-xl font-black">¿Esta evidencia es admisible?</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-amber-400 rounded-full" style={{ width: `${(timeLeft / 6) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span className="text-white/50 text-sm">{timeLeft}s</span>
      </div>
      <motion.div key={current} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className="w-full bg-white/5 border border-amber-500/20 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-white text-base font-semibold leading-relaxed">{card.text}</p>
      </motion.div>
      {feedback === null ? (
        <div className="flex gap-3 w-full">
          <motion.button onClick={() => judge(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex-1 py-4 rounded-xl text-white font-black text-sm" style={{ background: "linear-gradient(135deg,#16a34a,#065f46)" }}>
            ✅ ADMISIBLE
          </motion.button>
          <motion.button onClick={() => judge(false)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex-1 py-4 rounded-xl text-white font-black text-sm" style={{ background: "linear-gradient(135deg,#dc2626,#7f1d1d)" }}>
            ❌ INADMISIBLE
          </motion.button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`w-full rounded-xl p-4 text-center font-bold ${feedback ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
          {feedback ? `✅ Correcto — ${card.admissible ? "Es admisible" : "No es admisible"}` : `❌ Incorrecto — Era ${card.admissible ? "ADMISIBLE" : "INADMISIBLE"}`}
        </motion.div>
      )}
      <p className="text-white/30 text-xs">Puntuación: {score} pts</p>
    </div>
  );
}

// ── GAME 2: Objeción al Testigo ──────────────────────────────
function ObjectionGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [shown, setShown] = useState(0);
  const [objected, setObjected] = useState(false);
  const [result, setResult] = useState<"perfect" | "wrong" | "missed" | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (shown >= TESTIMONIES.length || doneRef.current) return;
    const t = setTimeout(() => setShown(s => s + 1), 2200);
    return () => clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    if (shown >= TESTIMONIES.length && !objected && !doneRef.current) {
      doneRef.current = true; setResult("missed");
      setTimeout(() => onComplete(0), 1500);
    }
  }, [shown, objected, onComplete]);

  const handleObjection = () => {
    if (doneRef.current) return;
    doneRef.current = true; setObjected(true);
    const correct = shown - 1 === CONTRADICTION_IDX;
    const r = correct ? "perfect" : "wrong";
    setResult(r);
    setTimeout(() => onComplete(correct ? 25 : 8), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-amber-300 text-xs uppercase tracking-widest mb-1">Contrainterrogatorio</p>
        <h2 className="text-white text-2xl font-black">¡Detecta la Contradicción!</h2>
        <p className="text-white/60 text-sm">El testigo contradice lo que dijo antes. ¡Objeta en el momento exacto!</p>
      </div>
      <div className="w-full space-y-3">
        <AnimatePresence>
          {TESTIMONIES.slice(0, shown).map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
              className="flex gap-3 rounded-xl p-4 border"
              style={{
                background: result === "perfect" && i === CONTRADICTION_IDX ? "rgba(74,222,128,0.1)" : result === "wrong" && i === CONTRADICTION_IDX ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.05)",
                borderColor: result === "perfect" && i === CONTRADICTION_IDX ? "#4ade80" : result === "wrong" && i === CONTRADICTION_IDX ? "#f87171" : "rgba(255,255,255,0.1)",
              }}>
              <span className="text-2xl">🧑‍⚖️</span>
              <p className="text-white text-sm leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {!result && (
        <motion.button onClick={handleObjection} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
          className="px-10 py-4 rounded-2xl text-white text-lg font-black uppercase tracking-widest"
          style={{ background: "linear-gradient(135deg,#b45309,#78350f)" }}>
          ⚖️ ¡OBJECIÓN!
        </motion.button>
      )}
      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          className={`text-center font-black text-lg ${result === "perfect" ? "text-green-400" : result === "wrong" ? "text-yellow-400" : "text-red-400"}`}>
          {result === "perfect" ? "⚖️ ¡Excelente! Contradicción detectada correctamente" : result === "wrong" ? "⚠️ Objetaste demasiado pronto" : "❌ No detectaste la contradicción"}
        </motion.div>
      )}
    </div>
  );
}

// ── GAME 3: Términos Legales ─────────────────────────────────
function TermsGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [pairs, setPairs] = useState<{ termIdx: number | null; defIdx: number | null }>({ termIdx: null, defIdx: null });
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const doneRef = useRef(false);

  const shuffledDefs = useRef(LEGAL_TERMS.map((_, i) => i).sort(() => Math.random() - 0.5)).current;

  const handleTerm = (i: number) => {
    if (matched.includes(i)) return;
    setPairs(p => ({ ...p, termIdx: p.termIdx === i ? null : i }));
  };

  const handleDef = (shuffledIdx: number) => {
    const realIdx = shuffledDefs[shuffledIdx];
    if (matched.includes(realIdx)) return;
    if (pairs.termIdx === null) return;

    if (pairs.termIdx === realIdx) {
      const nm = [...matched, realIdx];
      setMatched(nm);
      setPairs({ termIdx: null, defIdx: null });
      if (nm.length === LEGAL_TERMS.length && !doneRef.current) {
        doneRef.current = true;
        setTimeout(() => onComplete(25), 800);
      }
    } else {
      setWrong(realIdx);
      setTimeout(() => setWrong(null), 600);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (!doneRef.current && matched.length < LEGAL_TERMS.length) {
        doneRef.current = true;
        onComplete(Math.round((matched.length / LEGAL_TERMS.length) * 25));
      }
    }, 45000);
    return () => clearTimeout(t);
  }, [matched, onComplete]);

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-amber-300 text-xs uppercase tracking-widest mb-1">Derecho Procesal</p>
        <h2 className="text-white text-xl font-black">Une el Término con su Definición</h2>
        <p className="text-white/60 text-sm">Empareja los 5 términos jurídicos correctamente</p>
      </div>
      <div className="text-white/40 text-sm">{matched.length}/5 emparejados</div>
      <div className="w-full grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-amber-300 text-xs font-bold uppercase tracking-wider text-center mb-2">Términos</p>
          {LEGAL_TERMS.map((item, i) => (
            <motion.button key={i} onClick={() => handleTerm(i)} whileTap={!matched.includes(i) ? { scale: 0.97 } : {}}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold border-2 transition-all"
              style={{
                background: matched.includes(i) ? "rgba(74,222,128,0.15)" : pairs.termIdx === i ? "rgba(180,83,9,0.3)" : "rgba(255,255,255,0.07)",
                borderColor: matched.includes(i) ? "#4ade80" : pairs.termIdx === i ? "#b45309" : "rgba(255,255,255,0.15)",
                color: matched.includes(i) ? "#4ade80" : "white",
                opacity: matched.includes(i) ? 0.6 : 1,
              }}>
              {item.term}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-amber-300 text-xs font-bold uppercase tracking-wider text-center mb-2">Definiciones</p>
          {shuffledDefs.map((realIdx, shuffledIdx) => (
            <motion.button key={shuffledIdx} onClick={() => handleDef(shuffledIdx)} whileTap={!matched.includes(realIdx) ? { scale: 0.97 } : {}}
              animate={wrong === realIdx ? { x: [-4, 4, -3, 3, 0] } : {}}
              className="w-full rounded-xl px-3 py-2.5 text-left text-xs border-2 transition-all"
              style={{
                background: matched.includes(realIdx) ? "rgba(74,222,128,0.15)" : wrong === realIdx ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.07)",
                borderColor: matched.includes(realIdx) ? "#4ade80" : wrong === realIdx ? "#f87171" : "rgba(255,255,255,0.15)",
                color: matched.includes(realIdx) ? "#4ade80" : "rgba(255,255,255,0.85)",
                opacity: matched.includes(realIdx) ? 0.6 : 1,
              }}>
              {LEGAL_TERMS[realIdx].def}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── GAME 4: Alegato Final ────────────────────────────────────
function ArgumentGame({ onComplete }: { onComplete: (s: number) => void }) {
  const [order, setOrder] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const available = ARGUMENT_CARDS.filter(c => !order.includes(c.id));
  const correctOrder = [...ARGUMENT_CARDS].sort((a, b) => b.strength - a.strength).map(c => c.id);

  const select = (id: number) => {
    if (submitted) return;
    setOrder(o => [...o, id]);
  };
  const remove = (id: number) => {
    if (submitted) return;
    setOrder(o => o.filter(x => x !== id));
  };

  const submit = () => {
    setSubmitted(true);
    let pts = 0;
    order.forEach((id, i) => { if (id === correctOrder[i]) pts += 6; });
    setTimeout(() => onComplete(Math.min(pts + (order.length === 4 ? 1 : 0), 25)), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto">
      <div className="text-center">
        <p className="text-amber-300 text-xs uppercase tracking-widest mb-1">Alegato Final</p>
        <h2 className="text-white text-xl font-black">Ordena tus Argumentos</h2>
        <p className="text-white/60 text-sm">Del más fuerte al más débil para el alegato final</p>
      </div>
      <div className="w-full">
        <p className="text-amber-300 text-xs font-bold uppercase mb-2">Tu orden de argumentos:</p>
        <div className="space-y-2 min-h-16">
          {order.length === 0 && <div className="text-white/30 text-sm text-center py-4">Selecciona argumentos abajo</div>}
          {order.map((id, i) => {
            const card = ARGUMENT_CARDS.find(c => c.id === id)!;
            const isCorrect = submitted && id === correctOrder[i];
            return (
              <motion.div key={id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 rounded-xl p-3 border-2"
                style={{
                  background: submitted ? isCorrect ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)" : "rgba(180,83,9,0.2)",
                  borderColor: submitted ? isCorrect ? "#4ade80" : "#f87171" : "#b45309",
                }}>
                <span className="text-white/50 font-bold text-sm w-5">{i + 1}.</span>
                <p className="text-white text-sm flex-1">{card.text}</p>
                {!submitted && <button onClick={() => remove(id)} className="text-white/40 hover:text-red-400 transition text-lg">×</button>}
                {submitted && <span>{isCorrect ? "✅" : "❌"}</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <p className="text-white/50 text-xs font-bold uppercase mb-2">Argumentos disponibles:</p>
        <div className="space-y-2">
          {available.map(card => (
            <motion.button key={card.id} onClick={() => select(card.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full text-left rounded-xl p-3 border border-white/15 text-white text-sm hover:bg-white/10 transition">
              {card.text}
            </motion.button>
          ))}
        </div>
      </div>
      {order.length === 4 && !submitted && (
        <motion.button onClick={submit} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="px-10 py-4 rounded-2xl text-white font-black" style={{ background: "linear-gradient(135deg,#b45309,#78350f)" }}>
          ⚖️ Presentar Alegato Final
        </motion.button>
      )}
      {submitted && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-300 font-bold text-center">
          Orden correcto: {correctOrder.map(id => ARGUMENT_CARDS.find(c => c.id === id)!.text.slice(0, 20) + "...").join(" → ")}
        </motion.p>
      )}
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────
function ResultScreen({ scores }: { scores: number[] }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const rank = pct >= 85 ? "Gran Abogado" : pct >= 65 ? "Abogado Graduado" : pct >= 40 ? "Pasante Destacado" : "Estudiante de Leyes";
  const color = pct >= 85 ? "#4ade80" : pct >= 65 ? "#fbbf24" : pct >= 40 ? "#60a5fa" : "#f87171";
  const phases = ["Evidencia", "Objeción", "Términos", "Alegato"];
  const circ = 2 * Math.PI * 50;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-sm mx-auto">
      <p className="text-amber-300 text-xs uppercase tracking-widest">Veredicto Final</p>
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <motion.circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{pct}%</span>
          <span className="text-white/50 text-xs">aptitud legal</span>
        </div>
      </div>
      <p className="text-2xl font-black text-center" style={{ color }}>⚖️ {rank}</p>
      <div className="w-full space-y-2">
        {phases.map((name, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-white/60 text-sm w-24 shrink-0">{name}</span>
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

export default function DerechoGame() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);

  const advance = (score: number) => {
    const ns = [...scores, score];
    setScores(ns);
    setPhase(PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1]);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#3d2000 0%,#5c3200 60%,#3d2000 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-amber-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
        ))}
      </div>
      <Navbar variant="dark" title="⚖️ Derecho — Tribunal Supremo" backHref="/simular" rightSlot={<ScoreBar phase={phase} scores={scores} />} />
      <div className="relative max-w-lg mx-auto py-8">
        <AnimatePresence mode="wait">
          {phase === "briefing" && (
            <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center">
              <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="text-8xl">⚖️</motion.div>
              <h1 className="text-white text-3xl font-black">¡Al Tribunal!</h1>
              <p className="text-white/70 text-lg">Eres abogado defensor. El veredicto depende de ti.</p>
              <div className="w-full bg-white/5 border border-amber-500/20 rounded-2xl p-5 text-left space-y-3">
                {["📋 Clasifica 8 piezas de evidencia como admisible o no", "🗣 Detecta la contradicción del testigo y objeta", "📚 Empareja 5 términos jurídicos con sus definiciones", "🎯 Ordena tus argumentos de mayor a menor peso"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-sm"><span className="text-white/40 text-xs w-4">{i + 1}.</span>{t}</div>
                ))}
              </div>
              <motion.button onClick={() => setPhase("evidence")} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl text-white text-xl font-black" style={{ background: "linear-gradient(135deg,#b45309,#78350f)" }}>
                ⚖️ Iniciar el Juicio
              </motion.button>
            </motion.div>
          )}
          {phase === "evidence" && <motion.div key="g1" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><EvidenceGame onComplete={advance} /></motion.div>}
          {phase === "objection" && <motion.div key="g2" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><ObjectionGame onComplete={advance} /></motion.div>}
          {phase === "terms" && <motion.div key="g3" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><TermsGame onComplete={advance} /></motion.div>}
          {phase === "argument" && <motion.div key="g4" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }}><ArgumentGame onComplete={advance} /></motion.div>}
          {phase === "result" && <motion.div key="r" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}><ResultScreen scores={scores} /></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
