"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { careers, type SkillRequirement } from "@/lib/careers";
import Link from "next/link";

const LEVEL_PCT: Record<string, number> = {
  basico: 25,
  intermedio: 50,
  avanzado: 75,
  experto: 100,
};

const LEVEL_COLORS: Record<string, string> = {
  basico: "#f87171",
  intermedio: "#fbbf24",
  avanzado: "#60a5fa",
  experto: "#4ade80",
};

const CATEGORY_LABELS: Record<string, string> = {
  tecnica: "🔧 Técnica",
  blanda: "🤝 Blanda",
  academica: "📚 Académica",
};

type UserSkills = Record<string, { level: string }>;

export default function SkillGapDashboard({
  userId,
  careerId,
}: {
  userId: string;
  careerId: string;
}) {
  const career = careers.find((c) => c.id === careerId);
  const [userSkills, setUserSkills] = useState<UserSkills>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "UserSkills", userId));
        if (snap.exists()) {
          setUserSkills((snap.data().skills as UserSkills) || {});
        }
      } catch { /* silent */ }
      setLoaded(true);
    };
    load();
  }, [userId]);

  if (!career) return null;

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
      </div>
    );
  }

  const skillReqs = career.skillRequirements || [];

  const skillGaps = skillReqs.map((req: SkillRequirement) => {
    const userLevel = userSkills[req.name]?.level || "";
    const userPct = LEVEL_PCT[userLevel] || 0;
    const requiredPct = LEVEL_PCT[req.requiredLevel] || 50;
    const gap = requiredPct - userPct;
    const pctCovered = requiredPct > 0 ? Math.min(Math.round((userPct / requiredPct) * 100), 100) : 0;
    const status = pctCovered >= 100 ? "covered" : pctCovered >= 50 ? "warning" : "critical";
    return { ...req, userLevel, userPct, requiredPct, gap, pctCovered, status };
  });

  const coveredCount = skillGaps.filter((s) => s.status === "covered").length;
  const warningCount = skillGaps.filter((s) => s.status === "warning").length;
  const criticalCount = skillGaps.filter((s) => s.status === "critical").length;
  const totalSkills = skillGaps.length;
  const overallPct = totalSkills > 0 ? Math.round(skillGaps.reduce((a, s) => a + s.pctCovered, 0) / totalSkills) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
            Análisis de Brechas — {career.emoji} {career.title}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Niveles requeridos para <span className="font-semibold text-slate-700">empezar</span> esta carrera
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: overallPct >= 70 ? "#4ade80" : overallPct >= 40 ? "#fbbf24" : "#f87171" }}>
            {overallPct}%
          </p>
          <p className="text-[10px] text-slate-500 uppercase">preparación</p>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl bg-green-50 border border-green-200 p-3 text-center">
          <p className="text-lg font-bold text-green-700">{coveredCount}</p>
          <p className="text-[10px] text-green-600 uppercase">Listas</p>
        </div>
        <div className="flex-1 rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-center">
          <p className="text-lg font-bold text-yellow-700">{warningCount}</p>
          <p className="text-[10px] text-yellow-600 uppercase">En progreso</p>
        </div>
        <div className="flex-1 rounded-xl bg-red-50 border border-red-200 p-3 text-center">
          <p className="text-lg font-bold text-red-700">{criticalCount}</p>
          <p className="text-[10px] text-red-600 uppercase">Por empezar</p>
        </div>
      </div>

      {/* Skills comparison */}
      <div className="space-y-3">
        {skillGaps.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-slate-800">{skill.name}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  skill.status === "covered"
                    ? "bg-green-100 text-green-700"
                    : skill.status === "warning"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {skill.status === "covered" ? "Lista" : skill.status === "warning" ? "En progreso" : "Por empezar"}
              </span>
            </div>

            {/* Category tag */}
            <p className="text-[10px] text-slate-400 mb-2">
              {CATEGORY_LABELS[skill.category] || skill.category}
            </p>

            {/* Required vs actual bars */}
            <div className="space-y-1.5">
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                  <span>Requerido para empezar</span>
                  <span className="font-medium">{skill.requiredLevel}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-400"
                    style={{ width: `${skill.requiredPct}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                  <span>Tu nivel actual</span>
                  <span className="font-medium">{skill.userLevel || "Sin evaluar"}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: skill.userLevel
                        ? LEVEL_COLORS[skill.userLevel]
                        : "#cbd5e1",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.userPct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  />
                </div>
              </div>
            </div>

            {/* Gap indicator */}
            {skill.gap > 0 && (
              <p className="mt-2 text-[10px] text-slate-500">
                Necesitas subir{" "}
                <span className="font-bold text-red-600">
                  {skill.gap}%
                </span>{" "}
                para alcanzar el nivel <span className="font-semibold">{skill.requiredLevel}</span>
              </p>
            )}
            {skill.status === "covered" && (
              <p className="mt-2 text-[10px] text-green-600 font-medium">
                ✓ Tienes el nivel requerido para empezar
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Roadmap link */}
      <Link
        href={`/roadmap?career=${careerId}`}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:from-red-700 hover:to-rose-600"
      >
        🗺️ Ver mi roadmap para llegar preparado
      </Link>
    </div>
  );
}
