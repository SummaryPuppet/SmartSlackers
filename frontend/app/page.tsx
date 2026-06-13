"use client";

import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../src/firebase/config";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const highlights = [
  { title: "+2,500", description: "estudiantes acompañados" },
  { title: "20+", description: "carreras exploradas" },
  { title: "98%", description: "de satisfacción" },
  { title: "76%", description: "más seguridad al elegir" },
];

const features = [
  {
    title: "Test vocacional",
    description: "Descubre tus intereses, fortalezas y áreas con más afinidad.",
    icon: "📋",
  },
  {
    title: "Explorar carreras",
    description: "Compara opciones, campos de estudio y salidas profesionales.",
    icon: "🔍",
  },
  {
    title: "Mentor IA",
    description: "Resuelve dudas al instante con acompañamiento inteligente.",
    icon: "🤖",
  },
  {
    title: "Plan personalizado",
    description: "Recibe recomendaciones claras según tu perfil y objetivos.",
    icon: "🎯",
  },
];

const carouselSlides = [
  {
    title: "Test Vocacional",
    description: "Descubre tus intereses y fortalezas con un test interactivo de 10 preguntas.",
    icon: "📋",
    gradient: "from-red-500/20 via-rose-500/10 to-orange-500/15",
    accent: "#dc2626",
    href: "/test",
    image: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full max-h-[260px]">
        <rect x="30" y="10" width="140" height="180" rx="20" fill="#fef2f2" stroke="#fecaca" strokeWidth="2"/>
        <rect x="50" y="30" width="100" height="12" rx="6" fill="#dc2626" opacity="0.2"/>
        <rect x="50" y="32" width="60" height="8" rx="4" fill="#dc2626"/>
        <circle cx="60" cy="65" r="6" fill="#dc2626" opacity="0.3"/>
        <rect x="72" y="61" width="70" height="8" rx="4" fill="#fca5a5"/>
        <circle cx="60" cy="90" r="6" fill="#dc2626" opacity="0.3"/>
        <rect x="72" y="86" width="55" height="8" rx="4" fill="#fca5a5"/>
        <circle cx="60" cy="115" r="6" fill="#dc2626" opacity="0.3"/>
        <rect x="72" y="111" width="65" height="8" rx="4" fill="#fca5a5"/>
        <circle cx="60" cy="140" r="6" fill="#dc2626" opacity="0.3"/>
        <rect x="72" y="136" width="45" height="8" rx="4" fill="#fca5a5"/>
        <circle cx="60" cy="165" r="6" fill="#dc2626" opacity="0.3"/>
        <rect x="72" y="161" width="55" height="8" rx="4" fill="#fca5a5"/>
        <circle cx="155" cy="170" r="20" fill="#dc2626" opacity="0.15"/>
        <path d="M148 170l5 5 10-10" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Explorar Carreras",
    description: "Compara opciones, campos de estudio y salidas profesionales.",
    icon: "🔍",
    gradient: "from-blue-500/20 via-indigo-500/10 to-violet-500/15",
    accent: "#2563eb",
    href: "/carreras",
    image: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full max-h-[260px]">
        <circle cx="90" cy="85" r="50" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2"/>
        <circle cx="90" cy="85" r="35" fill="#dbeafe" stroke="#60a5fa" strokeWidth="2"/>
        <circle cx="90" cy="85" r="18" fill="#bfdbfe"/>
        <line x1="130" y1="125" x2="165" y2="160" stroke="#2563eb" strokeWidth="4" strokeLinecap="round"/>
        <rect x="35" y="140" width="35" height="30" rx="5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
        <rect x="40" y="148" width="25" height="4" rx="2" fill="#60a5fa"/>
        <rect x="40" y="156" width="18" height="3" rx="1.5" fill="#93c5fd"/>
        <rect x="130" y="25" width="35" height="30" rx="5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
        <rect x="135" y="33" width="25" height="4" rx="2" fill="#60a5fa"/>
        <rect x="135" y="41" width="18" height="3" rx="1.5" fill="#93c5fd"/>
        <rect x="35" y="30" width="30" height="24" rx="4" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
        <rect x="39" y="36" width="22" height="3" rx="1.5" fill="#60a5fa"/>
        <rect x="39" y="42" width="16" height="3" rx="1.5" fill="#93c5fd"/>
      </svg>
    ),
  },
  {
    title: "Simular Carrera",
    description: "Vive un día en diferentes profesiones con mini-juegos interactivos.",
    icon: "🎮",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/15",
    accent: "#059669",
    href: "/simular",
    image: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full max-h-[260px]">
        <rect x="25" y="25" width="150" height="120" rx="18" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2"/>
        <rect x="35" y="35" width="130" height="95" rx="10" fill="#d1fae5"/>
        <rect x="45" y="55" width="50" height="10" rx="5" fill="#059669" opacity="0.4"/>
        <rect x="45" y="70" width="70" height="7" rx="3.5" fill="#a7f3d0"/>
        <rect x="45" y="82" width="60" height="7" rx="3.5" fill="#a7f3d0"/>
        <rect x="45" y="94" width="55" height="7" rx="3.5" fill="#a7f3d0"/>
        <rect x="45" y="106" width="65" height="7" rx="3.5" fill="#a7f3d0"/>
        <circle cx="150" cy="75" r="14" fill="#059669" opacity="0.2"/>
        <path d="M145 75h10M150 70v10" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="60" y="155" width="80" height="14" rx="7" fill="#a7f3d0"/>
        <circle cx="75" cy="162" r="4" fill="#059669"/>
        <circle cx="100" cy="162" r="4" fill="#059669"/>
        <circle cx="125" cy="162" r="4" fill="#059669"/>
        <rect x="55" y="175" width="90" height="6" rx="3" fill="#d1fae5"/>
      </svg>
    ),
  },
  {
    title: "Comunidad",
    description: "Conecta con otros estudiantes y comparte tu experiencia vocacional.",
    icon: "💬",
    gradient: "from-violet-500/20 via-purple-500/10 to-fuchsia-500/15",
    accent: "#7c3aed",
    href: "/comunidad",
    image: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full max-h-[260px]">
        <rect x="15" y="20" width="110" height="70" rx="14" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2"/>
        <rect x="25" y="32" width="55" height="7" rx="3.5" fill="#7c3aed" opacity="0.4"/>
        <rect x="25" y="44" width="80" height="6" rx="3" fill="#ddd6fe"/>
        <rect x="25" y="54" width="65" height="6" rx="3" fill="#ddd6fe"/>
        <rect x="25" y="64" width="75" height="6" rx="3" fill="#ddd6fe"/>
        <circle cx="110" cy="100" r="18" fill="#7c3aed" opacity="0.15"/>
        <circle cx="110" cy="100" r="10" fill="#7c3aed" opacity="0.3"/>
        <rect x="75" y="115" width="110" height="65" rx="14" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2"/>
        <rect x="85" y="128" width="60" height="7" rx="3.5" fill="#7c3aed" opacity="0.4"/>
        <rect x="85" y="140" width="90" height="6" rx="3" fill="#ddd6fe"/>
        <rect x="85" y="150" width="55" height="6" rx="3" fill="#ddd6fe"/>
        <rect x="85" y="160" width="70" height="6" rx="3" fill="#ddd6fe"/>
        <circle cx="165" cy="45" r="22" fill="#7c3aed" opacity="0.1"/>
        <path d="M157 45h16M165 37v16" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Mentor IA",
    description: "Resuelve dudas al instante con acompañamiento inteligente y personalizado.",
    icon: "🤖",
    gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/15",
    accent: "#d97706",
    href: "/mentor",
    image: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full max-h-[260px]">
        <circle cx="100" cy="75" r="45" fill="#fffbeb" stroke="#fcd34d" strokeWidth="2"/>
        <circle cx="100" cy="75" r="32" fill="#fef3c7"/>
        <circle cx="87" cy="68" r="7" fill="#d97706"/>
        <circle cx="113" cy="68" r="7" fill="#d97706"/>
        <path d="M88 85c0 0 6 10 12 10s12-10 12-10" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="93" y="28" width="5" height="14" rx="2.5" fill="#fcd34d"/>
        <circle cx="95.5" cy="24" r="5" fill="#fcd34d"/>
        <rect x="35" y="130" width="130" height="50" rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="2"/>
        <rect x="48" y="142" width="70" height="7" rx="3.5" fill="#d97706" opacity="0.3"/>
        <rect x="48" y="154" width="50" height="6" rx="3" fill="#fcd34d"/>
        <rect x="48" y="164" width="60" height="5" rx="2.5" fill="#fde68a"/>
        <circle cx="148" cy="148" r="12" fill="#d97706" opacity="0.2"/>
        <path d="M144 148l4 4 8-8" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Laboratorios",
    description: "Conoce las instalaciones y laboratorios de la UTP.",
    icon: "🏛️",
    gradient: "from-sky-500/20 via-blue-500/10 to-indigo-500/15",
    accent: "#0284c7",
    href: "/laboratorios",
    image: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full max-h-[260px]">
        <rect x="25" y="55" width="150" height="110" rx="10" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2"/>
        <path d="M100 15L25 55h150L100 15z" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="2"/>
        <rect x="42" y="78" width="35" height="50" rx="5" fill="#bae6fd"/>
        <rect x="82" y="78" width="35" height="50" rx="5" fill="#bae6fd"/>
        <rect x="122" y="78" width="35" height="50" rx="5" fill="#bae6fd"/>
        <rect x="48" y="86" width="23" height="34" rx="3" fill="#e0f2fe"/>
        <rect x="88" y="86" width="23" height="34" rx="3" fill="#e0f2fe"/>
        <rect x="128" y="86" width="23" height="34" rx="3" fill="#e0f2fe"/>
        <circle cx="100" cy="38" r="10" fill="#0284c7" opacity="0.2"/>
        <path d="M96 38l4 4 8-8" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="35" y="170" width="130" height="8" rx="4" fill="#bae6fd"/>
        <rect x="55" y="182" width="90" height="6" rx="3" fill="#e0f2fe"/>
      </svg>
    ),
  },
  {
    title: "Recursos",
    description: "Guías de admisión, planificación y más herramientas útiles.",
    icon: "📚",
    gradient: "from-rose-500/20 via-pink-500/10 to-red-500/15",
    accent: "#e11d48",
    href: "/recursos",
    image: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full max-h-[260px]">
        <rect x="25" y="20" width="40" height="140" rx="7" fill="#ffe4e6" stroke="#fecdd3" strokeWidth="1.5" transform="rotate(-5 45 90)"/>
        <rect x="60" y="15" width="40" height="150" rx="7" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1.5"/>
        <rect x="95" y="18" width="40" height="147" rx="7" fill="#ffe4e6" stroke="#fecdd3" strokeWidth="1.5" transform="rotate(3 115 91)"/>
        <rect x="130" y="22" width="40" height="140" rx="7" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1.5" transform="rotate(6 150 92)"/>
        <rect x="68" y="32" width="24" height="5" rx="2.5" fill="#e11d48" opacity="0.4"/>
        <rect x="68" y="42" width="18" height="4" rx="2" fill="#fda4af"/>
        <rect x="68" y="50" width="22" height="4" rx="2" fill="#fda4af"/>
        <rect x="68" y="58" width="16" height="4" rx="2" fill="#fda4af"/>
        <rect x="103" y="36" width="24" height="5" rx="2.5" fill="#e11d48" opacity="0.4"/>
        <rect x="103" y="46" width="18" height="4" rx="2" fill="#fda4af"/>
        <rect x="103" y="54" width="22" height="4" rx="2" fill="#fda4af"/>
        <circle cx="160" cy="170" r="20" fill="#e11d48" opacity="0.1"/>
        <path d="M152 170l5 5 10-10" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="50" y="175" width="100" height="8" rx="4" fill="#ffe4e6"/>
        <rect x="70" y="188" width="60" height="5" rx="2.5" fill="#fecdd3"/>
      </svg>
    ),
  },
];

function FeatureCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const total = carouselSlides.length;
  const canPrev = idx > 0;
  const canNext = idx < total - 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => {
        const next = prev >= total - 1 ? 0 : prev + 1;
        if (trackRef.current) {
          const card = trackRef.current.children[next] as HTMLElement;
          if (card) {
            trackRef.current.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
          }
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  const go = (dir: number) => {
    const next = Math.max(0, Math.min(total - 1, idx + dir));
    setIdx(next);
    if (trackRef.current) {
      const card = trackRef.current.children[next] as HTMLElement;
      if (card) {
        trackRef.current.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
      }
    }
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const scrollLeft = trackRef.current.scrollLeft;
    const children = Array.from(trackRef.current.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - 16 - scrollLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setIdx(closest);
  };

  return (
    <div className="relative flex h-full items-center">
      <AnimatePresence>
        {canPrev && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            onClick={() => go(-1)}
            className="absolute -left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-colors hover:bg-white hover:text-red-600"
            style={{ border: "1px solid rgba(255,255,255,0.6)" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {canNext && (
          <motion.button
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            onClick={() => go(1)}
            className="absolute -right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-colors hover:bg-white hover:text-red-600"
            style={{ border: "1px solid rgba(255,255,255,0.6)" }}
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto py-4"
        style={{
          gap: 16,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {carouselSlides.map((slide, i) => (
          <motion.a
            key={slide.title}
            href={slide.href}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative shrink-0 flex flex-col overflow-hidden rounded-[2rem] bg-white/80 shadow-[0_15px_50px_rgba(220,38,38,0.08)] backdrop-blur-xl transition-shadow hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)]"
            style={{
              width: "calc(100% - 8px)",
              minWidth: "calc(100% - 8px)",
              height: 420,
              border: "1.5px solid rgba(255,255,255,0.55)",
              scrollSnapAlign: "center",
              textDecoration: "none",
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} pointer-events-none`} />
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl pointer-events-none"
              style={{ background: `${slide.accent}18` }} />

            <div className="relative z-10 flex flex-col h-full p-6">
              <div className="rounded-2xl overflow-hidden mb-4 flex-1 flex items-center justify-center" style={{ background: `${slide.accent}08` }}>
                {slide.image}
              </div>

              <h3 className="font-black text-xl text-slate-950 mb-1">
                {slide.title}
              </h3>
              <p className="text-sm leading-snug text-slate-500 flex-1">
                {slide.description}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold" style={{ color: slide.accent }}>
                <span>Explorar</span>
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </div>
            </div>
          </motion.a>
        ))}

        <div className="shrink-0 w-2" />
      </div>

      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i - idx)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 24 : 6,
              height: 6,
              background: i === idx ? carouselSlides[idx].accent : "rgba(0,0,0,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      const docRef = doc(db, "Usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setUserName(data.nombre || "");
      }
    });

    return () => unsubscribe();
  }, [router]);
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_24%),linear-gradient(180deg,#fff5f5_0%,#fef2f2_100%)] text-slate-900">
      <Navbar />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-red-300/30 blur-3xl animate-drift-slow" />
        <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-rose-300/30 blur-3xl animate-drift-slow animate-delay-300" />
        <div className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-300/25 blur-3xl animate-float-soft" />
      </div>

      <section
        id="inicio"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-16"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:min-h-[560px]">
          <div className="max-w-2xl flex flex-col justify-center">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm animate-fade-up animate-delay-200"
            >
              Tu guía vocacional empieza aquí
            </Badge>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl animate-fade-up animate-delay-300">
              Descubre tu camino.
              <span className="block bg-linear-to-r from-red-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
                Construye tu futuro.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl animate-fade-up animate-delay-400">
              Acompañamos a cada estudiante con orientación vocacional clara,
              recomendaciones personalizadas y herramientas de inteligencia
              artificial para decidir con seguridad.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-up animate-delay-500">
              <Button
                size="lg"
                className="bg-linear-to-r from-red-600 via-rose-600 to-orange-500 shadow-[0_18px_45px_rgba(220,38,38,0.35)] transition-all hover:brightness-110 hover:scale-105"
                onClick={() => (window.location.href = "/test")}
              >
                Comenzar mi viaje
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-slate-600 animate-fade-up animate-delay-600">
              <div className="flex -space-x-3">
                {["AM", "JR", "LP", "+2k"].map((item, index) => (
                  <Avatar
                    key={item}
                    size="lg"
                    className="transition-transform hover:scale-110 hover:z-10"
                  >
                    <AvatarFallback
                      className={
                        index === 3
                          ? "bg-linear-to-br from-red-600 to-rose-500 text-white"
                          : "bg-linear-to-br from-slate-700 to-slate-900 text-white"
                      }
                    >
                      {item}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p>
                <span className="font-semibold text-slate-900">
                  Más de 2,500
                </span>{" "}
                estudiantes ya encontraron un mejor rumbo.
              </p>
            </div>
          </div>

          <div className="relative animate-slide-in-right animate-delay-400 max-w-[460px] w-full">
            <FeatureCarousel />
          </div>
        </div>
      </section>

      <section
        id="recursos"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 lg:px-8 lg:pb-12"
      >
        <div className="grid gap-4 rounded-4xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(220,38,38,0.06)] backdrop-blur-xl lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={`border-slate-100 animate-scale-in animate-delay-${(index + 1) * 100} transition-all hover:scale-105 hover:shadow-lg hover:border-red-200`}
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-2xl transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <CardTitle className="mt-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="grid gap-4 rounded-4xl bg-linear-to-r from-red-700 via-rose-700 to-orange-600 p-6 text-white shadow-[0_24px_70px_rgba(220,38,38,0.28)] sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className={`rounded-3xl border border-white/15 bg-white/10 px-5 py-6 backdrop-blur-sm animate-fade-up animate-delay-${(index + 1) * 100} transition-all hover:bg-white/20 hover:scale-105`}
            >
              <p className="text-4xl font-black tracking-tight">{item.title}</p>
              <p className="mt-2 text-sm text-white/80">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
