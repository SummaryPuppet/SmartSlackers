"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Result = {
  title: string; desc: string;
  match: number; color: string; emoji: string;
  careerKey: string;
};

export default function ResultScreen({
  result, score
}: { result: Result; score: number }) {
  const [displayMatch, setDisplayMatch] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= result.match) {
        setDisplayMatch(result.match);
        clearInterval(interval);
      } else {
        setDisplayMatch(start);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [result.match]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      style={{
        maxWidth: "560px", width: "100%",
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
        style={{
          fontSize: "30px", fontWeight: 700,
          color: "#cc2b2b", marginBottom: "0.5rem"
        }}
      >
        {result.emoji} {result.title}
      </motion.h2>

      <div style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: "12px", padding: "1.25rem",
        margin: "1.25rem 0"
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: "12px", color: "#363636", marginBottom: "8px"
        }}>
          <span>Compatibilidad con tu perfil</span>
          <span style={{ fontWeight: 700, color: "#FF2B2B", fontSize: "16px" }}>
            {displayMatch}%
          </span>
        </div>
        <div style={{
          height: "10px", background: "rgba(255,255,255,0.08)",
          borderRadius: "5px", overflow: "hidden"
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${displayMatch}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
            style={{
              height: "100%", borderRadius: "5px",
              background: "linear-gradient(90deg, #FF2B2B, rgba(255,43,43,0.6))"
            }}
          />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: "14px", color: "#5b5b5b",
          lineHeight: 1.7, marginBottom: "1.5rem"
        }}
      >
        {result.desc}
      </motion.p>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: "rgba(255,255,255,0.95)",
        border: "0.5px solid rgba(255,0,0,0.18)",
        borderRadius: "12px", padding: "10px 20px",
        marginBottom: "1.5rem"
      }}>
        <span style={{ fontSize: "20px" }}>🏆</span>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#cc2b2b" }}>
            {score} puntos
          </div>
          <div style={{ fontSize: "11px", color: "#5b5b5b" }}>
            Puntaje total del test
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.location.href = `/roadmap?career=${result.careerKey}`}
          style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #ffb3b3, #ff7f7f)",
            border: "none", borderRadius: "12px",
            color: "#1e1e1e", fontSize: "15px", fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Ver mi roadmap personalizado →
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.location.reload()}
          style={{
            width: "100%", padding: "12px",
            background: "transparent",
            border: "0.5px solid rgba(170,0,0,0.18)",
            borderRadius: "12px",
            color: "#1e1e1e", fontSize: "14px",
            cursor: "pointer"
          }}
        >
          🔄 Repetir el test
        </motion.button>
      </div>
    </motion.div>
  );
}
