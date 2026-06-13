"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { careers, AREAS, type Career } from "@/lib/careers";
import Navbar from "@/components/Navbar";

function getNowActivity(dayInLife: Career["dayInLife"]) {
  const h = new Date().getHours();
  const minutes = h * 60 + new Date().getMinutes();
  const parsed = dayInLife.map((a) => {
    const [hh, mm] = a.time.replace(" am", "").replace(" pm", "").split(":").map(Number);
    const isPm = a.time.includes("pm") && hh !== 12;
    return { ...a, totalMin: (hh + (isPm ? 12 : 0)) * 60 + mm };
  });
  for (let i = parsed.length - 1; i >= 0; i--) {
    if (minutes >= parsed[i].totalMin) return parsed[i];
  }
  return parsed[0];
}

function CareerScene({ career }: { career: Career }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-2xl"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${career.color}22, ${career.color}08 70%)`,
        border: `1px solid ${career.color}30`,
        minHeight: 180,
      }}
    >
      {/* floating scene items */}
      {career.scene.map((item, i) => (
        <motion.span
          key={i}
          animate={{
            y: [0, -10 + i * 3, 0],
            rotate: [0, i % 2 === 0 ? 8 : -8, 0],
          }}
          transition={{
            duration: 3 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
          className="absolute select-none"
          style={{
            fontSize: i === 0 ? 64 : 28 + i * 2,
            left: `${10 + i * 18}%`,
            top: i % 2 === 0 ? "20%" : "45%",
            opacity: i === 0 ? 1 : 0.65,
            filter: i === 0 ? "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" : "none",
          }}
        >
          {item}
        </motion.span>
      ))}

      {/* gradient overlay bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-12"
        style={{
          background: "linear-gradient(to top, white, transparent)",
        }}
      />
    </div>
  );
}

function SalaryBar({ min, max }: { min: number; max: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(100), 300);
    return () => clearTimeout(t);
  }, [min]);

  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>S/. {min.toLocaleString()}</span>
        <span>S/. {max.toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-red-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #dc2626, #f87171)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        />
      </div>
    </div>
  );
}

function OutlookBadge({ outlook }: { outlook: Career["outlook"] }) {
  const map = {
    Alta: { color: "#16a34a", bg: "#f0fdf4", label: "Demanda Alta" },
    Media: { color: "#d97706", bg: "#fffbeb", label: "Demanda Media" },
    Estable: { color: "#0891b2", bg: "#ecfeff", label: "Mercado Estable" },
  };
  const s = map[outlook];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: s.color }}
      />
      {s.label}
    </span>
  );
}

function SimulatorPanel({
  career,
  onClose,
}: {
  career: Career;
  onClose: () => void;
}) {
  const nowActivity = getNowActivity(career.dayInLife);
  const [activeTab, setActiveTab] = useState<"dia" | "datos">("dia");

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className="flex flex-col overflow-hidden rounded-3xl border border-red-100 bg-white shadow-2xl"
      style={{ boxShadow: `0 24px 80px ${career.color}18` }}
    >
      {/* Header */}
      <div
        className="relative px-6 pt-6 pb-4"
        style={{
          background: `linear-gradient(135deg, ${career.color}18 0%, ${career.color}08 100%)`,
          borderBottom: `1px solid ${career.color}20`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow"
            style={{ background: career.color + "18" }}
          >
            {career.emoji}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{career.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ background: career.color + "18", color: career.color }}
              >
                {career.area}
              </span>
              <OutlookBadge outlook={career.outlook} />
            </div>
          </div>
        </div>

        <CareerScene career={career} />

        <p className="mt-4 text-sm leading-relaxed text-slate-600">{career.description}</p>
      </div>

      {/* Now doing */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-6 mt-4 rounded-2xl border p-4"
        style={{
          background: career.color + "08",
          borderColor: career.color + "30",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{nowActivity.emoji}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: career.color }}>
              En este momento serías...
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">{career.nowDoing}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {nowActivity.time} — {nowActivity.activity}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 mt-4 px-6 gap-1">
        {(["dia", "datos"] as const).map((tab) => {
          const labels = { dia: "📅 Día a día", datos: "📊 Datos clave" };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-3 pt-1 text-sm font-medium transition"
              style={{ color: activeTab === tab ? career.color : "#94a3b8" }}
            >
              {labels[tab]}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full"
                  style={{ background: career.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: 320 }}>
        <AnimatePresence mode="wait">
          {activeTab === "dia" && (
            <motion.div
              key="dia"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {career.dayInLife.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{
                    background: item.time === nowActivity.time ? career.color + "12" : "#f8fafc",
                    border: item.time === nowActivity.time ? `1px solid ${career.color}30` : "1px solid transparent",
                  }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">{item.time}</p>
                    <p className="text-sm font-medium text-slate-800 truncate">{item.activity}</p>
                  </div>
                  {item.time === nowActivity.time && (
                    <span
                      className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: career.color, color: "white" }}
                    >
                      AHORA
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "datos" && (
            <motion.div
              key="datos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Salario en Perú</p>
                <p className="text-2xl font-black text-slate-900 mb-2">{career.salary}</p>
                <SalaryBar min={career.salaryMin} max={career.salaryMin * 3} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Duración</p>
                <p className="text-lg font-bold text-slate-800">{career.duration}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Herramientas clave</p>
                <div className="flex flex-wrap gap-2">
                  {career.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg px-3 py-1 text-xs font-medium"
                      style={{ background: career.color + "12", color: career.color }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Habilidades clave</p>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-2 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${career.color}, ${career.color}cc)`,
            boxShadow: `0 8px 24px ${career.color}40`,
          }}
          onClick={() => (window.location.href = "/test")}
        >
          Hacer el test vocacional →
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="rounded-xl border border-red-100 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Explorar otra
        </motion.button>
      </div>
    </motion.div>
  );
}

function CareerCard({
  career,
  onClick,
  selected,
}: {
  career: Career;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <motion.button
      layout
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative w-full rounded-2xl border p-4 text-left transition-shadow"
      style={{
        background: selected ? career.color + "12" : "rgba(255,255,255,0.9)",
        borderColor: selected ? career.color + "60" : "#fee2e2",
        boxShadow: selected
          ? `0 8px 32px ${career.color}25`
          : "0 2px 8px rgba(220,38,38,0.06)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl transition-transform group-hover:scale-110"
          style={{
            background: career.lightBg,
            border: `1px solid ${career.color}20`,
          }}
        >
          {career.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-900 leading-tight">
            {career.title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">{career.area}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-red-700">{career.salary}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <OutlookBadge outlook={career.outlook} />
        <span className="text-xs text-slate-400">{career.duration}</span>
      </div>

      {selected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
          style={{ background: career.color }}
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}

export default function CarrerasPage() {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("Todos");
  const [selected, setSelected] = useState<Career | null>(null);
  const [count, setCount] = useState(0);

  // animated counter
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      if (i >= careers.length) { setCount(careers.length); clearInterval(interval); }
      else setCount(i);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const filtered = careers.filter((c) => {
    const matchArea = area === "Todos" || c.area === area;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.area.toLowerCase().includes(search.toLowerCase());
    return matchArea && matchSearch;
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.08),transparent_30%),linear-gradient(180deg,#fff5f5_0%,#fef2f2_100%)]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        {/* Hero strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-6 text-white shadow-xl"
          style={{ boxShadow: "0 20px 60px rgba(220,38,38,0.25)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">
                Simulador de Carreras 🔭
              </h2>
              <p className="mt-1 text-red-100 text-sm sm:text-base">
                Haz clic en cualquier carrera para ver cómo sería tu vida profesional hoy mismo.
              </p>
            </div>
            <div className="flex gap-4 text-center">
              {[
                { n: careers.length + "+", label: "Carreras" },
                { n: "Real", label: "Salarios reales" },
                { n: "Live", label: "Sim. en tiempo real" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
                  <p className="text-lg font-black">{s.n}</p>
                  <p className="text-[10px] text-red-100">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Area filter pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {AREAS.map((a) => (
            <motion.button
              key={a}
              whileTap={{ scale: 0.95 }}
              onClick={() => setArea(a)}
              className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition"
              style={
                area === a
                  ? {
                      background: "linear-gradient(135deg, #dc2626, #f87171)",
                      color: "white",
                      boxShadow: "0 4px 16px rgba(220,38,38,0.3)",
                    }
                  : {
                      background: "rgba(255,255,255,0.8)",
                      color: "#64748b",
                      border: "1px solid #fee2e2",
                    }
              }
            >
              {a}
            </motion.button>
          ))}
        </div>

        {/* Main layout */}
        <div className={`grid gap-6 ${selected ? "lg:grid-cols-[1fr_420px]" : "grid-cols-1"}`}>
          {/* Career grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <span className="text-5xl mb-3">🔍</span>
                <p className="text-lg font-semibold">No encontramos esa carrera</p>
                <p className="text-sm mt-1">Intenta con otro término</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence>
                  {filtered.map((career) => (
                    <motion.div
                      key={career.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CareerCard
                        career={career}
                        selected={selected?.id === career.id}
                        onClick={() =>
                          setSelected(selected?.id === career.id ? null : career)
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Simulator panel */}
          <AnimatePresence>
            {selected && (
              <div className="lg:sticky lg:top-20 lg:self-start">
                <SimulatorPanel
                  career={selected}
                  onClose={() => setSelected(null)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* No career selected CTA */}
        <AnimatePresence>
          {!selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center text-slate-400"
            >
              <p className="text-sm">
                👆 Haz clic en cualquier carrera para activar el simulador
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
