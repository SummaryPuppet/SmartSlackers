"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AvatarCustomizer from "@/app/components/avatar/AvatarCustomizer";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { auth, db } from "@/src/firebase/config";
import { trackBadgeEvent, showBadgeNotification } from "@/src/services/badgeService";

type Result = {
  title?: string; desc?: string;
  match?: number; color?: string; emoji?: string;
  careerKey: string;
  insufficient?: boolean;
  answered?: number;
};

export default function ResultScreen({
  result, score
}: { result: Result; score: number }) {
  const [displayMatch, setDisplayMatch] = useState(0);
  const [showAvatar, setShowAvatar] = useState(false);

  // Contador de compatibilidad — solo corre si hay resultado real
  useEffect(() => {
    if (result.insufficient || !result.match) return;
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= result.match!) {
        setDisplayMatch(result.match!);
        clearInterval(interval);
      } else {
        setDisplayMatch(start);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [result.match, result.insufficient]);

  // Avatar cosmético — solo si hay resultado real
  useEffect(() => {
    if (result.insufficient) return;
    const t = setTimeout(() => setShowAvatar(true), 1200);
    return () => clearTimeout(t);
  }, [result.insufficient]);

  // Guarda el resultado en Firestore una sola vez.
  // El localStorage actúa como candado atómico: el primero en llegar elimina
  // la clave y guarda; el segundo invocación (React Strict Mode) no encuentra
  // la clave y sale sin duplicar.
  useEffect(() => {
    const save = async () => {
      const { TEST_SESSION_KEY } = await import("@/app/components/test/useTestLogic");
      const session = localStorage.getItem(TEST_SESSION_KEY);
      if (!session) return;            // ya guardado o test sin sesión activa
      localStorage.removeItem(TEST_SESSION_KEY); // candado: eliminar antes de guardar

      const fbUser = auth.currentUser;
      if (!fbUser) return;

      let col = "Usuarios";
      for (const c of ["Usuarios", "usuarios"]) {
        try {
          const snap = await getDoc(doc(db, c, fbUser.uid));
          if (snap.exists()) { col = c; break; }
        } catch { /* ignore */ }
      }
      await addDoc(collection(db, col, fbUser.uid, "historialTests"), {
        careerKey:    result.careerKey,
        careerTitle:  result.title      ?? null,
        careerEmoji:  result.emoji      ?? null,
        match:        result.match      ?? null,
        score,
        insufficient: result.insufficient ?? false,
        answered:     result.answered   ?? 10,
        completedAt:  serverTimestamp(),
      });
    };
    save().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Badge: test completado
  useEffect(() => {
    if (result.insufficient) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const { newBadges } = await trackBadgeEvent(user.uid, "test_completed");
        newBadges.forEach((b) => showBadgeNotification(b));
      } catch { /* silent */ }
    });
    return () => unsub();
  }, [result.insufficient]);

  // ── Pantalla de respuestas insuficientes ──────────────────────────
  if (result.insufficient) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{
          maxWidth: "480px", width: "100%",
          textAlign: "center", padding: "3rem 2rem",
          background: "rgba(255,255,255,0.96)",
          border: "0.5px solid rgba(255,0,0,0.18)",
          borderRadius: "20px",
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
          style={{ fontSize: "80px", marginBottom: "1.25rem", lineHeight: 1 }}
        >
          😔
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ fontSize: "22px", fontWeight: 700, color: "#cc2b2b", marginBottom: "0.75rem" }}
        >
          No hay suficientes características
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "14px", color: "#5b5b5b", lineHeight: 1.7, marginBottom: "0.5rem" }}
        >
          Solo respondiste{" "}
          <strong style={{ color: "#cc2b2b" }}>
            {result.answered ?? 0} de {10} preguntas
          </strong>
          . Necesitamos al menos <strong>3 respuestas</strong> para identificar
          tu perfil vocacional con precisión.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{ fontSize: "13px", color: "#8a8a8a", marginBottom: "2rem" }}
        >
          Tómate tu tiempo y elige la opción que más te represente. ¡Tú puedes! 💪
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => window.location.reload()}
          style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #ff6b6b, #cc2b2b)",
            border: "none", borderRadius: "12px",
            color: "white", fontSize: "15px", fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(220,38,38,0.25)",
          }}
        >
          🔄 Intentar de nuevo
        </motion.button>
      </motion.div>
    );
  }

  // ── Pantalla de resultado normal ──────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{
          textAlign: "center", padding: "2.5rem 2rem",
          background: "rgba(255,255,255,0.96)",
          border: "0.5px solid rgba(255,0,0,0.18)",
          borderRadius: "20px",
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
          style={{ fontSize: "64px", marginBottom: "1rem" }}
        >
          🎉
        </motion.div>

        <div style={{
          fontSize: "13px", color: "#3a3a3a",
          marginBottom: "8px", letterSpacing: "1px",
          textTransform: "uppercase", fontWeight: 500
        }}>
          Tu carrera ideal es
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: "30px", fontWeight: 700, color: "#cc2b2b", marginBottom: "0.5rem" }}
        >
          {result.emoji} {result.title}
        </motion.h2>

        <div style={{
          background: "rgba(255,255,255,0.95)", borderRadius: "12px",
          padding: "1.25rem", margin: "1.25rem 0"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#363636", marginBottom: "8px" }}>
            <span>Compatibilidad con tu perfil</span>
            <span style={{ fontWeight: 700, color: "#FF2B2B", fontSize: "16px" }}>{displayMatch}%</span>
          </div>
          <div style={{ height: "10px", background: "rgba(0,0,0,0.06)", borderRadius: "5px", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${displayMatch}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
              style={{ height: "100%", borderRadius: "5px", background: "linear-gradient(90deg, #FF2B2B, rgba(255,43,43,0.6))" }}
            />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "14px", color: "#5b5b5b", lineHeight: 1.7, marginBottom: "1.5rem" }}
        >
          {result.desc}
        </motion.p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.95)", border: "0.5px solid rgba(255,0,0,0.18)", borderRadius: "12px", padding: "10px 20px", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "20px" }}>🏆</span>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#cc2b2b" }}>{score} puntos</div>
            <div style={{ fontSize: "11px", color: "#5b5b5b" }}>Puntaje total del test</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = `/roadmap?career=${result.careerKey}`}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #ffb3b3, #ff7f7f)", border: "none", borderRadius: "12px", color: "#1e1e1e", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
          >
            Ver mi roadmap personalizado →
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = `/laboratorios?career=${result.careerKey}`}
            style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #0369a1, #0ea5e9)", border: "none", borderRadius: "12px", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            🔬 Ver Laboratorio de {result.title}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.location.reload()}
            style={{ width: "100%", padding: "12px", background: "transparent", border: "0.5px solid rgba(170,0,0,0.18)", borderRadius: "12px", color: "#1e1e1e", fontSize: "14px", cursor: "pointer" }}
          >
            🔄 Repetir el test
          </motion.button>
        </div>
      </motion.div>

      {/* Avatar con cosmético de carrera */}
      {showAvatar && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{
            background: "rgba(255,255,255,0.96)",
            border: "0.5px solid rgba(255,0,0,0.12)",
            borderRadius: "20px",
            padding: "1.5rem 1rem",
          }}
        >
          <h3 style={{ textAlign: "center", fontWeight: 700, fontSize: "18px", marginBottom: "4px" }}>
            ¡Tu avatar ha recibido un cosmético!
          </h3>
          <p style={{ textAlign: "center", fontSize: "13px", color: "#5b5b5b", marginBottom: "1rem" }}>
            Personaliza tu avatar y guárdalo con tu cosmético de {result.title}
          </p>
          <AvatarCustomizer careerResult={result.careerKey} />
        </motion.div>
      )}
    </div>
  );
}
