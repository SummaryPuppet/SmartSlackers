"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { careers } from "@/lib/careers";

const LEVELS = [
  { key: "basico", label: "Básico", color: "#f87171", pct: 25 },
  { key: "intermedio", label: "Intermedio", color: "#fbbf24", pct: 50 },
  { key: "avanzado", label: "Avanzado", color: "#60a5fa", pct: 75 },
  { key: "experto", label: "Experto", color: "#4ade80", pct: 100 },
] as const;

type SkillLevel = (typeof LEVELS)[number]["key"];

type UserSkills = Record<string, { level: SkillLevel; lastUpdated?: unknown }>;

export default function SkillAssessment({
  userId,
  careerId,
}: {
  userId: string;
  careerId: string;
}) {
  const career = careers.find((c) => c.id === careerId);
  const [userSkills, setUserSkills] = useState<UserSkills>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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

  const handleLevelChange = async (skillName: string, level: SkillLevel) => {
    const updated = {
      ...userSkills,
      [skillName]: { level, lastUpdated: new Date().toISOString() },
    };
    setUserSkills(updated);
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(
        doc(db, "UserSkills", userId),
        { skills: updated, lastAnalysis: serverTimestamp() },
        { merge: true }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* silent */ }
    setSaving(false);
  };

  if (!career) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        Primero selecciona una carrera de interés para evaluar tus skills.
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
      </div>
    );
  }

  const totalSkills = career.skillRequirements.length;
  const assessedSkills = career.skillRequirements.filter((r) => userSkills[r.name]?.level).length;
  const progress = totalSkills > 0 ? Math.round((assessedSkills / totalSkills) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
            Mis skills — {career.emoji} {career.title}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Evalúa tu nivel actual en cada habilidad requerida
          </p>
        </div>
        {saved && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-medium text-green-600"
          >
            ✓ Guardado
          </motion.span>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Progreso de evaluación</span>
          <span className="font-bold text-slate-700">{assessedSkills}/{totalSkills}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Skills list */}
      <div className="space-y-3">
        {career.skillRequirements.map((req, i) => {
          const current = userSkills[req.name]?.level as SkillLevel | undefined;
          const isMet = current && LEVELS.findIndex(l => l.key === current) >= LEVELS.findIndex(l => l.key === req.requiredLevel);
          return (
            <motion.div
              key={req.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-800">{req.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">
                    {req.category === "tecnica" ? "🔧" : req.category === "blanda" ? "🤝" : "📚"}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    Meta: {req.requiredLevel}
                  </span>
                  {isMet && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      ✓
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.key}
                    onClick={() => handleLevelChange(req.name, lvl.key)}
                    disabled={saving}
                    className={`flex-1 rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                      current === lvl.key
                        ? "text-white shadow-md scale-105"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                    style={
                      current === lvl.key
                        ? { background: lvl.color }
                        : undefined
                    }
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
