"use client";

import Navbar from "@/components/Navbar";
import { useTranslation } from "@/lib/i18n";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function ResourcesPage() {
  const { t } = useTranslation();

  const resourceCards = [
    {
      title: t("recursos.portalUtpPeru"),
      description: t("recursos.portalUtpPeruDesc"),
      href: "https://www.utp.edu.pe",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: t("recursos.laboratorios"),
      description: t("recursos.laboratoriosDesc"),
      href: "/laboratorios",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: t("recursos.admisionUtp"),
      description: t("recursos.admisionUtpDesc"),
      href: "/recursos/admision",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: t("recursos.carrerasUtp"),
      description: t("recursos.carrerasUtpDesc"),
      href: "/carreras",
      buttonText: t("recursos.verCarrerasUtp"),
      image:
        "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const utpResources = [
    {
      title: t("recursos.campusUtp"),
      description: t("recursos.campusUtpDesc"),
      icon: "🏫",
    },
    {
      title: t("recursos.carrerasDestacadas"),
      description: t("recursos.carrerasDestacadasDesc"),
      icon: "🎓",
    },
    {
      title: t("recursos.becasApoyos"),
      description: t("recursos.becasApoyosDesc"),
      icon: "💰",
    },
    {
      title: t("recursos.talleresUtp"),
      description: t("recursos.talleresUtpDesc"),
      icon: "📘",
    },
  ];

  const studentServices = [
    {
      title: t("recursos.mentoriasVocacionales"),
      detail: t("recursos.mentoriasVocacionalesDesc"),
      icon: "🧭",
    },
    {
      title: t("recursos.asesoriaAdmision"),
      detail: t("recursos.asesoriaAdmisionDesc"),
      icon: "📝",
    },
    {
      title: t("recursos.financiamientoUtp"),
      detail: t("recursos.financiamientoUtpDesc"),
      icon: "🤝",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.14),transparent_26%),linear-gradient(180deg,#fff5f5_0%,#fdf2f2_100%)] text-slate-950">
      {/* Navbar compartido — incluye menú de avatar con Ver perfil y Cerrar sesión */}
      <Navbar />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-red-300/30 blur-3xl" />
        <div className="absolute -right-28 top-24 h-96 w-96 rounded-full bg-rose-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-300/25 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-20 animate-fade-up">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6 animate-fade-up animate-delay-200">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 p-3 shadow-lg shadow-slate-950/20 animate-bounce-in">
              <svg viewBox="0 0 120 40" className="h-full w-full">
                <rect x="0" y="0" width="38" height="40" fill="#c8102e" />
                <rect x="41" y="0" width="38" height="40" fill="#c8102e" />
                <rect x="82" y="0" width="38" height="40" fill="#c8102e" />
                <text x="19" y="27" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">U</text>
                <text x="60" y="27" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">T</text>
                <text x="101" y="27" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">P</text>
              </svg>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl animate-fade-up animate-delay-300">
              {t("recursos.heroTitle")}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl animate-fade-up animate-delay-400">
              {t("recursos.heroDesc")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-4xl bg-white/90 p-6 shadow-[0_25px_70px_rgba(220,38,38,0.08)] border border-white/80 animate-fade-up animate-delay-500 transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(220,38,38,0.12)]">
                <p className="text-sm uppercase tracking-[0.2em] text-red-600">{t("recursos.becasUtp")}</p>
                <p className="mt-4 text-lg font-semibold text-slate-950">
                  {t("recursos.becasUtpDesc")}
                </p>
              </div>
              <div className="rounded-4xl bg-white/90 p-6 shadow-[0_25px_70px_rgba(220,38,38,0.08)] border border-white/80 animate-fade-up animate-delay-600 transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(220,38,38,0.12)]">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-700">{t("recursos.talleresLabel")}</p>
                <p className="mt-4 text-lg font-semibold text-slate-950">
                  {t("recursos.talleresLabelDesc")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 animate-fade-up animate-delay-400">
            <div className="rounded-[2.5rem] bg-white/95 p-8 shadow-[0_35px_100px_rgba(220,38,38,0.12)] border border-white/80 animate-fade-up animate-delay-500 transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_40px_110px_rgba(220,38,38,0.18)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-100 text-red-700 text-2xl animate-bounce-in">
                📚
              </div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{t("recursos.recursosLabel")}</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{t("recursos.utpGuide")}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {t("recursos.utpGuideDesc")}
                </p>
                <a
                  href="https://www.utp.edu.pe/guias-del-estudiante-de-2026-i"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition duration-300 transform hover:-translate-y-0.5 hover:bg-red-700"
                >
                  {t("recursos.verGuia")}
                </a>
              </div>
            </div>
            <div className="rounded-[2.5rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 p-8 shadow-[0_35px_100px_rgba(220,38,38,0.22)] text-white animate-fade-up animate-delay-600 transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_40px_110px_rgba(220,38,38,0.28)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-2xl">✨</div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.24em] text-red-100">{t("recursos.exito")}</p>
                <p className="mt-3 text-4xl font-black">{t("recursos.utpEnTuFuturo")}</p>
                <p className="mt-4 text-sm leading-6 text-red-100/90">
                  {t("recursos.utpEnTuFuturoDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {resourceCards.map((card, idx) => (
            <Card
              key={card.title}
              className={`overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_90px_rgba(220,38,38,0.08)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(220,38,38,0.14)] animate-fade-up animate-delay-${(idx + 1) * 100}`}
            >
              <img src={card.image} alt={card.title} className="h-56 w-full object-cover" />
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold text-slate-950">{card.title}</CardTitle>
                <CardDescription className="mt-3 text-sm leading-6 text-slate-600">
                  {card.description}
                </CardDescription>
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-6 inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition duration-300 transform hover:-translate-y-0.5 hover:bg-red-100"
                >
                  {card.buttonText ?? t("recursos.irAlRecurso")}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {utpResources.map((resource, idx) => (
            <Card
              key={resource.title}
              className={`overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-[0_24px_90px_rgba(220,38,38,0.08)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(220,38,38,0.14)] animate-fade-up animate-delay-${(idx + 1) * 120}`}
            >
              <CardContent className="p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-2xl">
                  {resource.icon}
                </div>
                <CardTitle className="mt-6 text-xl font-semibold text-slate-950">{resource.title}</CardTitle>
                <CardDescription className="mt-3 text-sm leading-6 text-slate-600">
                  {resource.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {studentServices.map((service, idx) => (
            <div
              key={service.title}
              className={`rounded-4xl bg-white/95 p-8 shadow-[0_28px_90px_rgba(220,38,38,0.08)] border border-white/80 animate-fade-up animate-delay-${(idx + 1) * 140}`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-100 text-rose-700 text-2xl">
                {service.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{service.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
