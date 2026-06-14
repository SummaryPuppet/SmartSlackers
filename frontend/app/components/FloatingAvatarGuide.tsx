"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { loadAvatar } from "@/src/services/avatarService";
import {
  loadTutorialProgress,
  markTutorialStep,
  syncProgressToLocalStorage,
  clearTutorialLocalStorage,
} from "@/src/services/tutorialService";
import AvatarSVG from "./avatar/AvatarSVG";
import DinosaurSVG from "./avatar/DinosaurSVG";
import type { AvatarConfig } from "@/types/avatar";

const DEFAULT_CFG: AvatarConfig = {
  skinTone: "medium-light",
  hairStyle: "medium",
  hairColor: "black",
  eyeColor: "brown",
  outfitBase: "casual",
  background: "sky",
  unlockedCareers: [],
  avatarType: "dino",
};

const PAGE_TIPS: Record<string, { title: string; tip: string }> = {
  "/":             { title: "¡Bienvenido a Vocatio!", tip: "Empieza con el test vocacional para descubrir qué carrera es ideal para ti." },
  "/test":         { title: "Test vocacional",         tip: "Responde con sinceridad. Solo toma 5 minutos y el resultado se guarda en tu perfil." },
  "/perfil":       { title: "Tu perfil",               tip: "Aquí ves tu historial, tu avatar y el círculo de estadísticas de carrera." },
  "/mentor":       { title: "Mentor IA",               tip: "Practica entrevistas reales. Cuantas más veces practiques, mejor será tu desempeño." },
  "/comunidad":    { title: "Comunidad",               tip: "Comparte tus dudas y conecta con estudiantes que están en el mismo camino." },
  "/carreras":     { title: "Carreras",                tip: "Compara todas las carreras disponibles y descubre cuál se adapta mejor a ti." },
  "/roadmap":      { title: "Roadmap",                 tip: "Este es tu plan de estudios personalizado. Sigue los pasos para llegar a tu meta." },
  "/laboratorios": { title: "Laboratorios",            tip: "Conoce las instalaciones y laboratorios disponibles para tu carrera." },
  "/recursos":     { title: "Recursos",                tip: "Guías de admisión, planificación y herramientas para tu proceso vocacional." },
  "/simular":      { title: "Simular carrera",         tip: "Vive un día en diferentes profesiones con actividades interactivas." },
  "/avatar-test":  { title: "Tu avatar",               tip: "Personaliza tu avatar y desbloquea cosméticos al completar tests." },
};

const PAGE_SPEECH: Record<string, string> = {
  "/":             "¡Ven, practica el test vocacional y descubre tu carrera ideal! 🎯",
  "/test":         "¡Responde con sinceridad, cada respuesta define tu perfil! 💪",
  "/mentor":       "¡Practica entrevistas con el Mentor IA y mejora tu desempeño! 🤖",
  "/comunidad":    "¡Únete a la comunidad y conecta con estudiantes como tú! 💬",
  "/carreras":     "¡Explora todas las carreras y descubre cuál es para ti! 🔍",
  "/perfil":       "¡Aquí están tus estadísticas vocacionales y tu avatar! 🎨",
  "/roadmap":      "¡Tu plan de estudios personalizado te espera aquí! 📚",
  "/avatar-test":  "¡Personaliza tu avatar y desbloquea trajes completando el test! 🦕",
  "/laboratorios": "¡Conoce los laboratorios disponibles para tu carrera! 🔬",
  "/recursos":     "¡Aquí hay guías y herramientas para tu proceso vocacional! 📋",
  "/simular":      "¡Vive un día como profesional en distintas carreras! 🎭",
};

const STEPS = [
  { key: "test"      as const, label: "Completa el test vocacional", href: "/test",        icon: "🎯" },
  { key: "avatar"    as const, label: "Personaliza tu avatar",       href: "/avatar-test", icon: "🎨" },
  { key: "careers"   as const, label: "Explora las carreras",        href: "/carreras",    icon: "🔍" },
  { key: "mentor"    as const, label: "Practica con el Mentor IA",   href: "/mentor",      icon: "🤖" },
  { key: "community" as const, label: "Únete a la comunidad",        href: "/comunidad",   icon: "💬" },
];

export default function FloatingAvatarGuide() {
  const pathname = usePathname();

  const [open, setOpen]               = useState(false);
  const [uid, setUid]                 = useState<string | null | undefined>(undefined); // undefined = cargando
  const [cfg, setCfg]                 = useState<AvatarConfig | null>(null);
  const [steps, setSteps]             = useState<Record<string, boolean>>({});
  const [bubble, setBubble]           = useState<string | null>(null);

  const prevUidRef    = useRef<string | null | undefined>(undefined);
  const bubbleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedForUid  = useRef<string | null>(null);

  // ── Auth listener ────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid ?? null));
    return () => unsub();
  }, []);

  // ── Al cambiar uid: limpiar localStorage del usuario anterior y
  //    cargar progreso + avatar desde Firestore ─────────────────────
  useEffect(() => {
    if (uid === undefined) return; // aún cargando

    const prevUid = prevUidRef.current;
    prevUidRef.current = uid;

    // Si el usuario cambió (logout o switch), limpiar localStorage
    if (prevUid !== undefined && prevUid !== uid) {
      clearTutorialLocalStorage();
      setCfg(null);
      setSteps({});
      loadedForUid.current = null;
    }

    if (!uid) return; // invitado — no cargar nada de Firestore

    if (loadedForUid.current === uid) return; // ya cargamos para este uid
    loadedForUid.current = uid;

    // Cargar progreso del tutorial desde Firestore
    loadTutorialProgress(uid).then((progress) => {
      syncProgressToLocalStorage(progress);
      const map: Record<string, boolean> = {};
      STEPS.forEach((s) => { map[s.key] = progress[s.key]; });
      setSteps(map);
    });

    // Cargar config del avatar
    loadAvatar(uid)
      .then((saved) => { if (saved) setCfg(saved.config); })
      .catch(() => {});
  }, [uid]);

  // ── Seguimiento de visitas a páginas → completar pasos ───────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Mapa: pathname → step key para completar por visita
    const pageStepMap: Record<string, "mentor" | "community" | "careers" | "avatar"> = {
      "/mentor":    "mentor",
      "/comunidad": "community",
      "/carreras":  "careers",
    };
    if (pathname?.startsWith("/avatar")) pageStepMap[pathname] = "avatar";

    const matchedStep = Object.entries(pageStepMap).find(
      ([p]) => pathname === p || pathname?.startsWith(p)
    )?.[1];

    if (matchedStep) {
      localStorage.setItem(`vocatio_step_${matchedStep}`, "1");
      setSteps((prev) => ({ ...prev, [matchedStep]: true }));
      if (uid) markTutorialStep(uid, matchedStep);
    }

    // Burbuja de voz — aparece 0.8s después del cambio de ruta
    const msg = PAGE_SPEECH[pathname ?? ""] ?? null;
    if (!msg) return;
    const show = setTimeout(() => {
      setBubble(msg);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setBubble(null), 5000);
    }, 800);
    return () => {
      clearTimeout(show);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    };
  }, [pathname, uid]);

  // No renderizar mientras se resuelve la auth o en la página de login
  if (uid === undefined || pathname === "/login") return null;

  const isGuest  = uid === null;
  const isDino   = isGuest || (cfg?.avatarType ?? "dino") === "dino";
  const config   = cfg ?? DEFAULT_CFG;
  const dinoCareer = config.careerCosmetic?.career ?? null;
  const doneCount  = STEPS.filter((s) => steps[s.key]).length;

  const tipEntry = Object.entries(PAGE_TIPS).find(
    ([p]) => pathname === p || pathname?.startsWith(p + "/")
  );
  const tip = tipEntry?.[1] ?? {
    title: "Vocatio",
    tip: "Explora la plataforma y descubre todas las herramientas disponibles.",
  };

  return (
    <>
      {/* ── Burbuja de voz ── */}
      <AnimatePresence>
        {bubble && !open && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed bottom-[88px] left-4 z-50 max-w-[220px] rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.14)]"
          >
            <button
              onClick={() => setBubble(null)}
              className="absolute right-2 top-1.5 text-[9px] text-slate-300 hover:text-slate-500"
            >
              ✕
            </button>
            <p className="pr-3 text-[11px] leading-relaxed text-slate-700">{bubble}</p>
            <span
              className="absolute -bottom-[7px] left-5 h-0 w-0"
              style={{
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: "7px solid white",
                filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.06))",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Botón flotante ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setOpen((v) => !v); setBubble(null); }}
        aria-label="Guía Dino"
        className="fixed bottom-6 left-6 z-50 overflow-hidden rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.18)] ring-2 ring-white"
        style={{ width: 56, height: 56 }}
      >
        {isDino
          ? <DinosaurSVG career={dinoCareer} size={56} />
          : <AvatarSVG config={config} size={56} />
        }
        {!isGuest && doneCount < STEPS.length && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white ring-2 ring-white"
          >
            {STEPS.length - doneCount}
          </motion.div>
        )}
        {isGuest && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[9px] font-black text-white ring-2 ring-white"
          >
            !
          </motion.div>
        )}
      </motion.button>

      {/* ── Panel lateral ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-24 left-6 z-50 w-[300px] overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-4">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs text-white/60 transition hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>
              <div className="flex items-center gap-3">
                <div className="overflow-hidden rounded-xl ring-2 ring-white/25 flex-shrink-0">
                  {isDino
                    ? <DinosaurSVG career={dinoCareer} size={64} />
                    : <AvatarSVG config={config} size={64} />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {isGuest ? "Tu guía" : "Tu guía vocacional"}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-bold text-white">
                    {isGuest
                      ? "Dino 🦕"
                      : config.careerCosmetic
                        ? `${config.careerCosmetic.badge} ${config.careerCosmetic.label}`
                        : isDino ? "Dino 🦕" : "Vocatio Avatar"}
                  </p>
                  {!isGuest && (
                    <a
                      href="/avatar-test"
                      onClick={() => setOpen(false)}
                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 transition hover:text-red-300"
                    >
                      Personalizar →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Invitados */}
            {isGuest && (
              <div className="px-4 py-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-green-600">
                  🦕 ¡Hola! Soy Dino
                </p>
                <p className="text-xs leading-relaxed text-slate-600 mb-4">
                  Soy la mascota de Vocatio. Regístrate para empezar tu camino vocacional
                  y desbloquear tu propio avatar personalizado.
                </p>
                <div className="space-y-2">
                  <a
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    Iniciar sesión →
                  </a>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      💡 {tip.title}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Logueados */}
            {!isGuest && (
              <div className="max-h-[360px] overflow-y-auto">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-red-600">
                    💡 {tip.title}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600">{tip.tip}</p>
                </div>

                <div className="px-4 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      📋 Tu progreso
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {doneCount}/{STEPS.length}
                    </span>
                  </div>

                  <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(doneCount / STEPS.length) * 100}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    {STEPS.map((step) => {
                      const done = steps[step.key];
                      return (
                        <a
                          key={step.key}
                          href={step.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                            done
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-700"
                          }`}
                        >
                          <span className="text-sm leading-none">{step.icon}</span>
                          <span className="flex-1 leading-snug">{step.label}</span>
                          {done
                            ? <span className="text-xs font-black text-emerald-500">✓</span>
                            : <span className="text-slate-300 text-xs">→</span>
                          }
                        </a>
                      );
                    })}
                  </div>

                  {doneCount === STEPS.length && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-center"
                    >
                      <p className="text-xs font-bold text-emerald-700">🎉 ¡Tutorial completado!</p>
                      <p className="mt-0.5 text-[10px] text-emerald-600">Eres un experto de Vocatio</p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
