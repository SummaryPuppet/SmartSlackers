"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────
type GamePhase = "briefing" | "launch" | "dodge" | "landing" | "moonwalk" | "result";

interface Asteroid {
  id: number;
  x: number;   // % from left
  y: number;   // % from top
  size: number; // em
  speed: number; // %/s
}

interface Rock {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

// ─── Module-level constants (stable across renders) ───────
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: parseFloat((Math.random() * 100).toFixed(2)),
  y: parseFloat((Math.random() * 100).toFixed(2)),
  size: parseFloat((Math.random() * 2.5 + 0.5).toFixed(1)),
  opacity: parseFloat((Math.random() * 0.7 + 0.2).toFixed(2)),
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 3,
}));

const MOON_ROCKS: Rock[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: 8 + (i % 5) * 19 + Math.random() * 8,
  y: 25 + Math.floor(i / 5) * 38 + Math.random() * 10,
  collected: false,
}));

const INITIAL_ASTEROIDS: Asteroid[] = [
  { id: 0, x: 80, y: 25 + Math.random() * 50, size: 2.5, speed: 40 },
  { id: 1, x: 95, y: 25 + Math.random() * 50, size: 2.0, speed: 45 },
  { id: 2, x: 112, y: 25 + Math.random() * 50, size: 3.0, speed: 38 },
];

// ─── Stars background ─────────────────────────────────────
function Stars({ dim = false }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: dim ? 0.4 : 1 }}>
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}
    </div>
  );
}

// ─── HUD Score bar ────────────────────────────────────────
function ScoreBar({ phase, scores }: { phase: string; scores: number[] }) {
  const phases = ["launch", "dodge", "landing", "moonwalk"];
  return (
    <div className="flex items-center gap-1">
      {phases.map((p, i) => (
        <div
          key={p}
          className="h-1.5 flex-1 rounded-full transition-all"
          style={{
            background:
              scores[i] !== undefined
                ? scores[i] >= 20
                  ? "#4ade80"
                  : scores[i] >= 10
                  ? "#fbbf24"
                  : "#f87171"
                : phase === p
                ? "rgba(255,255,255,0.5)"
                : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MINI-GAME 1 — LANZAMIENTO (timing game)
// ═══════════════════════════════════════════════════════════
function LaunchGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [count, setCount] = useState(10);
  const [launched, setLaunched] = useState(false);
  const [result, setResult] = useState<"perfect" | "good" | "miss" | "early" | null>(null);
  const [igniting, setIgniting] = useState(false);
  const countRef = useRef(10);
  const doneRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countRef.current <= 0) {
        clearInterval(interval);
        if (!doneRef.current) {
          doneRef.current = true;
          setResult("miss");
          setTimeout(() => onComplete(0), 1800);
        }
        return;
      }
      countRef.current -= 1;
      setCount(countRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [onComplete]);

  const handleIgnite = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLaunched(true);
    setIgniting(true);
    const c = countRef.current;
    let r: typeof result;
    let pts: number;
    if (c === 1 || c === 2) { r = "perfect"; pts = 25; }
    else if (c === 0 || c === 3) { r = "good"; pts = 15; }
    else { r = "early"; pts = 5; }
    setResult(r);
    setTimeout(() => onComplete(pts), 2200);
  }, [onComplete]);

  const windowOpen = count <= 3 && count >= 0;

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      <div className="text-center">
        <p className="text-white/70 text-sm mb-1 uppercase tracking-widest">Control de lanzamiento</p>
        <h2 className="text-white text-2xl font-black">Presiona IGNICIÓN en el momento exacto</h2>
        <p className="text-white/60 text-sm mt-1">Ventana óptima: cuando el contador marque 1 o 2</p>
      </div>

      {/* Countdown display */}
      <div className="relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="text-9xl font-black tabular-nums"
            style={{
              color: windowOpen ? "#4ade80" : "#f87171",
              textShadow: windowOpen
                ? "0 0 40px rgba(74,222,128,0.8), 0 0 80px rgba(74,222,128,0.4)"
                : "0 0 40px rgba(248,113,113,0.5)",
            }}
          >
            {count}
          </motion.div>
        </AnimatePresence>
        {windowOpen && !launched && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-400"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </div>

      {/* Window indicator */}
      <div className="flex gap-2">
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((n) => (
          <div
            key={n}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
            style={{
              background:
                n < count
                  ? "rgba(255,255,255,0.1)"
                  : n === count
                  ? windowOpen
                    ? "#16a34a"
                    : "#dc2626"
                  : n <= 3
                  ? "rgba(74,222,128,0.3)"
                  : "rgba(255,255,255,0.08)",
              color:
                n < count
                  ? "rgba(255,255,255,0.3)"
                  : n === count
                  ? "white"
                  : n <= 3
                  ? "#4ade80"
                  : "rgba(255,255,255,0.5)",
              border: n <= 3 ? "1px solid rgba(74,222,128,0.4)" : "none",
            }}
          >
            {n}
          </div>
        ))}
      </div>

      {/* Ignite button */}
      <AnimatePresence>
        {!result ? (
          <motion.button
            key="btn"
            onClick={handleIgnite}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            animate={windowOpen ? { boxShadow: ["0 0 20px #4ade80", "0 0 60px #4ade80", "0 0 20px #4ade80"] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="relative px-14 py-5 rounded-2xl text-xl font-black text-white uppercase tracking-widest overflow-hidden"
            style={{
              background: windowOpen
                ? "linear-gradient(135deg, #16a34a, #4ade80)"
                : "linear-gradient(135deg, #dc2626, #f87171)",
            }}
          >
            {igniting ? "🔥 IGNICIÓN" : "🚀 ENCENDER MOTORES"}
          </motion.button>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center px-8 py-5 rounded-2xl"
            style={{
              background:
                result === "perfect"
                  ? "rgba(74,222,128,0.2)"
                  : result === "good"
                  ? "rgba(251,191,36,0.2)"
                  : "rgba(248,113,113,0.2)",
              border: `2px solid ${
                result === "perfect" ? "#4ade80" : result === "good" ? "#fbbf24" : "#f87171"
              }`,
            }}
          >
            <p className="text-4xl mb-2">
              {result === "perfect" ? "🎯" : result === "good" ? "✅" : "💥"}
            </p>
            <p className="text-white font-black text-lg">
              {result === "perfect"
                ? "¡LANZAMIENTO PERFECTO!"
                : result === "good"
                ? "Buen lanzamiento"
                : result === "early"
                ? "Demasiado temprano..."
                : "¡Se agotó el tiempo!"}
            </p>
            <p className="text-white/70 text-sm mt-1">
              {result === "perfect"
                ? "+25 puntos — ¡Timing de astronauta!"
                : result === "good"
                ? "+15 puntos"
                : "+5 puntos"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rocket animation */}
      {igniting && (
        <motion.div
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{ x: 200, y: -300, scale: 0.3, opacity: 0 }}
          transition={{ duration: 2, ease: "easeIn" }}
          className="fixed bottom-16 left-1/2 text-6xl pointer-events-none"
          style={{ zIndex: 50 }}
        >
          🚀
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MINI-GAME 2 — ESQUIVAR ASTEROIDES (real-time dodge)
// ═══════════════════════════════════════════════════════════
function DodgeGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [asteroids, setAsteroids] = useState<Asteroid[]>(INITIAL_ASTEROIDS);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [shake, setShake] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  

  const playerYRef = useRef(50);
  const livesRef = useRef(3);
  const finishedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const spawnTimerRef = useRef(0.6);
  const lastTimeRef = useRef(0);
  const nextIdRef = useRef(3);
  const scoreRef = useRef(25);
  const [score, setScore] = useState(25);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    playerYRef.current = Math.max(5, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    playerYRef.current = Math.max(5, Math.min(90, ((touch.clientY - rect.top) / rect.height) * 100));
  }, []);

  const triggerHit = useCallback(() => {
    livesRef.current -= 1;
    setLives(livesRef.current);
    setShake(true);
    scoreRef.current = Math.max(0, scoreRef.current - 8);
    setScore(scoreRef.current);
    setTimeout(() => setShake(false), 400);
    if (livesRef.current <= 0 && !finishedRef.current) {
      finishedRef.current = true;
      setFinished(true);
      setTimeout(() => onComplete(scoreRef.current), 1500);
    }
  }, [onComplete]);

  useEffect(() => {
    if (!started) return;

    // Timer
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (!finishedRef.current) {
            finishedRef.current = true;
            setFinished(true);
            setTimeout(() => onComplete(scoreRef.current), 1200);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Game loop
    function loop(now: number) {
      if (finishedRef.current) return;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      spawnTimerRef.current += dt;

      setAsteroids((prev) => {
        const next = prev.map((a) => ({ ...a, x: a.x - a.speed * dt }));

        // spawn
        if (spawnTimerRef.current > 0.65) {
          next.push({
            id: nextIdRef.current++,
            x: 105,
            y: 8 + Math.random() * 80,
            size: 2.2 + Math.random() * 2.0,
            speed: 35 + Math.random() * 35,
          });
          spawnTimerRef.current = 0;
        }

        // collision & cleanup
        const py = playerYRef.current;
        const filtered: Asteroid[] = [];
        for (const a of next) {
          if (a.x < -10) continue; // off screen
          const inXZone = a.x > 8 && a.x < 22;
          const inYZone = Math.abs(a.y - py) < (a.size * 8);
          if (inXZone && inYZone) {
            triggerHit();
            continue; // remove asteroid on hit
          }
          filtered.push(a);
        }
        return filtered;
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [started, triggerHit, onComplete]);

  const [playerY, setPlayerY] = useState(50);
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setPlayerY(playerYRef.current), 33);
    return () => clearInterval(id);
  }, [started]);

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <div className="text-7xl animate-bounce">☄️</div>
        <h2 className="text-white text-2xl font-black">¡Campo de asteroides!</h2>
        <p className="text-white/70 text-sm max-w-xs">
          Mueve el ratón o arrastra con el dedo para esquivar. Tienes <span className="text-red-400 font-bold">3 vidas</span> y <span className="text-green-400 font-bold">15 segundos</span>.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStarted(true)}
          className="px-10 py-4 rounded-2xl text-lg font-black text-white"
          style={{ background: "linear-gradient(135deg, #dc2626, #f97316)" }}
        >
          🚀 ¡Listo, esquivar!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4">
      {/* HUD */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="text-xl transition-all" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
        <div className="text-white font-black text-lg tabular-nums">
          ⏱ {timeLeft}s
        </div>
        <div className="text-white/60 text-sm">
          {score} pts
        </div>
      </div>

      {/* Play area */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        animate={shake ? { x: [-6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="relative w-full overflow-hidden rounded-2xl cursor-none select-none"
        style={{
          height: 280,
          background: "radial-gradient(ellipse at center, #0f0c29 0%, #000510 100%)",
          border: shake ? "2px solid #f87171" : "2px solid rgba(255,255,255,0.1)",
          boxShadow: shake ? "0 0 30px rgba(248,113,113,0.4)" : "none",
        }}
      >
        <Stars />

        {/* Asteroids */}
        {asteroids.map((a) => (
          <div
            key={a.id}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              fontSize: `${a.size}em`,
              transform: "translate(-50%, -50%)",
              zIndex: 5,
            }}
          >
            ☄️
          </div>
        ))}

        {/* Player */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: "13%",
            top: `${playerY}%`,
            transform: "translate(-50%, -50%) rotate(90deg)",
            fontSize: "2.2em",
            zIndex: 10,
            filter: "drop-shadow(0 0 12px rgba(255,100,100,0.8))",
          }}
        >
          🚀
        </motion.div>

        {/* Engine trail */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: "9%",
            top: `${playerY}%`,
            transform: "translateY(-50%)",
            fontSize: "1.1em",
            zIndex: 9,
            opacity: 0.8,
          }}
          animate={{ opacity: [0.8, 0.3, 0.8], scaleY: [1, 1.5, 1] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        >
          🔥
        </motion.div>

        {/* Finish overlay */}
        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <div className="text-center">
              <p className="text-5xl mb-2">{lives > 0 ? "🌟" : "💥"}</p>
              <p className="text-white font-black text-xl">
                {lives > 0 ? "¡Sobreviviste!" : "Sin escudos"}
              </p>
              <p className="text-white/70 text-sm mt-1">+{score} puntos</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <p className="text-white/50 text-xs text-center">
        Mueve el ratón dentro del área para esquivar los asteroides
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MINI-GAME 3 — ATERRIZAJE LUNAR (physics control)
// ═══════════════════════════════════════════════════════════
function LandingGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [altitude, setAltitude] = useState(100);
  const [velocity, setVelocity] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [burning, setBurning] = useState(false);
  const [landed, setLanded] = useState(false);
  const [landedV, setLandedV] = useState(0);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({ altitude: 100, velocity: 0, fuel: 100, burning: false, done: false });
  const rafRef = useRef<number>(0);
  const lastRef = useRef(0);

  const startBurn = useCallback(() => { stateRef.current.burning = true; setBurning(true); }, []);
  const stopBurn = useCallback(() => { stateRef.current.burning = false; setBurning(false); }, []);

  useEffect(() => {
    if (!started) return;

    function loop(now: number) {
      if (stateRef.current.done) return;
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const s = stateRef.current;

      // Physics
      const gravity = 2.8;        // m/s² (lunar gravity ≈ 1.6, tweaked for fun)
      const thrust = s.burning && s.fuel > 0 ? 6.5 : 0;

      s.velocity = Math.max(0, s.velocity + (gravity - thrust) * dt);
      s.altitude = Math.max(0, s.altitude - s.velocity * dt * 2.5);

      if (s.burning && s.fuel > 0) {
        s.fuel = Math.max(0, s.fuel - 22 * dt);
      }

      setAltitude(parseFloat(s.altitude.toFixed(1)));
      setVelocity(parseFloat(s.velocity.toFixed(1)));
      setFuel(parseFloat(s.fuel.toFixed(0)));

      if (s.altitude <= 0) {
        s.done = true;
        setLanded(true);
        setLandedV(parseFloat(s.velocity.toFixed(1)));
        const v = s.velocity;
        const pts = v < 2 ? 25 : v < 5 ? 18 : v < 9 ? 8 : 0;
        setTimeout(() => onComplete(pts), 2200);
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, onComplete]);

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <div className="text-7xl">🌕</div>
        <h2 className="text-white text-2xl font-black">¡Aterrizaje lunar!</h2>
        <p className="text-white/70 text-sm max-w-sm">
          Mantén presionado <span className="text-orange-400 font-bold">RETROCOHETES</span> para frenar. Si tocas la Luna a más de <span className="text-red-400 font-bold">9 m/s</span> = accidente. El combustible es limitado.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStarted(true)}
          className="px-10 py-4 rounded-2xl text-lg font-black text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
        >
          🌕 Iniciar descenso
        </motion.button>
      </div>
    );
  }

  const altPct = Math.max(0, Math.min(100, altitude));
  const velDanger = velocity >= 9;
  const velWarn = velocity >= 5;

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="text-center">
        <h2 className="text-white text-xl font-black">Aterrizaje lunar</h2>
        <p className="text-white/60 text-sm">Mantén retrocohetes para frenar — cuida el combustible</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Altitude */}
        <div className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <p className="text-white/50 text-xs uppercase tracking-wide">Altitud</p>
          <p className="text-white text-2xl font-black tabular-nums">{altitude.toFixed(0)}</p>
          <p className="text-white/40 text-xs">metros</p>
        </div>

        {/* Velocity */}
        <div className="rounded-2xl p-3 text-center" style={{
          background: velDanger ? "rgba(248,113,113,0.2)" : velWarn ? "rgba(251,191,36,0.15)" : "rgba(74,222,128,0.1)",
          border: `1px solid ${velDanger ? "#f87171" : velWarn ? "#fbbf24" : "#4ade80"}`,
        }}>
          <p className="text-white/50 text-xs uppercase tracking-wide">Velocidad</p>
          <p className="text-2xl font-black tabular-nums" style={{ color: velDanger ? "#f87171" : velWarn ? "#fbbf24" : "#4ade80" }}>
            {velocity.toFixed(1)}
          </p>
          <p className="text-white/40 text-xs">m/s</p>
        </div>

        {/* Fuel */}
        <div className="rounded-2xl p-3 text-center" style={{
          background: fuel < 20 ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${fuel < 20 ? "#f87171" : "rgba(255,255,255,0.12)"}`,
        }}>
          <p className="text-white/50 text-xs uppercase tracking-wide">Combustible</p>
          <p className="text-2xl font-black tabular-nums" style={{ color: fuel < 20 ? "#f87171" : "white" }}>
            {Math.round(fuel)}%
          </p>
          <p className="text-white/40 text-xs">restante</p>
        </div>
      </div>

      {/* Visual descent display */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 180, background: "linear-gradient(180deg, #000510 0%, #0f1e3d 60%, #1a3a1a 100%)" }}
      >
        <Stars />

        {/* Altitude bar */}
        <div
          className="absolute right-3 top-3 bottom-3 w-3 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <motion.div
            className="absolute bottom-0 w-full rounded-full"
            style={{
              height: `${100 - altPct}%`,
              background: "linear-gradient(to top, #4ade80, #22c55e)",
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Rocket */}
        <motion.div
          className="absolute"
          style={{
            left: "42%",
            top: `${Math.max(5, Math.min(75, 10 + (100 - altPct) * 0.65))}%`,
            fontSize: "2.5em",
            transform: "rotate(180deg)",
            filter: "drop-shadow(0 4px 12px rgba(255,150,0,0.6))",
          }}
        >
          🚀
        </motion.div>

        {/* Engine flame */}
        {burning && (
          <motion.div
            className="absolute"
            style={{
              left: "42%",
              top: `${Math.max(5, Math.min(75, 10 + (100 - altPct) * 0.65)) - 6}%`,
              fontSize: "1.8em",
              transform: "translateX(12px)",
            }}
            animate={{ scale: [1, 1.3, 0.9, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          >
            🔥
          </motion.div>
        )}

        {/* Moon surface */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-1"
          style={{ height: 36, background: "linear-gradient(to top, #d1d5db, #9ca3af)", borderRadius: "0 0 16px 16px" }}
        >
          <span style={{ fontSize: "1.4em" }}>🌕</span>
        </div>

        {/* Landed overlay */}
        {landed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl"
            style={{ background: "rgba(0,0,0,0.75)" }}
          >
            <div className="text-center">
              <p className="text-5xl mb-2">{landedV < 2 ? "🏆" : landedV < 5 ? "✅" : landedV < 9 ? "⚠️" : "💥"}</p>
              <p className="text-white font-black text-lg">
                {landedV < 2 ? "¡Aterrizaje perfecto!" : landedV < 5 ? "Buen aterrizaje" : landedV < 9 ? "Aterrizaje brusco" : "¡ACCIDENTE!"}
              </p>
              <p className="text-white/70 text-sm">{landedV.toFixed(1)} m/s de impacto</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Retrorocket button */}
      <motion.button
        onPointerDown={startBurn}
        onPointerUp={stopBurn}
        onPointerLeave={stopBurn}
        whileTap={{ scale: 0.95 }}
        className="w-full py-5 rounded-2xl text-xl font-black text-white select-none touch-none"
        style={{
          background: burning
            ? "linear-gradient(135deg, #f97316, #fbbf24)"
            : "linear-gradient(135deg, #374151, #4b5563)",
          boxShadow: burning ? "0 0 30px rgba(249,115,22,0.5)" : "none",
          transition: "background 0.1s, box-shadow 0.1s",
        }}
        disabled={!!landed}
      >
        {burning ? "🔥 RETROCOHETES ACTIVOS" : "🚀 MANTÉN PRESIONADO — Retrocohetes"}
      </motion.button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MINI-GAME 4 — PASEO LUNAR (click collection)
// ═══════════════════════════════════════════════════════════
function MoonwalkGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [rocks, setRocks] = useState<Rock[]>(MOON_ROCKS.map((r) => ({ ...r })));
  const [oxygen, setOxygen] = useState(100);
  const [collected, setCollected] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const doneRef = useRef(false);
  const collectedRef = useRef(0);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setOxygen((o) => {
        const next = o - 1.8;
        if (next <= 0 && !doneRef.current) {
          doneRef.current = true;
          setFinished(true);
          clearInterval(timer);
          const pts = Math.min(25, Math.round(collectedRef.current * 2.5));
          setTimeout(() => onComplete(pts), 1500);
        }
        return Math.max(0, next);
      });
    }, 300);
    return () => clearInterval(timer);
  }, [started, onComplete]);

  const collectRock = useCallback((id: number) => {
    if (doneRef.current) return;
    setRocks((prev) => {
      const next = prev.map((r) => (r.id === id && !r.collected ? { ...r, collected: true } : r));
      const total = next.filter((r) => r.collected).length;
      collectedRef.current = total;
      setCollected(total);
      if (total >= 10 && !doneRef.current) {
        doneRef.current = true;
        setFinished(true);
        setTimeout(() => onComplete(25), 1200);
      }
      return next;
    });
  }, [onComplete]);

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <div className="text-7xl">🧑‍🚀</div>
        <h2 className="text-white text-2xl font-black">¡Paseo lunar!</h2>
        <p className="text-white/70 text-sm max-w-sm">
          Recoge las <span className="text-yellow-400 font-bold">10 rocas lunares</span> antes de que se acabe el oxígeno. ¡Rápido, toca cada roca!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStarted(true)}
          className="px-10 py-4 rounded-2xl text-lg font-black text-white"
          style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}
        >
          🌑 ¡Bajar a la Luna!
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4">
      {/* HUD */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>🫧 Oxígeno</span>
            <span>{Math.round(oxygen)}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
            <motion.div
              className="h-full rounded-full transition-all"
              style={{
                width: `${oxygen}%`,
                background: oxygen > 50 ? "#4ade80" : oxygen > 25 ? "#fbbf24" : "#f87171",
              }}
            />
          </div>
        </div>
        <div className="text-white font-black tabular-nums text-sm whitespace-nowrap">
          🪨 {collected}/10
        </div>
      </div>

      {/* Moon surface */}
      <div
        className="relative rounded-2xl overflow-hidden select-none"
        style={{
          height: 280,
          background: "radial-gradient(ellipse at 30% 20%, #d1d5db 0%, #9ca3af 40%, #6b7280 100%)",
          cursor: "crosshair",
        }}
      >
        {/* Craters */}
        {[{x:15,y:60,r:18},{x:70,y:75,r:12},{x:50,y:30,r:22},{x:85,y:50,r:10},{x:30,y:85,r:15}].map((c,i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ left:`${c.x}%`, top:`${c.y}%`, width:c.r*2, height:c.r*2, transform:"translate(-50%,-50%)", background:"rgba(0,0,0,0.15)", boxShadow:"inset 0 2px 4px rgba(0,0,0,0.3)" }} />
        ))}

        {/* Moon rocks */}
        {rocks.map((r) => (
          <AnimatePresence key={r.id}>
            {!r.collected && (
              <motion.button
                initial={{ scale: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => collectRock(r.id)}
                className="absolute text-2xl pointer-events-auto"
                style={{
                  left: `${r.x}%`,
                  top: `${r.y}%`,
                  transform: "translate(-50%, -50%)",
                  filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))",
                  fontSize: "1.8em",
                  zIndex: 10,
                }}
              >
                🪨
              </motion.button>
            )}
          </AnimatePresence>
        ))}

        {/* Astronaut */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: "50%", bottom: 8, transform: "translateX(-50%)", fontSize: "2.5em", zIndex: 5 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          🧑‍🚀
        </motion.div>

        {/* Earth in sky */}
        <div className="absolute top-3 right-4 text-4xl pointer-events-none opacity-60">🌍</div>

        {/* Finished overlay */}
        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background: "rgba(0,0,0,0.7)", borderRadius: 16 }}
          >
            <div className="text-center">
              <p className="text-5xl mb-2">{collected >= 8 ? "🏆" : collected >= 5 ? "⭐" : "😮‍💨"}</p>
              <p className="text-white font-black text-xl">
                {collected >= 10 ? "¡Colección completa!" : collected >= 6 ? "¡Buen trabajo!" : `${collected} rocas recogidas`}
              </p>
              <p className="text-white/70 text-sm mt-1">
                +{Math.min(25, Math.round(collected * 2.5))} puntos
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <p className="text-white/50 text-xs text-center">Toca rápido las rocas antes de quedarte sin oxígeno</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RESULT SCREEN
// ═══════════════════════════════════════════════════════════
function ResultScreen({ scores, onRetry, onExit }: { scores: number[]; onRetry: () => void; onExit: () => void }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 100) * 100);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let n = 0;
    const step = Math.max(1, Math.floor(pct / 60));
    const id = setInterval(() => {
      n = Math.min(n + step, pct);
      setDisplay(n);
      if (n >= pct) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [pct]);

  const rank =
    pct >= 85 ? { label: "Comandante de Misión", emoji: "🚀", color: "#fbbf24" }
    : pct >= 65 ? { label: "Astronauta Certificado", emoji: "🌟", color: "#4ade80" }
    : pct >= 45 ? { label: "Cadete Espacial", emoji: "⭐", color: "#60a5fa" }
    : { label: "Aprendiz de Cosmos", emoji: "🌙", color: "#a78bfa" };

  const phaseLabels = ["Lanzamiento", "Asteroides", "Aterrizaje", "Paseo lunar"];
  const circumference = 2 * Math.PI * 70;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 max-w-sm mx-auto px-4 py-6 text-center"
    >
      {/* Circular score */}
      <div className="relative">
        <svg width={180} height={180} className="-rotate-90">
          <circle cx={90} cy={90} r={70} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
          <motion.circle
            cx={90} cy={90} r={70} fill="none"
            stroke={rank.color} strokeWidth={10} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (display / 100) * circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl">{rank.emoji}</span>
          <span className="text-4xl font-black text-white">{display}%</span>
          <span className="text-white/50 text-xs">aptitud espacial</span>
        </div>
      </div>

      {/* Rank */}
      <div>
        <p className="text-2xl font-black" style={{ color: rank.color }}>{rank.label}</p>
        <p className="text-white/60 text-sm mt-1">
          {pct >= 85 ? "¡La NASA te estaría reclutando ahora mismo!" :
           pct >= 65 ? "Tienes lo necesario para el espacio. Sigue entrenando." :
           pct >= 45 ? "El cosmos te llama, aunque aún hay cosas que aprender." :
           "El espacio es duro. Pero cada astronauta empezó desde cero."}
        </p>
      </div>

      {/* Phase breakdown */}
      <div className="w-full space-y-2">
        {phaseLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-white/60 text-xs w-28 text-right">{label}</span>
            <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(scores[i] / 25) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                style={{
                  background:
                    scores[i] >= 20 ? "#4ade80"
                    : scores[i] >= 12 ? "#fbbf24"
                    : "#f87171",
                }}
              />
            </div>
            <span className="text-white font-bold text-xs w-8">{scores[i]}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 w-full">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="w-full py-3.5 rounded-2xl font-black text-sm text-white"
          style={{ background: "linear-gradient(135deg, #dc2626, #f97316)", boxShadow: "0 8px 24px rgba(220,38,38,0.4)" }}
        >
          🔄 Repetir la misión
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onExit}
          className="w-full py-3 rounded-2xl font-medium text-sm text-white/80 border border-white/20 hover:bg-white/10 transition"
        >
          🌍 Explorar otras carreras
        </motion.button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function AstronautaPage() {
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [scores, setScores] = useState<number[]>([]);

  const addScore = useCallback((pts: number) => {
    setScores((prev) => [...prev, pts]);
  }, []);

  const advance = useCallback((pts: number, next: GamePhase) => {
    addScore(pts);
    setTimeout(() => setPhase(next), 400);
  }, [addScore]);

  const reset = useCallback(() => {
    setScores([]);
    setPhase("briefing");
  }, []);

  

  const title: Partial<Record<GamePhase, string>> = {
    briefing: "Misión Apolo X",
    launch: "Fase 1 — Lanzamiento",
    dodge: "Fase 2 — Asteroides",
    landing: "Fase 3 — Aterrizaje",
    moonwalk: "Fase 4 — Paseo Lunar",
    result: "Resultado de Misión",
  };

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at top, #0f0c29 0%, #000510 100%)" }}
    >
      <Stars />

      <Navbar
        variant="dark"
        title={`🚀 Astronauta — ${title[phase]}`}
        backHref="/simular"
        rightSlot={phase !== "briefing" && phase !== "result"
          ? <ScoreBar phase={phase} scores={scores} />
          : undefined}
      />

      {/* Phase content */}
      <div className="relative z-10 max-w-2xl mx-auto pt-6">
        <AnimatePresence mode="wait">

          {phase === "briefing" && (
            <motion.div
              key="briefing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 px-4 text-center"
            >
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-9xl"
              >
                🚀
              </motion.div>

              <div>
                <div className="inline-block rounded-full px-4 py-1.5 text-xs font-bold text-white mb-3" style={{ background: "linear-gradient(135deg, #dc2626, #f97316)" }}>
                  ✨ Simulación de carrera — MODO JUEGO
                </div>
                <h1 className="text-4xl font-black text-white mb-2">Misión Apolo X</h1>
                <p className="text-white/70 text-sm max-w-sm mx-auto leading-relaxed">
                  Tienes un trabajo: llevar a la humanidad a la Luna y traerla de vuelta. 4 fases te esperan — ¿tienes lo que se necesita?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {[
                  { emoji: "🚀", label: "Lanzamiento", sub: "Timing perfecto" },
                  { emoji: "☄️", label: "Asteroides", sub: "Esquiva o muere" },
                  { emoji: "🌕", label: "Aterrizaje", sub: "Físicas reales" },
                  { emoji: "🧑‍🚀", label: "Paseo lunar", sub: "Recoge rocas" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="rounded-2xl p-3 text-center"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <p className="text-2xl mb-1">{f.emoji}</p>
                    <p className="text-white text-xs font-bold">{f.label}</p>
                    <p className="text-white/40 text-xs">{f.sub}</p>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPhase("launch")}
                className="px-16 py-5 rounded-2xl text-xl font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #f97316)",
                  boxShadow: "0 16px 48px rgba(220,38,38,0.45)",
                }}
              >
                🚀 ¡INICIAR MISIÓN!
              </motion.button>
              <p className="text-white/30 text-xs">Usa ratón o pantalla táctil · ~3 minutos</p>
            </motion.div>
          )}

          {phase === "launch" && (
            <motion.div key="launch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LaunchGame onComplete={(pts) => advance(pts, "dodge")} />
            </motion.div>
          )}

          {phase === "dodge" && (
            <motion.div key="dodge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DodgeGame onComplete={(pts) => advance(pts, "landing")} />
            </motion.div>
          )}

          {phase === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingGame onComplete={(pts) => advance(pts, "moonwalk")} />
            </motion.div>
          )}

          {phase === "moonwalk" && (
            <motion.div key="moonwalk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MoonwalkGame onComplete={(pts) => { addScore(pts); setTimeout(() => setPhase("result"), 400); }} />
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultScreen
                scores={scores}
                onRetry={reset}
                onExit={() => (window.location.href = "/simular")}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
