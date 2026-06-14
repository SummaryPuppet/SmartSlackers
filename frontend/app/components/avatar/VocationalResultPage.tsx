"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
<<<<<<< Updated upstream
import { auth } from "@/src/firebase/config";
import AvatarSVG from "@/app/components/avatar/AvatarSVG";
import AvatarCustomizer from "@/app/components/avatar/AvatarCustomizer";
import { AvatarConfig, Career, CareerCosmetic } from "@/types/avatar";
=======
import { auth } from "@/lib/firebase"; // adjust to your firebase init path
import AvatarSVG from "@/components/avatar/AvatarSVG";
import AvatarCustomizer from "@/components/avatar/AvatarCustomizer";
import type { AvatarConfig, Career } from "@/types/avatar";
>>>>>>> Stashed changes
import { CAREER_COSMETICS } from "@/lib/careerCosmetics";
import { saveAvatar, loadAvatar } from "@/src/services/avatarService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DEFAULT_CONFIG: AvatarConfig = {
  skinTone: "medium-light",
  hairStyle: "medium",
  hairColor: "black",
  eyeColor: "brown",
  outfitBase: "casual",
  background: "sky",
  careerCosmetic: undefined,
};

type Phase = "customize" | "reveal" | "result";

interface VocationalResultPageProps {
  /** Pass the career result from the test. If null, shows only customizer. */
  careerResult?: Career | null;
}

export default function VocationalResultPage({ careerResult = null }: VocationalResultPageProps) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<Phase>(careerResult ? "reveal" : "customize");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  const cosmetic = careerResult ? CAREER_COSMETICS[careerResult] : null;

  // Load existing avatar from Firestore on mount
  useEffect(() => {
    if (!user) { setLoadingAvatar(false); return; }
    loadAvatar(user.uid).then((saved) => {
      if (saved) setConfig(saved.config);
      setLoadingAvatar(false);
    });
  }, [user]);

  // Auto-apply cosmetic when careerResult is set
  useEffect(() => {
    if (!careerResult) return;
    const cosmetic = CAREER_COSMETICS[careerResult];
    setConfig((prev) => ({
      ...prev,
      unlockedCareers: Array.from(new Set([...(prev.unlockedCareers ?? []), careerResult])),
      background: cosmetic.background,
      careerCosmetic: cosmetic,
    }));
  }, [careerResult]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveAvatar(user.uid, config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }, [user, config, careerResult]);

  const handleRevealDone = () => setPhase("result");

  if (loadingAvatar) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-semibold text-gray-900 dark:text-white mb-2"
          >
            {phase === "customize" && "Crea tu avatar"}
            {phase === "reveal" && "¡Tu resultado está listo!"}
            {phase === "result" && "Tu avatar vocacional"}
          </motion.h1>
          {phase === "customize" && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Personaliza cómo te ves. Al terminar el test, recibirás un cosmético especial.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Avatar display */}
          <div className="flex flex-col items-center gap-4">
            <AnimatePresence mode="wait">
              {phase === "reveal" ? (
                <RevealAnimation
                  key="reveal"
                  config={config}
                  cosmetic={cosmetic}
                  onDone={handleRevealDone}
                />
              ) : (
                <motion.div
                  key="avatar"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-2xl overflow-hidden shadow-xl border border-white/60"
                >
                  <AvatarSVG config={config} size={280} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Career badge */}
            {phase === "result" && cosmetic && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-2"
              >
                <Badge
                  className="text-sm px-4 py-1.5 rounded-full font-semibold"
                  style={{ backgroundColor: cosmetic.accentColor, color: "#fff", border: "none" }}
                >
                  {cosmetic.badge} {cosmetic.label}
                </Badge>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 max-w-[220px]">
                  {cosmetic.description}
                </p>
              </motion.div>
            )}

            {/* Save button */}
            {user && phase !== "reveal" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl px-6"
                  style={{ backgroundColor: cosmetic?.accentColor ?? "#7F77DD" }}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Guardando…
                    </span>
                  ) : saved ? (
                    "✓ Guardado"
                  ) : (
                    "Guardar avatar"
                  )}
                </Button>
              </motion.div>
            )}

            {!user && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Inicia sesión para guardar tu avatar
              </p>
            )}
          </div>

          {/* Customizer panel */}
          {phase !== "reveal" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
                Personalizar
              </h2>
              <AvatarCustomizer
                config={config}
                onChange={setConfig}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Reveal Animation ──────────────────────────────── */

function RevealAnimation({
  config,
  cosmetic,
  onDone,
}: {
  config: AvatarConfig;
  cosmetic: CareerCosmetic | null;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 2800),
      setTimeout(onDone, 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={step >= 2 ? { rotate: [0, -5, 5, -3, 3, 0] } : {}}
        transition={{ duration: 0.6 }}
        className="rounded-2xl overflow-hidden shadow-xl border border-white/60"
      >
        <AvatarSVG config={config} size={280} />
      </motion.div>

      <AnimatePresence>
        {step === 0 && (
          <motion.p
            key="s0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-gray-500 text-sm"
          >
            Analizando tu perfil vocacional…
          </motion.p>
        )}
        {step === 1 && (
          <motion.p
            key="s1"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            ¡Encontramos tu carrera ideal!
          </motion.p>
        )}
        {step >= 2 && cosmetic && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
              {cosmetic.badge} {cosmetic.label}
            </p>
            <p className="text-xs text-gray-400 mt-1">{cosmetic.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            animate={{ backgroundColor: step > i ? (cosmetic?.accentColor ?? "#7F77DD") : "#D3D1C7" }}
          />
        ))}
      </div>
    </div>
  );
}
