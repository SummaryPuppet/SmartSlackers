"use client";
import { motion } from "framer-motion";
import type { AvatarConfig } from "@/types/avatar";
import DinosaurSVG from "@/app/components/avatar/DinosaurSVG";
import AvatarSVG from "@/app/components/avatar/AvatarSVG";

type Props = {
  onStart: () => void;
  hasSession?: boolean;
  sessionProgress?: { current: number; total: number };
  onResume?: () => void;
  avatarConfig?: AvatarConfig | null;
};

export default function TestIntro({
  onStart,
  hasSession = false,
  sessionProgress,
  onResume,
  avatarConfig,
}: Props) {
  const isDino = !avatarConfig || (avatarConfig.avatarType ?? "dino") === "dino";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        textAlign: "center", maxWidth: "520px", width: "100%",
        padding: "2.5rem 2rem",
        background: "rgba(255,255,255,0.95)",
        border: "0.5px solid rgba(255,0,0,0.2)",
        borderRadius: "20px",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "rgba(255,0,0,0.12)", border: "0.5px solid rgba(255,0,0,0.25)",
          color: "#2d2d2d", fontSize: "12px", fontWeight: 500,
          padding: "4px 14px", borderRadius: "20px", marginBottom: "1.5rem"
        }}
      >
        ✨ Test Vocacional
      </motion.div>

      {/* Emoji animado */}
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        style={{ fontSize: "64px", marginBottom: "1rem", display: "block" }}
      >
        🎯
      </motion.div>

      <h1 style={{
        fontSize: "28px", fontWeight: 600, color: "#1e1e1e",
        marginBottom: "12px", lineHeight: 1.3
      }}>
        Descubre tu carrera ideal
      </h1>

      <p style={{
        fontSize: "15px", color: "#5c5c5c", lineHeight: 1.7,
        marginBottom: "2rem"
      }}>
        10 preguntas · 20 segundos cada una · Resultado con IA
        <br />
        Responde rapido — el tiempo suma puntos extra.
      </p>

      {/* Stats row */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
        gap: "10px", marginBottom: "2rem"
      }}>
        {[
          { icon: "⚡", label: "10 preguntas", sub: "Rápido y preciso" },
          { icon: "🏆", label: "Sistema de pts", sub: "Velocidad = bonus" },
          { icon: "🤖", label: "Análisis IA", sub: "Resultado único" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "0.5px solid rgba(255,0,0,0.15)",
              borderRadius: "12px", padding: "12px 8px"
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.icon}</div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#2d2d2d" }}>{s.label}</div>
            <div style={{ fontSize: "11px", color: "#d74f4f", marginTop: "2px" }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Banner "Continuar" — solo si hay sesión guardada */}
      {hasSession && onResume && sessionProgress && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
            border: "1.5px solid #f59e0b",
            borderRadius: "14px",
            padding: "14px 16px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* Avatar con punto pulsante */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {isDino
              ? <DinosaurSVG size={64} />
              : <AvatarSVG config={avatarConfig!} size={64} />
            }
            {/* Pulsing dot */}
            <span style={{
              position: "absolute", top: "-3px", right: "-3px",
              width: "14px", height: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                position: "absolute",
                width: "14px", height: "14px",
                borderRadius: "50%",
                background: "#f59e0b",
                opacity: 0.75,
                animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
              }} />
              <span style={{
                width: "10px", height: "10px",
                borderRadius: "50%",
                background: "#d97706",
                display: "block",
                flexShrink: 0,
              }} />
            </span>
          </div>

          {/* Texto */}
          <div style={{ textAlign: "left", flex: 1 }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#92400e", margin: 0 }}>
              Test en progreso
            </p>
            <p style={{ fontSize: "11px", color: "#b45309", margin: "2px 0 6px" }}>
              Pregunta {sessionProgress.current + 1} de {sessionProgress.total}
            </p>
            {/* Mini barra de progreso */}
            <div style={{
              height: "5px", borderRadius: "3px",
              background: "rgba(217,119,6,0.2)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${((sessionProgress.current) / sessionProgress.total) * 100}%`,
                background: "#f59e0b",
                borderRadius: "3px",
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* Botón continuar */}
          <button
            onClick={onResume}
            style={{
              padding: "8px 18px",
              background: "#f59e0b",
              border: "none", borderRadius: "10px",
              color: "white", fontSize: "13px", fontWeight: 700,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            ▶ Continuar
          </button>
        </motion.div>
      )}

      {/* Botón start */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        style={{
          width: "100%", padding: "15px",
          background: "linear-gradient(135deg, #ffb3b3, #ff7f7f)",
          border: "none", borderRadius: "12px",
          color: "#1e1e1e", fontSize: "16px", fontWeight: 600,
          cursor: "pointer", letterSpacing: "0.3px"
        }}
      >
        {hasSession ? "🔄 Empezar de nuevo" : "🚀 Comenzar el test"}
      </motion.button>

      <p style={{ fontSize: "11px", color: "#7a7a7a", marginTop: "12px" }}>
        Tus respuestas son confidenciales y solo se usan para tu perfil vocacional.
      </p>

      {/* Keyframe para el ping del punto */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
