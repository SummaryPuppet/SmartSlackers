"use client";

import { useEffect, useState, useMemo } from "react";
import AvatarSVG from "@/app/components/avatar/AvatarSVG";
import DinosaurSVG from "@/app/components/avatar/DinosaurSVG";
import { CAREER_COSMETICS } from "@/lib/careerCosmetics";
import { loadAvatar } from "@/src/services/avatarService";
import type { AvatarConfig } from "@/types/avatar";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { doc, getDoc, Timestamp, getDocs, query, collection, orderBy, limit } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { Button } from "@/components/ui/button";
import PerfilSidebar, { SeccionId } from "./components/PerfilSidebar";
import SeccionCuenta from "./components/SeccionCuenta";
import SeccionIntereses from "./components/SeccionIntereses";
import SeccionSkills from "./components/SeccionSkills";
import SeccionAdmision from "./components/SeccionAdmision";
import SeccionLogros from "./components/SeccionLogros";
import { useTranslation } from "@/lib/i18n";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (value: unknown, t: (key: string) => string) => {
  if (!value) return t("common.noDisponible");
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  try {
    return new Date(value as string).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return t("common.noDisponible");
  }
};

const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// ─── Types (exportados para que los consuman los componentes de sección) ───

export type Profile = {
  nombre: string;
  email: string;
  rol: string;
  fechaRegistro: string;
  carrera?: string;
  telefono?: string;
  dni?: string;
  modalidad?: string;
  sede?: string;
  etapaAdmision?: string;
  intereses?: string[];
};

export type CarreraAnalizada = {
  title: string;
  emoji: string;
  color: string;
  porcentaje: number;
  razon: string;
};

export type TestHistoryEntry = {
  id: string;
  careerKey: string;
  careerTitle: string | null;
  careerEmoji: string | null;
  match: number | null;
  score: number;
  insufficient: boolean;
  answered: number;
  completedAt: Timestamp | null;
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // Sidebar
  const [activeSection, setActiveSection] = useState<SeccionId>("cuenta");

  // Auth & profile
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({
    nombre: "",
    email: "",
    rol: "Estudiante",
    fechaRegistro: "",
  });
  const [loading, setLoading] = useState(true);

  // Intereses
  const [intereses, setIntereses] = useState<string[]>([]);

  // Avatar
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);

  // Test history
  const [testHistory, setTestHistory] = useState<TestHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Badges
  const [badges, setBadges]                   = useState<any[]>([]);
  const [totalXp, setTotalXp]                 = useState(0);
  const [totalUnlocked, setTotalUnlocked]     = useState(0);
  const [totalAvailable, setTotalAvailable]   = useState(0);
  const [badgesLoading, setBadgesLoading]     = useState(true);

  // Colección en Firestore
  const [colUsuario, setColUsuario] = useState<string>("usuarios");

  // Top-2 carreras por promedio de match
  const careerStats = useMemo(() => {
    const completed = testHistory.filter(
      (e) => !e.insufficient && e.careerKey && e.match !== null,
    );
    if (completed.length === 0) return null;

    const grouped: Record<string, { matches: number[]; title: string; emoji: string }> = {};
    completed.forEach((e) => {
      if (!grouped[e.careerKey]) {
        grouped[e.careerKey] = {
          matches: [],
          title: e.careerTitle ?? e.careerKey,
          emoji: e.careerEmoji ?? "🎓",
        };
      }
      grouped[e.careerKey].matches.push(e.match!);
    });

    return Object.entries(grouped)
      .map(([key, data]) => ({
        key,
        title: data.title,
        emoji: data.emoji,
        avgMatch: Math.round(data.matches.reduce((a, b) => a + b, 0) / data.matches.length),
        count: data.matches.length,
      }))
      .sort((a, b) => b.count !== a.count ? b.count - a.count : b.avgMatch - a.avgMatch)
      .slice(0, 2);
  }, [testHistory]);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) { router.push("/login"); return; }

      setUser(currentUser);
      const email       = currentUser.email       || "";
      const displayName = currentUser.displayName || "";

      let foundProfile: Record<string, unknown> | null = null;
      let foundCol = "usuarios";

      for (const col of ["usuarios", "Usuarios"]) {
        try {
          const snap = await getDoc(doc(db, col, currentUser.uid));
          if (snap.exists()) { foundProfile = snap.data() as Record<string, unknown>; foundCol = col; break; }
        } catch { /* ignore */ }
      }

      setColUsuario(foundCol);

      setProfile({
        nombre:        (foundProfile?.nombre        as string) || displayName || email.split("@")[0] || "Usuario",
        email,
        rol:           (foundProfile?.rol           as string) || "Estudiante",
        fechaRegistro: foundProfile?.fechaRegistro  ? formatDate(foundProfile.fechaRegistro, t) : t("common.noDisponible"),
        carrera:       (foundProfile?.carrera       as string) || undefined,
        telefono:      (foundProfile?.telefono      as string) || undefined,
        dni:           (foundProfile?.dni           as string) || undefined,
        modalidad:     (foundProfile?.modalidad     as string) || undefined,
        sede:          (foundProfile?.sede          as string) || undefined,
        etapaAdmision: (foundProfile?.etapaAdmision as string) || undefined,
      });

      setIntereses((foundProfile?.intereses as string[]) || []);

      // Badges
      try {
        const { fetchUserBadges } = await import("@/src/services/badgeService");
        const badgeData = await fetchUserBadges(currentUser.uid);
        setBadges(badgeData.badges);
        setTotalXp(badgeData.totalXp);
        setTotalUnlocked(badgeData.totalUnlocked);
        setTotalAvailable(badgeData.totalAvailable);
      } catch {
        // badges are optional
      } finally {
        setBadgesLoading(false);
      }

      // Historial de tests
      try {
        let histSnap;
        try {
          histSnap = await getDocs(
            query(
              collection(db, foundCol, currentUser.uid, "historialTests"),
              orderBy("completedAt", "desc"),
              limit(10),
            ),
          );
        } catch {
          histSnap = await getDocs(
            query(collection(db, foundCol, currentUser.uid, "historialTests"), limit(10)),
          );
        }
        const history: TestHistoryEntry[] = histSnap.docs.map((d) => {
          const data = d.data();
          return {
            id:           d.id,
            careerKey:    data.careerKey    ?? "",
            careerTitle:  data.careerTitle  ?? null,
            careerEmoji:  data.careerEmoji  ?? null,
            match:        data.match        ?? null,
            score:        data.score        ?? 0,
            insufficient: data.insufficient ?? false,
            answered:     data.answered     ?? 0,
            completedAt:  data.completedAt  ?? null,
          };
        });
        history.sort((a, b) => (b.completedAt?.seconds ?? 0) - (a.completedAt?.seconds ?? 0));
        setTestHistory(history);
      } catch {
        // historial es opcional
      } finally {
        setHistoryLoading(false);
      }

      // Carga el avatar guardado
      try {
        const saved = await loadAvatar(currentUser.uid);
        if (saved) setAvatarConfig(saved.config);
      } catch { /* avatar es opcional */ }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, t]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    try { await signOut(auth); } catch { /* ignore */ } finally { router.push("/login"); }
  };

  const handleVolver = () => {
    if (window.history.length > 1) router.back();
    else router.push("/recursos");
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            {t("common.cargandoPerfil")}
          </p>
        </div>
      </main>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-red-50 to-slate-100 text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

        {/* ── Encabezado ── */}
        <div className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-red-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(220,38,38,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-red-600 to-rose-500 text-2xl font-bold text-white shadow-lg shadow-red-600/30">
                {getInitials(profile.nombre)}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                  {t("perfil.perfilEstudiante")}
                </p>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                  {profile.nombre}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  {t("perfil.infoCuenta")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
              <Button onClick={handleVolver} variant="outline">← {t("common.volver")}</Button>
              <Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
                {t("perfil.cerrarSesion")}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Tabs móvil ── */}
        <div className="mb-6 lg:hidden">
          <PerfilSidebar active={activeSection} onChange={setActiveSection} />
        </div>

<<<<<<< Updated upstream
        {/* ── Layout: sidebar + contenido ── */}
        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <div className="hidden lg:block">
            <PerfilSidebar active={activeSection} onChange={setActiveSection} />
          </div>

          {/* Contenido de la sección activa */}
          <div className="flex-1 min-w-0">
            {activeSection === "cuenta" && (
              <SeccionCuenta profile={profile} getInitials={getInitials} />
            )}
=======
          {/* Columna izquierda */}
          <div className="space-y-8">

            {/* ── Datos personales ── */}
            <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                Datos personales
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Nombre",            value: profile.nombre        },
                  { label: "Correo",            value: profile.email         },
                  { label: "Rol",               value: profile.rol           },
                  { label: "Fecha de registro", value: profile.fechaRegistro },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-3 break-all text-xl font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              {datosAdicionales.length > 0 && (
                <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  {datosAdicionales.map((item) => (
                    <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                      <p className="mt-3 text-xl font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Historial de Tests ── */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                  Historial de tests
                </p>
                <a
                  href="/test"
                  className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                >
                  + Nuevo test
                </a>
              </div>

              {/* ── Banner de test en progreso ── */}
              {inProgressTest && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"
                >
                  {/* Avatar pulsando */}
                  <div className="relative flex-shrink-0">
                    <div className="overflow-hidden rounded-xl ring-2 ring-amber-300">
                      {(avatarConfig?.avatarType ?? "dino") === "dino"
                        ? <DinosaurSVG career={avatarConfig?.careerCosmetic?.career ?? null} size={64} />
                        : <AvatarSVG
                            config={avatarConfig ?? {
                              skinTone: "medium-light", hairStyle: "medium", hairColor: "black",
                              eyeColor: "brown", outfitBase: "casual", background: "sky", unlockedCareers: [],
                            }}
                            size={64}
                          />
                      }
                    </div>
                    {/* Punto pulsante de "en vivo" */}
                    <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-amber-500" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-amber-800">Test en progreso</p>
                    <p className="text-xs text-amber-600">
                      Pregunta {inProgressTest.current + 1} de 10 ·{" "}
                      {inProgressTest.answeredCount} respondidas
                    </p>
                  </div>

                  <a
                    href="/test"
                    className="flex-shrink-0 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600"
                  >
                    Continuar →
                  </a>
                </motion.div>
              )}

              {/* ── Lista de resultados ── */}
              {historyLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
                </div>
              ) : testHistory.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                  <span className="text-4xl">🎯</span>
                  <p className="text-sm font-medium text-slate-600">Aún no has hecho ningún test</p>
                  <p className="text-xs text-slate-400">Completa el test vocacional para ver tus resultados aquí</p>
                  <a
                    href="/test"
                    className="mt-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Hacer test ahora →
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {testHistory.map((entry, i) => {
                    const isDino    = (avatarConfig?.avatarType ?? "dino") === "dino";
                    const cosmetic  = CAREER_COSMETICS[entry.careerKey] ?? null;
                    const avatarWithCosmetic = avatarConfig
                      ? { ...avatarConfig, careerCosmetic: cosmetic ?? undefined, background: cosmetic?.background ?? avatarConfig.background }
                      : null;

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 24 }}
                        className={`flex items-center gap-4 rounded-2xl border p-4 ${
                          entry.insufficient
                            ? "border-slate-200 bg-slate-50"
                            : "border-red-100 bg-red-50/30"
                        }`}
                      >
                        {/* Avatar con traje de la carrera del test */}
                        <div className="flex-shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-200">
                          {entry.insufficient ? (
                            <div className="flex h-[72px] w-[72px] items-center justify-center bg-slate-100 text-3xl">
                              😔
                            </div>
                          ) : isDino ? (
                            <DinosaurSVG career={entry.careerKey || null} size={72} />
                          ) : avatarWithCosmetic ? (
                            <AvatarSVG config={avatarWithCosmetic} size={72} />
                          ) : (
                            <DinosaurSVG career={entry.careerKey || null} size={72} />
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          {entry.insufficient ? (
                            <p className="text-sm font-semibold text-slate-500">
                              Respuestas insuficientes
                            </p>
                          ) : (
                            <p className="truncate text-sm font-bold text-slate-900">
                              {entry.careerEmoji} {entry.careerTitle ?? entry.careerKey}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-400">
                            {entry.completedAt ? formatDate(entry.completedAt) : "Fecha desconocida"}
                          </p>
                          {!entry.insufficient && (
                            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                                style={{ width: `${entry.match ?? 0}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        {!entry.insufficient && (
                          <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
                            <span className="text-lg font-black text-red-600">
                              {entry.match ?? "—"}%
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                              {entry.score} pts
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Card de Intereses y Hobbys ── */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">

              {/* Header del card */}
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                  Mis intereses y hobbys
                </p>
                {/* Botón Editar (solo visible cuando NO está en modo edición y hay tags) */}
                {!modoEdicion && (
                  <button
                    onClick={handleEditar}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    ✏️ Editar
                  </button>
                )}
              </div>

              <p className="mb-5 text-sm text-slate-500">
                {modoEdicion
                  ? <>Escribe un interés y presiona <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600">Enter</kbd> para agregarlo.</>
                  : "Tus intereses y hobbys registrados."}
              </p>

              {/* ── MODO EDICIÓN ── */}
              {modoEdicion && (
                <div className="space-y-4">
                  {/* Campo de input con tags inline */}
                  <div
                    className="flex min-h-[3rem] flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition cursor-text"
                    onClick={() => document.getElementById("input-interes")?.focus()}
                  >
                    {intereses.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
                      >
                        {tag}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag); }}
                          className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-red-400 transition hover:bg-red-200 hover:text-red-800 text-[10px]"
                        >
                          ✕
                        </button>
                      </motion.span>
                    ))}
                    <input
                      id="input-interes"
                      type="text"
                      value={inputInteres}
                      onChange={(e) => setInputInteres(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={intereses.length === 0 ? "Ej: programación, música, diseño..." : "Agregar más..."}
                      className="min-w-[160px] flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {intereses.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-2">
                      Aún no has agregado intereses. ¡Empieza escribiendo arriba!
                    </p>
                  )}

                  {/* Botones Guardar / Cancelar */}
                  <div className="flex gap-3 pt-1">
                    <Button
                      onClick={handleGuardar}
                      disabled={guardando || intereses.length === 0}
                      className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {guardando ? (
                        <span className="flex items-center gap-2">
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Guardando...
                        </span>
                      ) : (
                        "💾 Guardar"
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelarEdicion}
                      variant="outline"
                      className="border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {/* ── MODO VISTA ── */}
              {!modoEdicion && (
                <div className="space-y-5">
                  {intereses.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                      <span className="text-3xl">🎯</span>
                      <p className="text-sm text-slate-500">
                        Aún no tienes intereses registrados.
                      </p>
                      <button
                        onClick={handleEditar}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        + Agregar ahora
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Tags en modo solo lectura */}
                      <div className="flex flex-wrap gap-2">
                        {intereses.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Feedback de guardado exitoso */}
                      <AnimatePresence>
                        {guardadoOk && (
                          <motion.p
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1.5 text-sm font-medium text-green-600"
                          >
                            <span className="text-base">✓</span> Intereses guardados correctamente
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Botón analizar */}
                      <button
                        onClick={handleAnalizarCarreras}
                        disabled={analizando}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:from-red-700 hover:to-rose-600 disabled:opacity-60"
                      >
                        {analizando ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Analizando...
                          </>
                        ) : (
                          <>🎓 Analizar posibles carreras</>
                        )}
                      </button>
                    </>
                  )}

                  {/* ── Resultado del análisis ── */}
                  <AnimatePresence>
                    {errorAnalisis && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                      >
                        {errorAnalisis}
                      </motion.div>
                    )}

                    {carrerasAnalizadas && carrerasAnalizadas.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 pt-6">
                          <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">
                              Carreras recomendadas para ti
                            </p>
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                              Resultados generados
                            </span>
                          </div>

                          <div className="space-y-3">
                            {carrerasAnalizadas.map((c, i) => (
                              <motion.div
                                key={c.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.09, type: "spring", stiffness: 260, damping: 24 }}
                                className="rounded-2xl border p-4"
                                style={{
                                  borderColor: c.color + "35",
                                  background:  c.color + "08",
                                }}
                              >
                                {/* Fila superior: emoji + nombre + porcentaje */}
                                <div className="mb-2.5 flex items-center gap-3">
                                  <span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl"
                                    style={{ background: c.color + "18" }}
                                  >
                                    {c.emoji}
                                  </span>
                                  <p className="flex-1 text-sm font-bold text-slate-900 leading-snug">
                                    {c.title}
                                  </p>
                                  <span
                                    className="shrink-0 text-xl font-black tabular-nums"
                                    style={{ color: c.color }}
                                  >
                                    {c.porcentaje}%
                                  </span>
                                </div>

                                {/* Barra de progreso */}
                                <div className="mb-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}99)` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${c.porcentaje}%` }}
                                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 + i * 0.09 }}
                                  />
                                </div>

                                {/* Razón */}
                                <p className="text-xs leading-relaxed text-slate-500">{c.razon}</p>
                              </motion.div>
                            ))}
                          </div>

                          <p className="mt-4 text-center text-xs text-slate-400">
                            Análisis generado por IA · Los resultados son orientativos
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ── Selector de Carrera ── */}
            {user && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600 mb-4">
                  Carrera de interés
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Selecciona la carrera que te interesa para desbloquear el análisis de skills.
                </p>
                <select
                  value={profile.carrera || ""}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setProfile((prev) => ({ ...prev, carrera: value || undefined }));
                    try {
                      await updateDoc(doc(db, colUsuario, user.uid), { carrera: value });
                    } catch { /* silent */ }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                >
                  <option value="">— Selecciona una carrera —</option>
                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ── Skills Assessment ── */}
            {user && profile.carrera && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
                <SkillAssessment userId={user.uid} careerId={profile.carrera} />
              </div>
            )}

            {/* ── Skill Gap Dashboard ── */}
            {user && profile.carrera && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
                <SkillGapDashboard userId={user.uid} careerId={profile.carrera} />
              </div>
            )}

            {/* ── Proceso de admisión ── */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                Proceso de admisión
              </p>
              <ol className="mt-6 space-y-0">
                {ETAPAS_ADMISION.map((etapa, index) => {
                  const isDone    = currentEtapaIndex >= 0 && index < currentEtapaIndex;
                  const isCurrent = index === currentEtapaIndex;
                  const isLast    = index === ETAPAS_ADMISION.length - 1;
                  return (
                    <li key={etapa.id} className="relative flex gap-4 pb-8 last:pb-0">
                      {!isLast && (
                        <span
                          className={`absolute left-[15px] top-8 h-full w-[2px] ${isDone ? "bg-red-400" : "bg-slate-200"}`}
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isDone
                            ? "bg-red-600 text-white"
                            : isCurrent
                            ? "border-2 border-red-600 bg-white text-red-600"
                            : "border-2 border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="pt-1">
                        <p className={`text-base font-semibold ${isCurrent ? "text-red-700" : isDone ? "text-slate-900" : "text-slate-500"}`}>
                          {etapa.label}
                        </p>
                        {isCurrent && (
                          <p className="mt-1 text-sm text-slate-500">Estás en esta etapa actualmente.</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {currentEtapaIndex < 0 && (
                <p className="mt-2 text-sm text-slate-500">
                  Aún no se ha registrado tu avance en el proceso de admisión.
                </p>
              )}
            </div>

            {/* ── Consejos rápidos ── */}
            <div className="rounded-[2rem] border border-slate-200 bg-red-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                Consejos rápidos
              </p>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li>1. Revisa tu correo para información del proceso de admisión.</li>
                <li>2. Completa tu perfil en caso tengas más datos disponibles.</li>
                <li>3. Usa el menú de Recursos para explorar carreras y admisión UTP.</li>
              </ul>
            </div>
          </div>

          {/* ── Columna derecha (aside) ── */}
          <aside className="space-y-6">
            {/* ── Avatar del usuario ── */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-4">
                <div className="overflow-hidden rounded-2xl ring-2 ring-slate-100 flex-shrink-0">
                  {(avatarConfig?.avatarType ?? "dino") === "dino"
                    ? <DinosaurSVG career={avatarConfig?.careerCosmetic?.career ?? null} size={88} />
                    : <AvatarSVG
                        config={avatarConfig ?? {
                          skinTone: "medium-light",
                          hairStyle: "medium",
                          hairColor: "black",
                          eyeColor: "brown",
                          outfitBase: "casual",
                          background: "sky",
                          unlockedCareers: [],
                        }}
                        size={88}
                      />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                    Tu avatar
                  </p>
                  {avatarConfig?.careerCosmetic ? (
                    <p className="mt-1 truncate text-sm font-bold text-slate-900">
                      {avatarConfig.careerCosmetic.badge} {avatarConfig.careerCosmetic.label}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">Sin carrera asignada aún</p>
                  )}
                  {avatarConfig?.unlockedCareers && avatarConfig.unlockedCareers.length > 1 && (
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {avatarConfig.unlockedCareers.length} cosméticos desbloqueados
                    </p>
                  )}
                  <a
                    href="/avatar-test"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    🎨 Personalizar
                  </a>
                </div>
              </div>

              {/* Cosméticos desbloqueados como mini íconos */}
              {avatarConfig?.unlockedCareers && avatarConfig.unlockedCareers.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Cosméticos desbloqueados
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {avatarConfig.unlockedCareers.map((key) => {
                      // Import CAREER_COSMETICS inline not possible, use stored data from config
                      const isActive = avatarConfig.careerCosmetic?.career === key;
                      return (
                        <span
                          key={key}
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize transition ${
                            isActive
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {key}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-red-600 to-rose-500 p-6 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.24em]">Estado de perfil</p>
              <p className="mt-4 text-3xl font-bold">Activo</p>
              <p className="mt-3 text-sm text-red-100">
                Tu cuenta está registrada y has iniciado sesión correctamente.
              </p>
            </div>
>>>>>>> Stashed changes

            {activeSection === "intereses" && user && (
              <SeccionIntereses
                user={user}
                colUsuario={colUsuario}
                intereses={intereses}
                setIntereses={setIntereses}
              />
            )}

            {activeSection === "skills" && user && (
              <SeccionSkills
                user={user}
                colUsuario={colUsuario}
                carrera={profile.carrera}
                setCarrera={(value) => setProfile((prev) => ({ ...prev, carrera: value }))}
              />
            )}

            {activeSection === "admision" && (
              <SeccionAdmision profile={profile} />
            )}

            {activeSection === "logros" && (
              <SeccionLogros
                badges={badges}
                totalXp={totalXp}
                totalUnlocked={totalUnlocked}
                totalAvailable={totalAvailable}
                badgesLoading={badgesLoading}
                careerStats={careerStats}
                historyLoading={historyLoading}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
