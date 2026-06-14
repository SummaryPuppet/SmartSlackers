"use client";

import Navbar from "@/components/Navbar";
import { AREAS, careers as staticCareers, type Career } from "@/lib/careers";
import { apiFetch } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { trackBadgeEvent, showBadgeNotification } from "@/src/services/badgeService";

function getNowActivity(dayInLife: Career["dayInLife"]) {
  const h = new Date().getHours();
  const minutes = h * 60 + new Date().getMinutes();
  const parsed = dayInLife.map((a) => {
    const [hh, mm] = a.time
      .replace(" am", "")
      .replace(" pm", "")
      .split(":")
      .map(Number);
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
            filter:
              i === 0 ? "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" : "none",
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

function OutlookBadge({ outlook, t }: { outlook: Career["outlook"]; t: (key: string) => string }) {
  const map = {
    Alta: { color: "#16a34a", bg: "#f0fdf4", label: t("carreras.demandaAlta") },
    Media: { color: "#d97706", bg: "#fffbeb", label: t("carreras.demandaMedia") },
    Estable: { color: "#0891b2", bg: "#ecfeff", label: t("carreras.mercadoEstable") },
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

type TopPost = { userName: string; text: string; likeCount: number };

function TopReview({ careerId, careerColor, t }: { careerId: string; careerColor: string; t: (key: string) => string }) {
  const [post, setPost]     = useState<TopPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    setLoading(true);
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "Posts"), where("career", "==", careerId), limit(20)),
        );
        if (cancelled) return;
        const list = snap.docs.map((d) => d.data() as TopPost);
        list.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
        setPost(list[0] ?? null);
      } catch {
        if (!cancelled) setPost(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [careerId]);

  if (loading) {
    return (
      <div className="mx-6 mb-4 rounded-2xl border border-slate-100 p-4 animate-pulse">
        <div className="h-2.5 w-32 rounded-full bg-slate-100 mb-3" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-slate-100" />
          <div className="h-3 w-4/5 rounded-full bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  const preview = post.text.length > 140 ? post.text.slice(0, 140).trimEnd() + "…" : post.text;

  return (
    <div className="mx-6 mb-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: careerColor }}>
            ⭐ {t("carreras.resenaDestacada")}
          </span>
        </div>
        <a
          href={`/comunidad?career=${careerId}`}
          className="text-[11px] font-semibold transition-colors hover:underline"
          style={{ color: careerColor }}
        >
          {t("carreras.verMasResenas")}
        </a>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-4"
        style={{ background: careerColor + "0d", border: `1px solid ${careerColor}25` }}
      >
        {/* Quote */}
        <span className="text-2xl leading-none" style={{ color: careerColor + "55" }}>"</span>
        <p className="text-sm text-slate-700 leading-relaxed -mt-1 mb-3">{preview}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: `linear-gradient(135deg,${careerColor},${careerColor}99)` }}
            >
              {post.userName?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <span className="text-xs font-semibold text-slate-600">{post.userName}</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            ❤️ {post.likeCount ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function SimulatorPanel({
  career,
  onClose,
  t,
}: {
  career: Career;
  onClose: () => void;
  t: (key: string) => string;
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
            <h2 className="text-xl font-black text-slate-900">
              {career.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ background: career.color + "18", color: career.color }}
              >
                {career.area}
              </span>
              <OutlookBadge outlook={career.outlook} t={t} />
            </div>
          </div>
        </div>

        <CareerScene career={career} />

        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          {career.description}
        </p>
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
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: career.color }}
            >
              {t("carreras.enEsteMomento")}
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">
              {career.nowDoing}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {nowActivity.time} — {nowActivity.activity}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 mt-4 px-6 gap-1">
        {(["dia", "datos"] as const).map((tab) => {
          const labels = { dia: t("carreras.diaADia"), datos: t("carreras.datosClave") };
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
      <div
        className="flex-1 overflow-y-auto px-6 py-4"
        style={{ maxHeight: 320 }}
      >
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
                    background:
                      item.time === nowActivity.time
                        ? career.color + "12"
                        : "#f8fafc",
                    border:
                      item.time === nowActivity.time
                        ? `1px solid ${career.color}30`
                        : "1px solid transparent",
                  }}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">{item.time}</p>
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.activity}
                    </p>
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
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  {t("carreras.salarioPeru")}
                </p>
                <p className="text-2xl font-black text-slate-900 mb-2">
                  {career.salary}
                </p>
                <SalaryBar min={career.salaryMin} max={career.salaryMin * 3} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  {t("carreras.duracion")}
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {career.duration}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  {t("carreras.herramientasClave")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {career.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg px-3 py-1 text-xs font-medium"
                      style={{
                        background: career.color + "12",
                        color: career.color,
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  {t("carreras.habilidadesClave")}
                </p>
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

      {/* Top community review */}
      <TopReview careerId={career.id} careerColor={career.color} t={t} />

      {/* CTA */}
      <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
        <div className="flex gap-3">
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
            {t("carreras.hacerTest")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="rounded-xl border border-red-100 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {t("carreras.explorarOtra")}
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}

function CareerCard({
  career,
  onClick,
  selected,
  compareSelected,
  compareMode,
  compareIndex,
  t,
}: {
  career: Career;
  onClick: () => void;
  selected: boolean;
  compareSelected?: boolean;
  compareMode?: boolean;
  compareIndex?: number;
  t: (key: string) => string;
}) {
  return (
    <motion.button
      layout
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative w-full rounded-2xl border p-4 text-left transition-shadow"
      style={{
        background: compareSelected ? career.color + "18" : selected ? career.color + "12" : "rgba(255,255,255,0.9)",
        borderColor: compareSelected ? career.color : selected ? career.color + "60" : "#fee2e2",
        boxShadow: compareSelected
          ? `0 8px 32px ${career.color}30`
          : selected
          ? `0 8px 32px ${career.color}25`
          : "0 2px 8px rgba(220,38,38,0.06)",
        borderWidth: compareSelected ? 2 : 1,
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
            <span className="text-xs font-semibold text-red-700">
              {career.salary}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <OutlookBadge outlook={career.outlook} t={t} />
        <span className="text-xs text-slate-400">{career.duration}</span>
      </div>

      {selected && !compareMode && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
          style={{ background: career.color }}
        >
          ✓
        </motion.div>
      )}
      {compareSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
          style={{ background: career.color }}
        >
          {compareIndex !== undefined ? compareIndex + 1 : ""}
        </motion.div>
      )}
    </motion.button>
  );
}

function ComparePanel({
  careers,
  onClose,
  t,
}: {
  careers: Career[];
  onClose: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const maxSalary = Math.max(...careers.map((c) => c.salaryMin));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className="rounded-3xl border border-red-100 bg-white shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 px-6 py-5 text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white shadow-sm transition hover:bg-white/30"
        >
          ✕
        </button>
        <h2 className="text-xl font-black">{t("carreras.compararCarreras")}</h2>
        <p className="text-red-100 text-sm mt-1">{t("carreras.carrerasSeleccionadas", { count: careers.length })}</p>
      </div>

      {/* Careers stacked vertically — each career is a full-width card */}
      <div className="divide-y divide-slate-100">
        {careers.map((c) => {
          const now = getNowActivity(c.dayInLife);
          return (
            <div key={c.id} className="p-5 transition hover:bg-slate-50/50">
              {/* Career header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-2xl transition-transform hover:scale-110"
                  style={{ background: c.color + "15" }}
                >
                  {c.emoji}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ background: c.color + "15", color: c.color }}
                  >
                    {c.area}
                  </span>
                </div>
              </div>

              {/* Data rows for this career */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Salary */}
                <div className="rounded-xl bg-slate-50 p-3 transition hover:shadow-md hover:-translate-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{t("carreras.salario")}</p>
                  <p className="text-sm font-black text-slate-900">{c.salary}</p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-red-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.salaryMin / maxSalary) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}99)` }}
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="rounded-xl bg-slate-50 p-3 transition hover:shadow-md hover:-translate-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{t("carreras.duracion")}</p>
                  <p className="text-sm font-bold text-slate-800">{c.duration}</p>
                </div>

                {/* Outlook */}
                <div className="rounded-xl bg-slate-50 p-3 transition hover:shadow-md hover:-translate-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{t("carreras.demanda")}</p>
                  <OutlookBadge outlook={c.outlook} t={t} />
                </div>

                {/* Skills */}
                <div className="rounded-xl bg-slate-50 p-3 col-span-2 sm:col-span-3 lg:col-span-2 transition hover:shadow-md hover:-translate-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">{t("carreras.habilidades")}</p>
                  <div className="flex flex-wrap gap-1">
                    {c.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md px-2 py-0.5 text-[10px] font-medium transition hover:scale-105 cursor-default"
                        style={{ background: c.color + "12", color: c.color }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div className="rounded-xl bg-slate-50 p-3 col-span-2 sm:col-span-3 transition hover:shadow-md hover:-translate-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">{t("carreras.herramientas")}</p>
                  <div className="flex flex-wrap gap-1">
                    {c.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-200/60 px-2 py-0.5 text-[10px] font-medium text-slate-700 transition hover:bg-slate-200 hover:scale-105 cursor-default"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Day in life */}
              <div className="mt-3 rounded-xl border p-3 transition hover:shadow-md" style={{ borderColor: c.color + "25", background: c.color + "05" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: c.color }}>{t("carreras.diaADia")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                  {c.dayInLife.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] transition hover:bg-white/60 cursor-default"
                      style={{
                        background: item.time === now.time ? c.color + "18" : "transparent",
                        fontWeight: item.time === now.time ? 600 : 400,
                        border: item.time === now.time ? `1px solid ${c.color}30` : "1px solid transparent",
                      }}
                    >
                      <span>{item.emoji}</span>
                      <span className="text-slate-400 w-14 flex-shrink-0">{item.time}</span>
                      <span className="text-slate-700 truncate">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function CarrerasPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("Todos");
  const [selected, setSelected] = useState<Career | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<Career[]>([]);
  const [showComparePanel, setShowComparePanel] = useState(false);
  const [count, setCount] = useState(0);
  const [careersList, setCareersList] = useState<Career[]>(staticCareers);

  // Badge: track career exploration
  const handleCareerSelect = useCallback((career: Career | null) => {
    setSelected(career);
    if (career) {
      // Track unique career exploration using localStorage
      try {
        const explored = JSON.parse(localStorage.getItem("exploredCareers") || "[]") as string[];
        if (!explored.includes(career.id)) {
          explored.push(career.id);
          localStorage.setItem("exploredCareers", JSON.stringify(explored));
          // Send to backend
          onAuthStateChanged(auth, (user) => {
            if (user) {
              trackBadgeEvent(user.uid, "career_explored").then(({ newBadges }) => {
                newBadges.forEach((b) => showBadgeNotification(b));
              }).catch(() => {});
            }
          });
        }
      } catch { /* silent */ }
    }
  }, []);

  const handleCompareToggle = useCallback((career: Career) => {
    setCompareList((prev) => {
      const exists = prev.find((c) => c.id === career.id);
      if (exists) return prev.filter((c) => c.id !== career.id);
      if (prev.length >= 3) return prev;
      return [...prev, career];
    });
  }, []);

  // Fetch careers from backend API (Firestore-backed)
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await apiFetch(`/api/v2/careers`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (data.careers && data.careers.length > 0) {
          setCareersList(data.careers);
        }
      } catch {
        // Keep static fallback data
      }
    };
    fetchCareers();
  }, []);

  // animated counter
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      if (i >= careersList.length) {
        setCount(careersList.length);
        clearInterval(interval);
      } else setCount(i);
    }, 30);
    return () => clearInterval(interval);
  }, [careersList.length]);

  const filtered = careersList.filter((c) => {
    if (!c.title || !c.area) return false;
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
                {t("carreras.heroTitle")}
              </h2>
              <p className="mt-1 text-red-100 text-sm sm:text-base">
                {t("carreras.heroDesc")}
              </p>
            </div>
            <div className="flex gap-4 text-center">
              {[
                { n: careersList.length + "+", label: t("carreras.carrerasCount") },
                { n: "Real", label: t("carreras.salariosReales") },
                { n: "Live", label: t("carreras.simTiempoReal") },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm"
                >
                  <p className="text-lg font-black">{s.n}</p>
                  <p className="text-[10px] text-red-100">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Area filter pills + Compare toggle */}
        <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 flex-1">
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
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCompareMode((v) => !v);
              setCompareList([]);
              setShowComparePanel(false);
              setSelected(null);
            }}
            className="flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all"
            style={
              compareMode
                ? {
                    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    color: "white",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                  }
                : {
                    background: "rgba(255,255,255,0.8)",
                    color: "#7c3aed",
                    border: "1px solid #ede9fe",
                  }
            }
          >
            ⚡ {t("carreras.comparar")}
          </motion.button>
        </div>

        {/* Main layout */}
        <div
          className={`grid gap-6 ${selected && !compareMode && !showComparePanel ? "lg:grid-cols-[1fr_420px]" : "grid-cols-1"}`}
        >
          {/* Career grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <span className="text-5xl mb-3">🔍</span>
                <p className="text-lg font-semibold">
                  {t("carreras.noEncontramos")}
                </p>
                <p className="text-sm mt-1">{t("carreras.intentOtroTermino")}</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence>
                  {filtered.map((career) => {
                    const compareIdx = compareList.findIndex((c) => c.id === career.id);
                    return (
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
                          compareSelected={compareIdx !== -1}
                          compareMode={compareMode}
                          compareIndex={compareIdx !== -1 ? compareIdx : undefined}
                          t={t}
                          onClick={() => {
                            if (compareMode) {
                              handleCompareToggle(career);
                            } else {
                              handleCareerSelect(
                                selected?.id === career.id ? null : career,
                              );
                            }
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Simulator panel (single select) */}
          <AnimatePresence>
            {selected && !compareMode && !showComparePanel && (
              <div className="lg:sticky lg:top-20 lg:self-start">
                <SimulatorPanel
                  career={selected}
                  onClose={() => setSelected(null)}
                  t={t}
                />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Compare panel — full width modal */}
        <AnimatePresence>
          {showComparePanel && compareList.length >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-10 px-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowComparePanel(false);
                  setCompareList([]);
                  setCompareMode(false);
                }
              }}
            >
              <div className="w-full max-w-5xl">
                <ComparePanel
                  careers={compareList}
                  onClose={() => {
                    setShowComparePanel(false);
                    setCompareList([]);
                    setCompareMode(false);
                  }}
                  t={t}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating compare bar */}
        <AnimatePresence>
          {compareMode && compareList.length > 0 && !showComparePanel && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-2xl"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {compareList.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                      style={{ background: c.color + "15", border: `1px solid ${c.color}30` }}
                    >
                      {c.emoji}
                    </motion.div>
                  ))}
                  {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-300"
                    >
                      +
                    </div>
                  ))}
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <p className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                  {t("carreras.seleccionadas", { count: compareList.length })}
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={compareList.length < 2}
                  onClick={() => setShowComparePanel(true)}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: compareList.length >= 2
                      ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                      : "#94a3b8",
                    boxShadow: compareList.length >= 2 ? "0 4px 16px rgba(124,58,237,0.3)" : "none",
                  }}
                >
                  {t("carreras.compararBtn")}
                </motion.button>

                <button
                  onClick={() => {
                    setCompareList([]);
                    setCompareMode(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 transition text-sm"
                >
                  {t("carreras.limpiar")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No career selected CTA */}
        <AnimatePresence>
          {!selected && !compareMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center text-slate-400"
            >
              <p className="text-sm">
                {t("carreras.hazClicActivar")}
              </p>
            </motion.div>
          )}
          {compareMode && compareList.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center text-slate-400"
            >
              <p className="text-sm">
                {t("carreras.seleccionaComparar")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
