"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/src/firebase/config";
import { doc, getDoc, Timestamp, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { Button } from "@/components/ui/button";
import { AvatarConfig } from "@/types/avatar";
import { loadAvatar } from "@/src/services/avatarService";
import PerfilSidebar, { SeccionId } from "./components/PerfilSidebar";
import SeccionCuenta from "./components/SeccionCuenta";
import SeccionIntereses from "./components/SeccionIntereses";
import SeccionSkills from "./components/SeccionSkills";
import SeccionAdmision from "./components/SeccionAdmision";
import SeccionLogros from "./components/SeccionLogros";
import SeccionHistorial from "./components/SeccionHistorial";
import { useTranslation } from "@/lib/i18n";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Helpers ────────────────────────────────────────────────────────────────

const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
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
    nombre: "", email: "", rol: "Estudiante", fechaRegistro: "",
  });
  const [loading, setLoading] = useState(true);

  // Intereses
  const [intereses, setIntereses] = useState<string[]>([]);

  // Avatar
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);

  // Test history
  const [testHistory, setTestHistory] = useState<TestHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [inProgressTest, setInProgressTest] = useState<{ current: number; answeredCount: number } | null>(null);

  // Badges
  const [badges, setBadges]                 = useState<any[]>([]);
  const [totalXp, setTotalXp]               = useState(0);
  const [totalUnlocked, setTotalUnlocked]   = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [badgesLoading, setBadgesLoading]   = useState(true);

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
    let unsubTests: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) { router.push("/login"); return; }

      // Limpiar listener anterior si existía
      unsubTests?.();

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
        fechaRegistro: foundProfile?.fechaRegistro
          ? (() => {
              const v = foundProfile.fechaRegistro;
              if (v instanceof Timestamp) return v.toDate().toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
              try { return new Date(v as string).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" }); } catch { return t("common.noDisponible"); }
            })()
          : t("common.noDisponible"),
        carrera:       (foundProfile?.carrera       as string) || undefined,
        telefono:      (foundProfile?.telefono      as string) || undefined,
        dni:           (foundProfile?.dni           as string) || undefined,
        modalidad:     (foundProfile?.modalidad     as string) || undefined,
        sede:          (foundProfile?.sede          as string) || undefined,
        etapaAdmision: (foundProfile?.etapaAdmision as string) || undefined,
      });

      setIntereses((foundProfile?.intereses as string[]) || []);

      // Badges (one-time, se actualiza poco)
      try {
        const { fetchUserBadges } = await import("@/src/services/badgeService");
        const badgeData = await fetchUserBadges(currentUser.uid);
        setBadges(badgeData.badges);
        setTotalXp(badgeData.totalXp);
        setTotalUnlocked(badgeData.totalUnlocked);
        setTotalAvailable(badgeData.totalAvailable);
      } catch { /* badges are optional */ } finally {
        setBadgesLoading(false);
      }

      // Historial de tests — listener en tiempo real
      try {
        unsubTests = onSnapshot(
          query(
            collection(db, foundCol, currentUser.uid, "historialTests"),
            orderBy("completedAt", "desc"),
            limit(10),
          ),
          (histSnap) => {
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
            setTestHistory(history);
            setHistoryLoading(false);
          },
          () => setHistoryLoading(false),
        );
      } catch { /* historial es opcional */ }

      // Avatar
      try {
        const saved = await loadAvatar(currentUser.uid);
        if (saved) setAvatarConfig(saved.config);
      } catch { /* avatar es opcional */ }

      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubTests?.();
    };
  }, [router, t]);

  // Test en progreso desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vocatio_test_session");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.answers) && data.answers.length > 0 && data.current < 10) {
        setInProgressTest({
          current: data.current,
          answeredCount: data.answers.filter((a: string) => a !== "none").length,
        });
      }
    } catch { /* ignore */ }
  }, []);

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

        {/* ── Layout: sidebar + contenido ── */}
        <div className="flex gap-8 items-start">
          {/* Sidebar desktop */}
          <div className="hidden lg:block">
            <PerfilSidebar active={activeSection} onChange={setActiveSection} />
          </div>

          {/* Contenido de la sección activa */}
          <div className="flex-1 min-w-0 space-y-8">
            {activeSection === "cuenta" && (
              <SeccionCuenta
                profile={profile}
                getInitials={getInitials}
                avatarConfig={avatarConfig}
                testHistory={testHistory}
                historyLoading={historyLoading}
                inProgressTest={inProgressTest}
              />
            )}

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

            {activeSection === "historial" && user && (
              <SeccionHistorial
                user={user}
                colUsuario={colUsuario}
              />
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
