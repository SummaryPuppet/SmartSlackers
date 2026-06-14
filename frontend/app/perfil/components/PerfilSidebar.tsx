"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

const SECCIONES = [
  { id: "cuenta",    icon: "👤" },
  { id: "intereses", icon: "🎯" },
  { id: "skills",    icon: "📊" },
  { id: "admision",  icon: "🎓" },
  { id: "logros",    icon: "🏆" },
  { id: "historial", icon: "📈" },
] as const;

export type SeccionId = (typeof SECCIONES)[number]["id"];

interface PerfilSidebarProps {
  active: SeccionId;
  onChange: (id: SeccionId) => void;
}

export default function PerfilSidebar({ active, onChange }: PerfilSidebarProps) {
  const { t } = useTranslation();

  const labels: Record<SeccionId, string> = {
    cuenta: t("perfil.seccionCuenta"),
    intereses: t("perfil.seccionIntereses"),
    skills: t("perfil.seccionSkills"),
    admision: t("perfil.seccionAdmision"),
    logros: t("perfil.seccionLogros"),
    historial: t("perfil.seccionHistorial"),
  };

  return (
    <>
      {/* ── Desktop: sidebar vertical ── */}
      <nav className="hidden lg:flex flex-col gap-1 w-64 shrink-0 sticky top-6 self-start">
        {SECCIONES.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className={`relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-red-50 text-red-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-red-600"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="text-lg">{s.icon}</span>
              <span>{labels[s.id]}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Mobile: tabs horizontales ── */}
      <nav className="flex lg:hidden gap-1 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {SECCIONES.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-red-50 text-red-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span>{s.icon}</span>
              <span>{labels[s.id]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
