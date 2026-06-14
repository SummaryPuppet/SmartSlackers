"use client";

import { motion } from "framer-motion";

export type HistorialEventType = "test" | "badge" | "simulacion" | "mentor" | "avatar" | "skills";

export interface HistorialEvent {
  id: string;
  type: HistorialEventType;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

const EVENT_STYLES: Record<HistorialEventType, { bg: string; ring: string; iconBg: string }> = {
  test:       { bg: "bg-red-50",    ring: "ring-red-200",    iconBg: "bg-red-100"    },
  badge:      { bg: "bg-amber-50",  ring: "ring-amber-200",  iconBg: "bg-amber-100"  },
  simulacion: { bg: "bg-blue-50",   ring: "ring-blue-200",   iconBg: "bg-blue-100"   },
  mentor:     { bg: "bg-purple-50", ring: "ring-purple-200", iconBg: "bg-purple-100" },
  avatar:     { bg: "bg-pink-50",   ring: "ring-pink-200",   iconBg: "bg-pink-100"   },
  skills:     { bg: "bg-emerald-50", ring: "ring-emerald-200", iconBg: "bg-emerald-100" },
};

function timeAgo(date: Date, t: (key: string) => string): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr  = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1)  return t("perfil.haceUnMomento");
  if (diffMin < 60) return `${diffMin} min`;
  if (diffHr < 24)  return `${diffHr}h`;
  if (diffDay === 1) return t("perfil.ayer");
  if (diffDay < 7)  return `${diffDay} ${t("perfil.dias")}`;
  return date.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

interface SeccionHistorialItemProps {
  event: HistorialEvent;
  isFirst: boolean;
  isLast: boolean;
  showDateGroup: boolean;
  dateLabel: string;
  t: (key: string) => string;
}

export default function SeccionHistorialItem({
  event,
  isFirst,
  isLast,
  showDateGroup,
  dateLabel,
  t,
}: SeccionHistorialItemProps) {
  const styles = EVENT_STYLES[event.type];

  return (
    <div>
      {showDateGroup && (
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0">
            {dateLabel}
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative flex gap-4"
      >
        {/* Línea vertical + nodo */}
        <div className="flex flex-col items-center">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ring-2 ${styles.bg} ${styles.ring}`}>
            {event.icon}
          </div>
          {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0 pb-6">
          <p className="text-sm font-bold text-slate-900 leading-snug">{event.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{event.description}</p>
          <p className="mt-1 text-[11px] text-slate-400">{timeAgo(event.timestamp, t)}</p>
        </div>
      </motion.div>
    </div>
  );
}
