"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/lib/i18n";

type Deco = { t: string; x: number; y: number; s: number; o: number; color?: string };

type CareerCard = {
  id: string;
  href: string;
  emoji: string;
  title: string;
  tagline: string;
  color: string;
  gradient: string;
  bg: string;
  border: string;
  badge: string;
  features: string[];
  decos: Deco[];
  svgType?: "ecg" | "grid" | "matrix" | "flame";
};

function getCareerCards(t: (key: string) => string): CareerCard[] {
  return [
    {
      id: "medicina",
      href: "/simular/medicina",
      emoji: "🏥",
      title: t("simular.medicinaTitle"),
      tagline: t("simular.medicinaTagline"),
      color: "#bae6fd",
      gradient: "linear-gradient(135deg,#0284c7,#38bdf8)",
      bg: "linear-gradient(145deg, #0369a1 0%, #0ea5e9 55%, #38bdf8 100%)",
      border: "rgba(186,230,253,0.45)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "❤️", x: 75, y: 10, s: 1.8, o: 0.28 },
        { t: "🩺", x: 7, y: 68, s: 1.4, o: 0.25 },
        { t: "💊", x: 79, y: 64, s: 1.2, o: 0.22 },
        { t: "+", x: 60, y: 40, s: 3.2, o: 0.12, color: "#fff" },
        { t: "+", x: 18, y: 20, s: 2.0, o: 0.1, color: "#fff" },
        { t: "🏥", x: 54, y: 83, s: 1.3, o: 0.22 },
      ],
      svgType: "ecg",
    },
    {
      id: "derecho",
      href: "/simular/derecho",
      emoji: "⚖️",
      title: t("simular.derechoTitle"),
      tagline: t("simular.derechoTagline"),
      color: "#fef3c7",
      gradient: "linear-gradient(135deg,#92400e,#fbbf24)",
      bg: "linear-gradient(145deg, #78350f 0%, #b45309 55%, #d97706 100%)",
      border: "rgba(254,243,199,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "⚖️", x: 70, y: 9, s: 1.9, o: 0.28 },
        { t: "📜", x: 7, y: 66, s: 1.4, o: 0.25 },
        { t: "🏛️", x: 75, y: 66, s: 1.6, o: 0.24 },
        { t: "🔨", x: 52, y: 48, s: 1.5, o: 0.18 },
        { t: "📖", x: 18, y: 14, s: 1.2, o: 0.22 },
      ],
    },
    {
      id: "arquitectura",
      href: "/simular/arquitectura",
      emoji: "🏛️",
      title: t("simular.arquitecturaTitle"),
      tagline: t("simular.arquitecturaTagline"),
      color: "#dbeafe",
      gradient: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
      bg: "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 55%, #3b82f6 100%)",
      border: "rgba(219,234,254,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "📐", x: 70, y: 9, s: 1.7, o: 0.28 },
        { t: "📏", x: 7, y: 63, s: 1.4, o: 0.25 },
        { t: "🏗️", x: 73, y: 66, s: 1.6, o: 0.25 },
        { t: "🔲", x: 50, y: 80, s: 1.3, o: 0.18 },
      ],
      svgType: "grid",
    },
    {
      id: "gastronomia",
      href: "/simular/gastronomia",
      emoji: "👨‍🍳",
      title: t("simular.gastronomiaTitle"),
      tagline: t("simular.gastronomiaTagline"),
      color: "#ffedd5",
      gradient: "linear-gradient(135deg,#c2410c,#f97316)",
      bg: "linear-gradient(145deg, #7c2d12 0%, #c2410c 55%, #ea580c 100%)",
      border: "rgba(255,237,213,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "🔥", x: 67, y: 7, s: 2.0, o: 0.32 },
        { t: "🍳", x: 7, y: 60, s: 1.6, o: 0.28 },
        { t: "🌶️", x: 76, y: 63, s: 1.3, o: 0.28 },
        { t: "✨", x: 40, y: 80, s: 1.1, o: 0.22 },
        { t: "🔥", x: 26, y: 86, s: 1.4, o: 0.22 },
        { t: "🧂", x: 57, y: 43, s: 1.1, o: 0.2 },
      ],
      svgType: "flame",
    },
    {
      id: "ingenieria-civil",
      href: "/simular/ingenieria-civil",
      emoji: "🏗️",
      title: t("simular.ingenieriaCivilTitle"),
      tagline: t("simular.ingenieriaCivilTagline"),
      color: "#fde68a",
      gradient: "linear-gradient(135deg,#92400e,#d97706)",
      bg: "linear-gradient(145deg, #451a03 0%, #92400e 55%, #b45309 100%)",
      border: "rgba(253,230,138,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "⚙️", x: 70, y: 9, s: 1.7, o: 0.28 },
        { t: "🔩", x: 7, y: 63, s: 1.5, o: 0.28 },
        { t: "🦺", x: 74, y: 66, s: 1.5, o: 0.25 },
        { t: "🔨", x: 52, y: 80, s: 1.4, o: 0.22 },
        { t: "📐", x: 20, y: 16, s: 1.2, o: 0.22 },
      ],
    },
    {
      id: "software",
      href: "/simular/software",
      emoji: "💻",
      title: t("simular.softwareTitle"),
      tagline: t("simular.softwareTagline"),
      color: "#bbf7d0",
      gradient: "linear-gradient(135deg,#166534,#4ade80)",
      bg: "linear-gradient(145deg, #052e16 0%, #14532d 55%, #166534 100%)",
      border: "rgba(187,247,208,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "</>", x: 65, y: 7, s: 0.78, o: 0.35, color: "#86efac" },
        { t: "{ }", x: 7, y: 16, s: 0.8, o: 0.3, color: "#86efac" },
        { t: "const", x: 55, y: 53, s: 0.64, o: 0.28, color: "#86efac" },
        { t: "fn()", x: 9, y: 70, s: 0.7, o: 0.28, color: "#86efac" },
        { t: "01010", x: 62, y: 78, s: 0.58, o: 0.24, color: "#86efac" },
        { t: "=>", x: 37, y: 84, s: 0.74, o: 0.28, color: "#86efac" },
        { t: "//", x: 49, y: 28, s: 0.74, o: 0.28, color: "#86efac" },
      ],
      svgType: "matrix",
    },
    {
      id: "psicologia",
      href: "/simular/psicologia",
      emoji: "🧠",
      title: t("simular.psicologiaTitle"),
      tagline: t("simular.psicologiaTagline"),
      color: "#ede9fe",
      gradient: "linear-gradient(135deg,#6d28d9,#c4b5fd)",
      bg: "linear-gradient(145deg, #2e1065 0%, #4c1d95 55%, #6d28d9 100%)",
      border: "rgba(237,233,254,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "🧠", x: 70, y: 9, s: 1.7, o: 0.28 },
        { t: "💭", x: 7, y: 58, s: 1.5, o: 0.25 },
        { t: "✨", x: 77, y: 63, s: 1.3, o: 0.3 },
        { t: "🌿", x: 52, y: 80, s: 1.3, o: 0.25 },
        { t: "💫", x: 21, y: 18, s: 1.1, o: 0.22 },
      ],
    },
    {
      id: "marketing",
      href: "/simular/marketing",
      emoji: "📣",
      title: t("simular.marketingTitle"),
      tagline: t("simular.marketingTagline"),
      color: "#fce7f3",
      gradient: "linear-gradient(135deg,#9d174d,#f472b6)",
      bg: "linear-gradient(145deg, #4a044e 0%, #831843 55%, #be185d 100%)",
      border: "rgba(252,231,243,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "📱", x: 70, y: 7, s: 1.6, o: 0.28 },
        { t: "📊", x: 7, y: 63, s: 1.6, o: 0.28 },
        { t: "⭐", x: 77, y: 63, s: 1.3, o: 0.3 },
        { t: "🎯", x: 52, y: 80, s: 1.4, o: 0.25 },
        { t: "💎", x: 21, y: 16, s: 1.1, o: 0.24 },
      ],
    },
    {
      id: "administracion",
      href: "/simular/administracion",
      emoji: "📊",
      title: t("simular.administracionTitle"),
      tagline: t("simular.administracionTagline"),
      color: "#e0e7ff",
      gradient: "linear-gradient(135deg,#4338ca,#818cf8)",
      bg: "linear-gradient(145deg, #1e1b4b 0%, #3730a3 55%, #4338ca 100%)",
      border: "rgba(224,231,255,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "📊", x: 70, y: 7, s: 1.7, o: 0.28 },
        { t: "💼", x: 7, y: 63, s: 1.5, o: 0.28 },
        { t: "📈", x: 76, y: 66, s: 1.4, o: 0.25 },
        { t: "🎯", x: 52, y: 80, s: 1.3, o: 0.22 },
        { t: "💡", x: 21, y: 16, s: 1.2, o: 0.24 },
      ],
    },
    {
      id: "enfermeria",
      href: "/simular/enfermeria",
      emoji: "🩹",
      title: t("simular.enfermeriaTitle"),
      tagline: t("simular.enfermeriaTagline"),
      color: "#ccfbf1",
      gradient: "linear-gradient(135deg,#0d9488,#2dd4bf)",
      bg: "linear-gradient(145deg, #0f3d3a 0%, #0d9488 55%, #14b8a6 100%)",
      border: "rgba(204,251,241,0.4)",
      badge: t("simular.juegoReal"),
      features: [],
      decos: [
        { t: "🩹", x: 70, y: 7, s: 1.7, o: 0.28 },
        { t: "💉", x: 7, y: 63, s: 1.5, o: 0.28 },
        { t: "🏥", x: 76, y: 66, s: 1.5, o: 0.25 },
        { t: "❤️", x: 52, y: 80, s: 1.3, o: 0.25 },
        { t: "🩺", x: 21, y: 16, s: 1.2, o: 0.24 },
      ],
    },
    {
      id: "proximamente",
      href: "",
      emoji: "🔮",
      title: "Próximamente",
      tagline: "Estamos preparando nuevas simulaciones para que sigas explorando tu vocación.",
      color: "#cbd5e1",
      gradient: "linear-gradient(135deg,#475569,#94a3b8)",
      bg: "linear-gradient(145deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
      border: "rgba(203,213,225,0.2)",
      badge: "🚧 Próximamente",
      features: [],
      decos: [
        { t: "⏳", x: 70, y: 7, s: 1.7, o: 0.25 },
        { t: "✨", x: 7, y: 63, s: 1.5, o: 0.2 },
        { t: "🔧", x: 76, y: 66, s: 1.5, o: 0.22 },
        { t: "⭐", x: 52, y: 80, s: 1.3, o: 0.2 },
        { t: "💫", x: 21, y: 16, s: 1.1, o: 0.18 },
      ],
    },
  ];
}

// ─── SVG decoration layers ────────────────────────────────────

function EcgLayer() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none overflow-hidden rounded-b-3xl">
      <svg viewBox="0 0 272 64" className="w-full h-full" preserveAspectRatio="none"
        style={{ opacity: 0.14 }}>
        <path
          d="M0 48 L52 48 L66 48 L76 20 L86 62 L96 6 L106 60 L118 48 L140 48 L272 48"
          fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function GridLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      <svg width="100%" height="100%" style={{ opacity: 0.13 }}>
        <defs>
          <pattern id="bpGrid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="0" cy="0" r="1" fill="#60a5fa" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bpGrid)" />
      </svg>
    </div>
  );
}

const MATRIX_COLS = [
  { x: "14%", chars: ["f", "u", "n", "c", "(", ")"] },
  { x: "36%", chars: ["0", "1", "0", "1", "1", "0"] },
  { x: "60%", chars: ["{", "}", ";", "=", ">", ":"] },
  { x: "82%", chars: ["n", "u", "l", "l", "s", "t"] },
] as const;

function MatrixLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
      style={{ opacity: 0.1 }}>
      {MATRIX_COLS.map((col, ci) => (
        <div key={ci} className="absolute top-2 flex flex-col" style={{ left: col.x, gap: "6px" }}>
          {col.chars.map((ch, i) => (
            <span key={i} className="font-mono leading-none"
              style={{ fontSize: "0.6rem", color: "#4ade80", opacity: 0.4 + i * 0.1 }}>
              {ch}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function FlameLayer() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none rounded-b-3xl"
      style={{ background: "linear-gradient(to top, rgba(249,115,22,0.18) 0%, transparent 100%)" }}
    />
  );
}

// ─── Carousel ─────────────────────────────────────────────────
const CARD_W = 272;
const CARD_GAP = 16;

function Carousel({ cards, t }: { cards: CareerCard[]; t: (key: string, params?: Record<string, string | number>) => string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const total = cards.length;
  const canPrev = idx > 0;
  const canNext = idx < total - 1;

  const go = (dir: number) => {
    const next = Math.max(0, Math.min(total - 1, idx + dir));
    setIdx(next);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: next * (CARD_W + CARD_GAP), behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const pos = trackRef.current.scrollLeft;
    const newIdx = Math.round(pos / (CARD_W + CARD_GAP));
    setIdx(Math.max(0, Math.min(total - 1, newIdx)));
  };

  return (
    <div className="relative">
      {/* Arrows */}
      <AnimatePresence>
        {canPrev && (
          <motion.button
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
            onClick={() => go(-1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl font-black text-lg"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            ‹
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {canNext && (
          <motion.button
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
            onClick={() => go(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl font-black text-lg"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            ›
          </motion.button>
        )}
      </AnimatePresence>

      {/* Track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-4 pb-4 px-6"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {cards.map((card, i) => {
          const isPlaceholder = !card.href;
          const Tag = isPlaceholder ? motion.div : motion.a;
          const anchorProps = isPlaceholder ? {} : { href: card.href };
          return (
          <Tag
            key={card.id}
            {...anchorProps}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={isPlaceholder ? {} : { y: -6, scale: 1.02 }}
            whileTap={isPlaceholder ? {} : { scale: 0.97 }}
            className="relative shrink-0 flex flex-col overflow-hidden rounded-3xl shadow-xl"
            style={{
              width: CARD_W,
              minHeight: 300,
              background: card.bg,
              border: `1.5px solid ${card.border}`,
              scrollSnapAlign: "start",
              cursor: isPlaceholder ? "default" : "pointer",
              textDecoration: "none",
            }}
          >
            {/* Career-specific SVG layers */}
            {card.svgType === "ecg" && <EcgLayer />}
            {card.svgType === "grid" && <GridLayer />}
            {card.svgType === "matrix" && <MatrixLayer />}
            {card.svgType === "flame" && <FlameLayer />}

            {/* Emoji decorations */}
            {card.decos.map((d, di) => (
              <div key={di}
                className="absolute pointer-events-none select-none"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  fontSize: `${d.s}rem`,
                  opacity: d.o,
                  color: d.color,
                  fontFamily: d.color ? "monospace" : undefined,
                  fontWeight: d.color ? "bold" : undefined,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {d.t}
              </div>
            ))}

            {/* Highlight shimmer */}
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-3xl"
              style={{ background: "rgba(255,255,255,0.15)" }} />

            {/* Card content */}
            <div className="relative z-10 flex flex-col h-full p-5">
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full px-2.5 py-1 text-[10px] font-black text-white"
                  style={{ background: card.gradient }}>
                  {card.badge}
                </span>
              </div>

              {/* Emoji */}
              <motion.div
                className="text-6xl mb-3"
                animate={{ rotate: [0, -4, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                {card.emoji}
              </motion.div>

              {/* Title + tagline */}
              <h3 className="font-black text-lg mb-1 text-white">
                {card.title}
              </h3>
              <p className="text-xs leading-snug mb-3 flex-1 text-white/55">
                {card.tagline}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-xs font-bold mt-auto text-white/80">
                <span>{t("simular.jugarAhora")}</span>
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </div>
            </div>
          </Tag>
          );
        })}

        {/* trailing spacer */}
        <div className="shrink-0 w-4" />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3 pb-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i - idx)}
            className="rounded-full transition-all"
            style={{
              width: i === idx ? 20 : 6,
              height: 6,
              background: i === idx ? "#dc2626" : "rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────
export default function SimularPage() {
  const { t } = useTranslation();
  const careerCards = getCareerCards(t);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top left,rgba(220,38,38,0.10),transparent 30%),radial-gradient(circle at bottom right,rgba(244,63,94,0.08),transparent 30%),linear-gradient(180deg,#fff5f5 0%,#fef2f2 100%)",
      }}
    >
      <Navbar />

      {/* Hero */}
      <div className="text-center px-4 pt-8 pb-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-4 py-1.5 text-xs font-bold text-white mb-3"
        >
          {t("simular.carrerasJuegoReal", { count: careerCards.length })}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-black text-slate-900 mb-3"
        >
          {t("simular.viveCarrera")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-sm sm:text-base"
        >
          {t("simular.noEncuestas")}
        </motion.p>
      </div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="max-w-5xl mx-auto"
      >
        <Carousel cards={careerCards} t={t} />
      </motion.div>

      {/* Bottom hint */}
      <p className="text-center text-slate-400 text-xs pb-8 mt-2">
        {t("simular.deslizaCarreras")}
      </p>
    </main>
  );
}
