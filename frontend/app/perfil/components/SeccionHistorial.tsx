"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { User } from "firebase/auth";
import {
  doc, onSnapshot, collection, query, orderBy, limit, Unsubscribe,
} from "firebase/firestore";
import { db } from "@/src/firebase/config";
import SeccionHistorialItem, { HistorialEvent } from "./SeccionHistorialItem";
import { useTranslation } from "@/lib/i18n";

interface SeccionHistorialProps {
  user: User;
  colUsuario: string;
}

const SIM_NAME_MAP: Record<string, { title: string; emoji: string }> = {
  software:           { title: "Software",           emoji: "💻" },
  medicina:           { title: "Medicina",           emoji: "🩺" },
  derecho:            { title: "Derecho",            emoji: "⚖️" },
  psicologia:         { title: "Psicología",         emoji: "🧠" },
  marketing:          { title: "Marketing",          emoji: "📈" },
  "ingenieria-civil": { title: "Ingeniería Civil",   emoji: "🏗️" },
  gastronomia:        { title: "Gastronomía",        emoji: "👨‍🍳" },
  arquitectura:       { title: "Arquitectura",       emoji: "🏛️" },
  astronauta:         { title: "Astronauta",         emoji: "🚀" },
};

function toDate(val: unknown): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === "object" && val !== null && "toDate" in val && typeof (val as any).toDate === "function") {
    return (val as any).toDate();
  }
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function getDateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function SeccionHistorial({ user, colUsuario }: SeccionHistorialProps) {
  const { t: tt } = useTranslation();
  const [events, setEvents] = useState<HistorialEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Mapa compartido: todos los listeners escriben aquí
  const eventsMap = useRef<Map<string, HistorialEvent>>(new Map());
  // Contador de listeners que han cargado al menos una vez
  const loadedCount = useRef(0);
  const TOTAL_LISTENERS = 6;

  // Reconstruye el array de eventos desde el mapa
  const rebuildEvents = useCallback(() => {
    const arr = Array.from(eventsMap.current.values());
    arr.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setEvents(arr.slice(0, 30));
  }, []);

  // Marca un listener como cargado y oculta spinner cuando todos están listos
  const markLoaded = useCallback(() => {
    loadedCount.current += 1;
    if (loadedCount.current >= TOTAL_LISTENERS) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    eventsMap.current.clear();
    loadedCount.current = 0;
    setLoading(true);

    const unsubs: Unsubscribe[] = [];

    // ── 1. Tests (subcolección del usuario) ──
    unsubs.push(
      onSnapshot(
        query(
          collection(db, colUsuario, user.uid, "historialTests"),
          orderBy("completedAt", "desc"),
          limit(30),
        ),
        (snap) => {
          // Eliminar eventos de test anteriores
          for (const [key] of eventsMap.current) {
            if (key.startsWith("test-")) eventsMap.current.delete(key);
          }
          snap.docs.forEach((d) => {
            const data = d.data();
            const date = toDate(data.completedAt);
            if (!date) return;
            eventsMap.current.set(`test-${d.id}`, {
              id: `test-${d.id}`,
              type: "test",
              title: data.insufficient
                ? tt("perfil.evtTestInsuficiente")
                : `${data.careerEmoji ?? "📝"} ${data.careerTitle ?? data.careerKey}`,
              description: data.insufficient
                ? tt("perfil.evtTestInsuficienteDesc")
                : `${data.match ?? 0}% ${tt("perfil.compatibilidad")} · ${data.score} pts`,
              timestamp: date,
              icon: data.insufficient ? "😔" : "📝",
              color: "red",
            });
          });
          rebuildEvents();
          markLoaded();
        },
        () => markLoaded(), // en error, igual marcar como cargado
      ),
    );

    // ── 2. Badges ──
    unsubs.push(
      onSnapshot(doc(db, "UserBadges", user.uid), (snap) => {
        for (const [key] of eventsMap.current) {
          if (key.startsWith("badge-")) eventsMap.current.delete(key);
        }
        if (snap.exists()) {
          const badgesData = snap.data().badges as Record<string, { unlockedAt: string }> | undefined;
          if (badgesData) {
            Object.entries(badgesData).forEach(([badgeId, info]) => {
              const date = toDate(info.unlockedAt);
              if (!date) return;
              eventsMap.current.set(`badge-${badgeId}`, {
                id: `badge-${badgeId}`,
                type: "badge",
                title: `🏆 ${badgeId.replace(/-/g, " ")}`,
                description: tt("perfil.evtBadgeDesbloqueado"),
                timestamp: date,
                icon: "🏆",
                color: "amber",
              });
            });
          }
        }
        rebuildEvents();
        markLoaded();
      }, () => markLoaded()),
    );

    // ── 3. Simulaciones ──
    unsubs.push(
      onSnapshot(
        query(collection(db, "SimulationResults"), orderBy("completedAt", "desc"), limit(30)),
        (snap) => {
          for (const [key] of eventsMap.current) {
            if (key.startsWith("sim-")) eventsMap.current.delete(key);
          }
          snap.docs.forEach((d) => {
            const data = d.data();
            if (data.userId !== user.uid) return;
            const date = toDate(data.completedAt);
            if (!date) return;
            const simId = data.simulationId ?? "";
            const simInfo = SIM_NAME_MAP[simId] ?? { title: simId, emoji: "🧪" };
            eventsMap.current.set(`sim-${d.id}`, {
              id: `sim-${d.id}`,
              type: "simulacion",
              title: `${simInfo.emoji} ${tt("perfil.evtSimCompletada")} ${simInfo.title}`,
              description: `${tt("perfil.rango")}: ${data.rank ?? "—"}`,
              timestamp: date,
              icon: "🧪",
              color: "blue",
            });
          });
          rebuildEvents();
          markLoaded();
        },
        () => markLoaded(),
      ),
    );

    // ── 4. Mentor (ChatHistories) ──
    unsubs.push(
      onSnapshot(collection(db, "ChatHistories"), (snap) => {
        for (const [key] of eventsMap.current) {
          if (key.startsWith("chat-")) eventsMap.current.delete(key);
        }
        snap.docs.forEach((d) => {
          if (!d.id.startsWith(user.uid)) return;
          const data = d.data();
          const date = toDate(data.updatedAt);
          if (!date) return;
          const careerId = data.careerId ?? d.id.replace(user.uid + "_", "");
          const simInfo = SIM_NAME_MAP[careerId] ?? { title: careerId, emoji: "🤖" };
          eventsMap.current.set(`chat-${d.id}`, {
            id: `chat-${d.id}`,
            type: "mentor",
            title: `${tt("perfil.evtSesionMentor")} ${simInfo.title}`,
            description: `${data.messages?.length ?? 0} ${tt("perfil.mensajes")}`,
            timestamp: date,
            icon: "🤖",
            color: "purple",
          });
        });
        rebuildEvents();
        markLoaded();
      }, () => markLoaded()),
    );

    // ── 5. Avatar ──
    unsubs.push(
      onSnapshot(doc(db, "avatars", user.uid), (snap) => {
        eventsMap.current.delete("avatar-update");
        if (snap.exists()) {
          const data = snap.data();
          const date = toDate(data.updatedAt);
          if (date) {
            eventsMap.current.set("avatar-update", {
              id: "avatar-update",
              type: "avatar",
              title: tt("perfil.evtAvatarActualizado"),
              description: tt("perfil.evtAvatarDesc"),
              timestamp: date,
              icon: "👤",
              color: "pink",
            });
          }
        }
        rebuildEvents();
        markLoaded();
      }, () => markLoaded()),
    );

    // ── 6. Skills ──
    unsubs.push(
      onSnapshot(doc(db, "UserSkills", user.uid), (snap) => {
        eventsMap.current.delete("skills-assessment");
        if (snap.exists()) {
          const data = snap.data();
          const date = toDate(data.lastAnalysis);
          if (date) {
            const skillCount = Object.keys(data.skills ?? {}).length;
            eventsMap.current.set("skills-assessment", {
              id: "skills-assessment",
              type: "skills",
              title: tt("perfil.evtSkillsEvaluados"),
              description: `${skillCount} ${tt("perfil.habilidades")}`,
              timestamp: date,
              icon: "📊",
              color: "emerald",
            });
          }
        }
        rebuildEvents();
        markLoaded();
      }, () => markLoaded()),
    );

    return () => unsubs.forEach((u) => u());
  }, [user.uid, colUsuario, tt, rebuildEvents, markLoaded]);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
          📈 {tt("perfil.seccionHistorial")}
        </p>
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
          <span className="text-4xl">📭</span>
          <p className="text-sm font-medium text-slate-600">{tt("perfil.sinHistorial")}</p>
          <p className="text-xs text-slate-400">{tt("perfil.sinHistorialDesc")}</p>
        </div>
      </div>
    );
  }

  let lastDateKey = "";

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
      <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
        📈 {tt("perfil.seccionHistorial")}
      </p>

      <div className="space-y-0">
        {events.map((event, i) => {
          const dateKey = getDateKey(event.timestamp);
          const showDateGroup = dateKey !== lastDateKey;
          lastDateKey = dateKey;

          let dateLabel = "";
          if (showDateGroup) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const eventDay = new Date(event.timestamp.getFullYear(), event.timestamp.getMonth(), event.timestamp.getDate());
            const diffDays = Math.floor((today.getTime() - eventDay.getTime()) / 86400000);

            if (diffDays === 0) dateLabel = tt("perfil.hoy");
            else if (diffDays === 1) dateLabel = tt("perfil.ayer");
            else if (diffDays < 7) dateLabel = `${diffDays} ${tt("perfil.diasAtras")}`;
            else dateLabel = event.timestamp.toLocaleDateString("es-PE", { day: "numeric", month: "long" });
          }

          return (
            <SeccionHistorialItem
              key={event.id}
              event={event}
              isFirst={i === 0}
              isLast={i === events.length - 1}
              showDateGroup={showDateGroup}
              dateLabel={dateLabel}
              t={tt}
            />
          );
        })}
      </div>
    </div>
  );
}
