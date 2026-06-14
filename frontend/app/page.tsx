"use client";

import Navbar from "@/components/Navbar";
import MiniMentorWidget from "@/app/components/MiniMentorWidget";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { useTranslation } from "@/lib/i18n";

function FeatureCarousel() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const carouselSlides = [
    {
      title: t("home.testVocacional"),
      description: t("home.testVocacionalDesc"),
      icon: "📋",
      gradient: "from-red-500/20 via-rose-500/10 to-orange-500/15",
      accent: "#dc2626",
      href: "/test",
      image: (
        <img src="/img-carrusel/test-vocacional.png" alt="Test vocacional" className="w-full h-full max-h-[340px] object-contain" />
      ),
    },
    {
      title: t("home.explorarCarreras"),
      description: t("home.explorarCarrerasDesc"),
      icon: "🔍",
      gradient: "from-blue-500/20 via-indigo-500/10 to-violet-500/15",
      accent: "#2563eb",
      href: "/carreras",
      image: (
        <img src="/img-carrusel/explorar-carreras.png" alt="Explorar carreras" className="w-full h-full max-h-[340px] object-contain" />
      ),
    },
    {
      title: t("home.simularCarrera"),
      description: t("home.simularCarreraDesc"),
      icon: "🎮",
      gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/15",
      accent: "#059669",
      href: "/simular",
      image: (
        <img src="/img-carrusel/simular-carrera.png" alt="Simular carrera" className="w-full h-full max-h-[340px] object-contain" />
      ),
    },
    {
      title: t("home.comunidad"),
      description: t("home.comunidadDesc"),
      icon: "💬",
      gradient: "from-violet-500/20 via-purple-500/10 to-fuchsia-500/15",
      accent: "#7c3aed",
      href: "/comunidad",
      image: (
        <img src="/img-carrusel/comunidad.png" alt="Comunidad" className="w-full h-full max-h-[340px] object-contain" />
      ),
    },
    {
      title: t("home.mentorIA"),
      description: t("home.mentorIADesc"),
      icon: "🤖",
      gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/15",
      accent: "#d97706",
      href: "/mentor",
      image: (
        <img src="/img-carrusel/mentor-ia.png" alt="Mentor IA" className="w-full h-full max-h-[340px] object-contain" />
      ),
    },
    {
      title: t("home.laboratorios"),
      description: t("home.laboratoriosDesc"),
      icon: "🏛️",
      gradient: "from-sky-500/20 via-blue-500/10 to-indigo-500/15",
      accent: "#0284c7",
      href: "/laboratorios",
      image: (
        <img src="/img-carrusel/laboratorios.png" alt="Laboratorios" className="w-full h-full max-h-[340px] object-contain" />
      ),
    },
    {
      title: t("home.recursos"),
      description: t("home.recursosDesc"),
      icon: "📚",
      gradient: "from-rose-500/20 via-pink-500/10 to-red-500/15",
      accent: "#e11d48",
      href: "/recursos",
      image: (
        <img src="/img-carrusel/recursos.png" alt="Recursos" className="w-full h-full max-h-[340px] object-contain" />
      ),
    },
  ];

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
              <div className="rounded-2xl overflow-hidden mb-1 flex-1 flex items-center justify-center" style={{ background: `${slide.accent}08` }}>
                {slide.image}
              </div>

              <h3 className="font-black text-xl text-slate-950 mb-0.5">
                {slide.title}
              </h3>
              <p className="text-sm leading-snug text-slate-500">
                {slide.description}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold" style={{ color: slide.accent }}>
                <span>{t("home.explorar")}</span>
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
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const highlights = [
    { title: "+2,500", description: t("home.estudiantesAcompanados") },
    { title: "20+", description: t("home.carrerasExploradas") },
    { title: "98%", description: t("home.satisfaccion") },
    { title: "76%", description: t("home.seguridadElegir") },
  ];

  const features = [
    {
      title: t("home.testVocacional"),
      description: t("home.testVocacionalDesc"),
      icon: "📋",
    },
    {
      title: t("home.explorarCarreras"),
      description: t("home.explorarCarrerasDesc"),
      icon: "🔍",
    },
    {
      title: t("home.mentorIA"),
      description: t("home.mentorIADesc"),
      icon: "🤖",
    },
    {
      title: t("home.planPersonalizado"),
      description: t("home.planPersonalizadoDesc"),
      icon: "🎯",
    },
  ];

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
              {t("home.guiaVocacional")}
            </Badge>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl animate-fade-up animate-delay-300">
              {t("home.descubreCamino")}
              <span className="block bg-linear-to-r from-red-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
                {t("home.construyeFuturo")}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl animate-fade-up animate-delay-400">
              {t("home.descripcionHome")}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-up animate-delay-500">
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.03, 1],
                  boxShadow: [
                    "0 18px 45px rgba(220,38,38,0.35)",
                    "0 22px 55px rgba(220,38,38,0.5)",
                    "0 18px 45px rgba(220,38,38,0.35)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => (window.location.href = "/test")}
                className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-red-600 via-rose-600 to-orange-500 px-10 py-5 text-xl font-bold text-white shadow-[0_18px_45px_rgba(220,38,38,0.35)] transition-all hover:brightness-110 cursor-pointer"
              >
                {t("home.comenzarViaje")} →
              </motion.button>
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
                  {t("home.masDe")}
                </span>{" "}
                {t("home.estudiantesEncontraron")}
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

      <MiniMentorWidget />

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
