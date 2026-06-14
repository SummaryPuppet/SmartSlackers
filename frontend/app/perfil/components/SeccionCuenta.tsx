"use client";

import { motion } from "framer-motion";
import { Profile, TestHistoryEntry } from "../page";
import { AvatarConfig, Career } from "@/types/avatar";
import AvatarSVG from "@/app/components/avatar/AvatarSVG";
import DinosaurSVG from "@/app/components/avatar/DinosaurSVG";
import { CAREER_COSMETICS } from "@/lib/careerCosmetics";
import { useTranslation } from "@/lib/i18n";
import { Timestamp } from "firebase/firestore";

const formatDate = (value: unknown, t: (key: string) => string) => {
  if (!value) return t("common.noDisponible");
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleDateString("es-PE", {
      day: "2-digit", month: "long", year: "numeric",
    });
  }
  try {
    return new Date(value as string).toLocaleDateString("es-PE", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch {
    return t("common.noDisponible");
  }
};

interface SeccionCuentaProps {
  profile: Profile;
  getInitials: (name: string) => string;
  avatarConfig: AvatarConfig | null;
  testHistory: TestHistoryEntry[];
  historyLoading: boolean;
  inProgressTest: { current: number; answeredCount: number } | null;
}

export default function SeccionCuenta({
  profile,
  getInitials,
  avatarConfig,
  testHistory,
  historyLoading,
  inProgressTest,
}: SeccionCuentaProps) {
  const { t } = useTranslation();

  const datosAdicionales: { label: string; key: keyof Profile }[] = [
    { label: t("perfil.carreraInteres"), key: "carrera"  },
    { label: t("perfil.dni"),            key: "dni"      },
    { label: t("perfil.telefono"),       key: "telefono" },
    { label: t("perfil.modalidadIngreso"), key: "modalidad" },
    { label: t("perfil.sede"),           key: "sede"     },
  ];

  const extras = datosAdicionales.filter((d) => profile[d.key]);

  return (
    <div className="space-y-6">
      {/* ── Card de estado ── */}
      <div className="rounded-[2rem] bg-gradient-to-br from-red-600 to-rose-500 p-6 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.24em]">{t("perfil.estadoPerfil")}</p>
        <p className="mt-4 text-3xl font-bold">{t("perfil.activo")}</p>
        <p className="mt-3 text-sm text-red-100">
          {t("perfil.cuentaRegistrada")}
        </p>
      </div>

      {/* ── Avatar del usuario ── */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-4">
          <div className="overflow-hidden rounded-2xl ring-2 ring-slate-100 flex-shrink-0">
            {(avatarConfig?.avatarType ?? "dino") === "dino"
              ? <DinosaurSVG career={avatarConfig?.careerCosmetic?.career ?? null} size={88} />
              : <AvatarSVG
                  config={avatarConfig ?? {
                    skinTone: "medium-light", hairStyle: "medium", hairColor: "black",
                    eyeColor: "brown", outfitBase: "casual", background: "sky", unlockedCareers: [],
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

        {avatarConfig?.unlockedCareers && avatarConfig.unlockedCareers.length > 0 && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Cosméticos desbloqueados
            </p>
            <div className="flex flex-wrap gap-1.5">
              {avatarConfig.unlockedCareers.map((key) => {
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

      {/* ── Datos personales ── */}
      <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
          {t("perfil.datosPersonales")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: t("perfil.nombre"),        value: profile.nombre        },
            { label: t("perfil.correo"),        value: profile.email         },
            { label: t("perfil.rol"),           value: profile.rol           },
            { label: t("perfil.fechaRegistro"), value: profile.fechaRegistro },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
              <p className="mt-3 break-all text-xl font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        {extras.length > 0 && (
          <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            {extras.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{profile[item.key] as string}</p>
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

        {inProgressTest && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"
          >
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
              const isDino = (avatarConfig?.avatarType ?? "dino") === "dino";
              const cosmetic = CAREER_COSMETICS[entry.careerKey as Career] ?? null;
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
                      {entry.completedAt ? formatDate(entry.completedAt, t) : "Fecha desconocida"}
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
    </div>
  );
}
