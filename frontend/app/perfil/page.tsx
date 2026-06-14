"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { doc, getDoc, updateDoc, Timestamp, getDocs, query, collection, orderBy, limit } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { careers } from "@/lib/careers";
import { UserBadge } from "@/lib/badges";
import { fetchUserBadges } from "@/src/services/badgeService";
import BadgeDisplay from "@/app/components/BadgeDisplay";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (value: unknown) => {
  if (!value) return "No disponible";
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
    return "No disponible";
  }
};

const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// ─── Types ───────────────────────────────────────────────────────────────────

type Profile = {
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

type CarreraAnalizada = {
  title: string;
  emoji: string;
  color: string;
  porcentaje: number;
  razon: string;
};

type TestHistoryEntry = {
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

// ─── Admisión steps ──────────────────────────────────────────────────────────

const ETAPAS_ADMISION = [
  { id: "registro",    label: "Registro de postulante" },
  { id: "documentos", label: "Carga de documentos" },
  { id: "examen",     label: "Examen de admisión" },
  { id: "resultado",  label: "Resultado" },
  { id: "matricula",  label: "Matrícula" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const router = useRouter();

  // Auth & profile
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({
    nombre: "",
    email: "",
    rol: "Estudiante",
    fechaRegistro: "",
  });
  const [loading, setLoading] = useState(true);

  // Intereses state
  const [intereses,         setIntereses]         = useState<string[]>([]);
  const [inputInteres,      setInputInteres]       = useState("");
  const [modoEdicion,       setModoEdicion]        = useState(false);   // false = vista, true = edición
  const [guardando,         setGuardando]          = useState(false);
  const [guardadoOk,        setGuardadoOk]         = useState(false);

  // Análisis de carreras
  const [analizando,        setAnalizando]         = useState(false);
  const [carrerasAnalizadas, setCarrerasAnalizadas] = useState<CarreraAnalizada[] | null>(null);
  const [errorAnalisis,     setErrorAnalisis]      = useState<string | null>(null);

  // Test history
  const [testHistory, setTestHistory]         = useState<TestHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading]   = useState(true);
  const [inProgressTest, setInProgressTest]   = useState<{
    current: number; answeredCount: number; savedAt: number;
  } | null>(null);

  // Top-2 carreras por promedio de match (tests completados únicamente)
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

  // Lee el test en progreso desde localStorage (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vocatio_test_session");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.answers) && data.answers.length > 0 && data.current < 10) {
        setInProgressTest({
          current:       data.current,
          answeredCount: data.answers.filter((a: string) => a !== "none").length,
          savedAt:       data.savedAt ?? Date.now(),
        });
      }
    } catch { /* ignore */ }
  }, []);

  // Badges
  const [badges, setBadges]                   = useState<UserBadge[]>([]);
  const [totalXp, setTotalXp]                 = useState(0);
  const [totalUnlocked, setTotalUnlocked]     = useState(0);
  const [totalAvailable, setTotalAvailable]   = useState(0);
  const [badgesLoading, setBadgesLoading]     = useState(true);

  // Colección en Firestore donde está el usuario (se detecta al cargar)
  const [colUsuario, setColUsuario] = useState<string>("usuarios");

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
        fechaRegistro: foundProfile?.fechaRegistro  ? formatDate(foundProfile.fechaRegistro) : "No disponible",
        carrera:       (foundProfile?.carrera       as string) || undefined,
        telefono:      (foundProfile?.telefono      as string) || undefined,
        dni:           (foundProfile?.dni           as string) || undefined,
        modalidad:     (foundProfile?.modalidad     as string) || undefined,
        sede:          (foundProfile?.sede          as string) || undefined,
        etapaAdmision: (foundProfile?.etapaAdmision as string) || undefined,
      });

      // Carga los intereses guardados
      setIntereses((foundProfile?.intereses as string[]) || []);

      // Carga badges del usuario
      try {
        const badgeData = await fetchUserBadges(currentUser.uid);
        setBadges(badgeData.badges);
        setTotalXp(badgeData.totalXp);
        setTotalUnlocked(badgeData.totalUnlocked);
        setTotalAvailable(badgeData.totalAvailable);
      } catch {
        // badges are optional, fail silently
      } finally {
        setBadgesLoading(false);
      }

      // Carga historial de tests
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

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    try { await signOut(auth); } catch { /* ignore */ } finally { router.push("/login"); }
  };

  const handleVolver = () => {
    if (window.history.length > 1) router.back();
    else router.push("/recursos");
  };

  // Agrega tag al presionar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputInteres.trim()) {
      const nuevo = inputInteres.trim();
      if (!intereses.includes(nuevo)) setIntereses((prev) => [...prev, nuevo]);
      setInputInteres("");
      setGuardadoOk(false);
    }
    // Elimina último tag con Backspace si el input está vacío
    if (e.key === "Backspace" && !inputInteres && intereses.length > 0) {
      setIntereses((prev) => prev.slice(0, -1));
      setGuardadoOk(false);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setIntereses((prev) => prev.filter((i) => i !== tag));
    setGuardadoOk(false);
  };

  const handleGuardar = async () => {
    if (!user) return;
    setGuardando(true);
    try {
      await updateDoc(doc(db, colUsuario, user.uid), { intereses });
      setGuardadoOk(true);
      setModoEdicion(false);
      // Limpia el feedback visual luego de 3s
      setTimeout(() => setGuardadoOk(false), 3000);
    } catch (e) {
      console.error("Error guardando intereses:", e);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = () => {
    setModoEdicion(true);
    setGuardadoOk(false);
    setCarrerasAnalizadas(null);
    setErrorAnalisis(null);
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setInputInteres("");
  };

  // Llama a la API route de Next.js que usa Groq server-side
  const handleAnalizarCarreras = async () => {
    if (intereses.length === 0) return;
    setAnalizando(true);
    setCarrerasAnalizadas(null);
    setErrorAnalisis(null);

    try {
      const carrerasPayload = careers.map((c) => ({
        id:          c.id,
        title:       c.title,
        emoji:       c.emoji,
        color:       c.color,
        description: c.description,
        skills:      c.skills,
        tools:       c.tools ?? [],
      }));

      const res = await fetch("/api/analizar-carreras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intereses, carreras: carrerasPayload }),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      const { resultado } = await res.json();

      // Enriquecer con emoji y color desde la lista local de carreras
      const enriquecidas: CarreraAnalizada[] = (resultado as { id: string; porcentaje: number; razon: string }[])
        .map((item) => {
          const carrera = careers.find((c) => c.id === item.id);
          if (!carrera) return null;
          return {
            title:      carrera.title,
            emoji:      carrera.emoji,
            color:      carrera.color,
            porcentaje: item.porcentaje,
            razon:      item.razon,
          };
        })
        .filter(Boolean) as CarreraAnalizada[];

      setCarrerasAnalizadas(enriquecidas);
    } catch (e) {
      console.error(e);
      setErrorAnalisis("Ocurrió un error al analizar las carreras. Intenta de nuevo.");
    } finally {
      setAnalizando(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Cargando perfil...
          </p>
        </div>
      </main>
    );
  }

  const currentEtapaIndex = ETAPAS_ADMISION.findIndex((e) => e.id === profile.etapaAdmision);

  const datosAdicionales: { label: string; value?: string }[] = [
    { label: "Carrera de interés",   value: profile.carrera  },
    { label: "DNI",                  value: profile.dni      },
    { label: "Teléfono",             value: profile.telefono },
    { label: "Modalidad de ingreso", value: profile.modalidad },
    { label: "Sede",                 value: profile.sede     },
  ].filter((item) => item.value);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-red-50 to-slate-100 text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">

        {/* ── Encabezado ── */}
        <div className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-red-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(220,38,38,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-red-600 to-rose-500 text-2xl font-bold text-white shadow-lg shadow-red-600/30">
                {getInitials(profile.nombre)}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                  Perfil del estudiante
                </p>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                  {profile.nombre}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Aquí encontrarás toda la información disponible de tu cuenta y tu proceso de admisión.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
              <Button onClick={handleVolver} variant="outline">← Volver</Button>
              <Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>

        {/* ── Grid principal ── */}
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

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

            {/* ── Test en progreso ── */}
            {inProgressTest && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border-2 border-amber-300 bg-amber-50 p-6 shadow-[0_22px_70px_rgba(251,191,36,0.15)]"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                    ⏳
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900">Test Vocacional en progreso</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Ibas por la pregunta{" "}
                      <strong>{inProgressTest.current + 1} de 10</strong>
                      {" "}·{" "}
                      <strong>{inProgressTest.answeredCount}</strong>{" "}
                      {inProgressTest.answeredCount === 1 ? "respuesta" : "respuestas"} registradas
                    </p>
                    <p className="text-[11px] text-amber-600 mt-0.5">
                      Guardado el{" "}
                      {new Date(inProgressTest.savedAt).toLocaleDateString("es-PE", {
                        day: "2-digit", month: "long",
                      })}
                    </p>
                  </div>
                </div>
                {/* Barra de progreso */}
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-amber-200">
                  <motion.div
                    className="h-full rounded-full bg-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(inProgressTest.current / 10) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <a
                  href="/test"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-amber-600"
                >
                  ▶ Continuar el test ahora
                </a>
              </motion.div>
            )}

            {/* ── Historial de Test Vocacional ── */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                  Historial de test vocacional
                </p>
                <a
                  href="/test"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-200"
                >
                  + Nuevo test
                </a>
              </div>

              {historyLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : testHistory.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                  <span className="text-3xl">🎯</span>
                  <p className="text-sm text-slate-500">Aún no has realizado el test vocacional.</p>
                  <a
                    href="/test"
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Hacer el test ahora
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {testHistory.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={`rounded-2xl border p-4 ${
                        entry.insufficient
                          ? "border-slate-200 bg-slate-50"
                          : "border-red-100 bg-red-50/40"
                      }`}
                    >
                      {/* Fila superior */}
                      <div className="mb-2.5 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl leading-none">
                            {entry.insufficient ? "😔" : entry.careerEmoji ?? "🎓"}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">
                              {entry.insufficient
                                ? "Sin resultado suficiente"
                                : entry.careerTitle ?? "Carrera detectada"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {entry.completedAt
                                ? formatDate(entry.completedAt)
                                : "Fecha no disponible"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            entry.insufficient
                              ? "bg-slate-200 text-slate-600"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {entry.insufficient ? "Insuficiente" : "Completado ✓"}
                        </span>
                      </div>

                      {/* Barra de compatibilidad (solo si hay resultado) */}
                      {!entry.insufficient && entry.match !== null && (
                        <>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-slate-500">Compatibilidad</span>
                            <span className="text-xs font-bold text-red-600">{entry.match}%</span>
                          </div>
                          <div className="mb-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${entry.match}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + i * 0.07 }}
                            />
                          </div>
                        </>
                      )}

                      {/* Detalle inferior */}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {entry.insufficient ? (
                          <span>
                            Respondidas: <strong className="text-slate-700">{entry.answered}/10</strong>
                          </span>
                        ) : (
                          <>
                            <span>
                              Puntaje: <strong className="text-slate-700">{entry.score} pts</strong>
                            </span>
                            <span>·</span>
                            <a
                              href={`/roadmap?career=${entry.careerKey}`}
                              className="font-semibold text-red-600 hover:underline"
                            >
                              Ver roadmap →
                            </a>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

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
            <div className="rounded-[2rem] bg-gradient-to-br from-red-600 to-rose-500 p-6 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.24em]">Estado de perfil</p>
              <p className="mt-4 text-3xl font-bold">Activo</p>
              <p className="mt-3 text-sm text-red-100">
                Tu cuenta está registrada y has iniciado sesión correctamente.
              </p>
            </div>

            {/* ── Círculo de estadísticas vocacionales ── */}
            {!historyLoading && careerStats && careerStats.length > 0 && (() => {
              const R = 58;
              const CIRC = 2 * Math.PI * R;
              const top = careerStats[0];
              const second = careerStats[1] ?? null;
              return (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
                  <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                    Tu perfil vocacional
                  </p>

                  {/* Círculo principal */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <svg width="148" height="148" viewBox="0 0 148 148">
                        <defs>
                          <linearGradient id="cvGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#dc2626" />
                            <stop offset="100%" stopColor="#f87171" />
                          </linearGradient>
                        </defs>
                        {/* Track */}
                        <circle cx="74" cy="74" r={R} fill="none" stroke="#f1f5f9" strokeWidth="13" />
                        {/* Progreso */}
                        <motion.circle
                          cx="74" cy="74" r={R}
                          fill="none"
                          stroke="url(#cvGrad)"
                          strokeWidth="13"
                          strokeLinecap="round"
                          strokeDasharray={CIRC}
                          initial={{ strokeDashoffset: CIRC }}
                          animate={{ strokeDashoffset: CIRC * (1 - top.avgMatch / 100) }}
                          transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
                          transform="rotate(-90 74 74)"
                        />
                      </svg>
                      {/* Texto central */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl leading-none">{top.emoji}</span>
                        <span className="mt-1 text-2xl font-black text-red-600">{top.avgMatch}%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900">{top.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Basado en {top.count} test{top.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Segunda opción — levemente borrosa */}
                  {second && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Segunda opción
                      </p>
                      <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div
                          className="flex items-center gap-3"
                          style={{ filter: "blur(3.5px)", userSelect: "none", pointerEvents: "none" }}
                        >
                          {/* Mini círculo */}
                          <div className="relative flex-shrink-0">
                            <svg width="56" height="56" viewBox="0 0 56 56">
                              <circle cx="28" cy="28" r="20" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                              <circle
                                cx="28" cy="28" r="20"
                                fill="none"
                                stroke="#dc2626"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 20}
                                strokeDashoffset={2 * Math.PI * 20 * (1 - second.avgMatch / 100)}
                                transform="rotate(-90 28 28)"
                                opacity="0.65"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-black text-red-600">{second.avgMatch}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {second.emoji} {second.title}
                            </p>
                            <p className="text-xs text-slate-500">Segunda carrera más apta</p>
                          </div>
                        </div>
                        {/* Overlay con indicación */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 shadow-sm">
                            <span className="text-xs">🔍</span>
                            <span className="text-xs font-semibold text-slate-600">Haz más tests para revelar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">
                Acciones
              </p>
              <ul className="space-y-3 text-slate-700">
                <li>• Accede al menú de admisión para encontrar requisitos.</li>
                <li>• Ve tus recursos y carreras recomendadas.</li>
                <li>• Cierra sesión si usas un equipo compartido.</li>
              </ul>
            </div>

            <div className="space-y-3 rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Próximamente
              </p>
              <p className="text-sm leading-6 text-slate-600">
                Edición de datos del perfil, foto de cuenta y notificaciones sobre tu proceso de admisión.
              </p>
            </div>

            {/* ── Badges / Logros ── */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                  Badges y Logros
                </p>
                {totalXp > 0 && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1">
                    <span className="text-xs">⭐</span>
                    <span className="text-xs font-bold text-amber-700">{totalXp} XP</span>
                  </div>
                )}
              </div>

              {badgesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
                </div>
              ) : (
                <BadgeDisplay
                  badges={badges}
                  totalXp={totalXp}
                  totalUnlocked={totalUnlocked}
                  totalAvailable={totalAvailable}
                />
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}