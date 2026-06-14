"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AvatarSVG from "./AvatarSVG";
import type { AvatarConfig, Career } from "@/types/avatar";
import { SKIN_TONES, HAIR_COLORS, EYE_COLORS, CAREER_COSMETICS } from "@/lib/careerCosmetics";
import { auth } from "@/src/firebase/config";
import { saveAvatar, loadAvatar } from "@/src/services/avatarService";
import { useAuthState } from "react-firebase-hooks/auth";

const DEFAULT_CONFIG: AvatarConfig = {
  skinTone: "medium-light",
  hairStyle: "medium",
  hairColor: "black",
  eyeColor: "brown",
  outfitBase: "casual",
  background: "sky",
  unlockedCareers: [],
};

interface AvatarCustomizerProps {
  /** Si se pasa careerResult, aplica el cosmético automáticamente */
  careerResult?: Career | null;
  /** Callback opcional al guardar */
  onSaved?: () => void;
  /** Configuración controlada opcional */
  config?: AvatarConfig;
  /** Se llama cuando cambia la configuración */
  onChange?: (config: AvatarConfig) => void;
  /** Deshabilita la edición */
  disabled?: boolean;
}

export default function AvatarCustomizer({
  careerResult,
  onSaved,
  config: configProp,
  onChange: onChangeProp,
  disabled = false,
}: AvatarCustomizerProps) {
  const [user] = useAuthState(auth);
  const [config, setConfig] = useState<AvatarConfig>(configProp ?? DEFAULT_CONFIG);

  useEffect(() => {
    if (configProp) {
      setConfig(configProp);
    }
  }, [configProp]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cargar avatar guardado
  useEffect(() => {
    if (!user) return;
    loadAvatar(user.uid).then((saved) => {
      if (!saved) return;
      setConfig((prev) => {
        const loaded = saved.config;
        const unlocked = loaded.unlockedCareers?.length
          ? loaded.unlockedCareers
          : loaded.careerCosmetic
            ? [loaded.careerCosmetic.career]
            : [];

        const selectedCosmetic = loaded.careerCosmetic ??
          (unlocked.length ? CAREER_COSMETICS[unlocked[0]] : undefined);

        return {
          ...loaded,
          unlockedCareers: unlocked,
          careerCosmetic: selectedCosmetic,
          background: selectedCosmetic ? selectedCosmetic.background : loaded.background,
        };
      });
    });
  }, [user]);

  // Agregar cosmético desbloqueado cuando llega careerResult
  useEffect(() => {
    if (!careerResult) return;
    const cosmetic = CAREER_COSMETICS[careerResult];
    if (!cosmetic) return;

    setConfig((prev) => {
      const unlocked = Array.from(
        new Set([...(prev.unlockedCareers ?? []), careerResult])
      );

      return {
        ...prev,
        unlockedCareers: unlocked,
        background: cosmetic.background,
        careerCosmetic: cosmetic,
      };
    });
  }, [careerResult]);

  function update<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) {
    const nextConfig = { ...config, [key]: value };
    setConfig(nextConfig);
    onChangeProp?.(nextConfig);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await saveAvatar(user.uid, config);
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  const accentColor = config.careerCosmetic?.accentColor ?? "#7F77DD";

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-center p-6 max-w-4xl mx-auto">

      {/* Avatar preview */}
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-bold">Tu Avatar</h3>
        <motion.div
          className="rounded-2xl overflow-hidden border border-border shadow-inner"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <AvatarSVG config={config} size={240} />
        </motion.div>

        <div className="grid grid-cols-1 gap-4 w-full">
          {/* Badge de carrera */}
          {config.careerCosmetic && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="text-sm font-semibold px-4 py-1 rounded-full text-white"
                style={{ backgroundColor: accentColor }}
              >
                {config.careerCosmetic.badge} {config.careerCosmetic.label}
              </span>
              <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                {config.careerCosmetic.description}
              </p>
            </motion.div>
          )}

          {/* Selector de cosméticos desbloqueados */}
          {(config.unlockedCareers?.length ?? 0) > 1 && (
            <div className="p-4 rounded-2xl border border-border bg-background">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
                Cosméticos desbloqueados
              </p>
              <div className="flex flex-wrap gap-2">
                {config.unlockedCareers?.map((careerKey) => {
                  const unlocked = CAREER_COSMETICS[careerKey];
                  const isActive = config.careerCosmetic?.career === careerKey;
                  return (
                    <motion.button
                      key={careerKey}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setConfig((prev) => ({
                          ...prev,
                          careerCosmetic: unlocked,
                          background: unlocked.background,
                        }));
                      }}
                      className={`px-3 py-2 rounded-full text-xs font-semibold transition ${isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                      style={isActive ? { boxShadow: "0 10px 24px rgba(15,23,42,0.16)" } : undefined}
                    >
                      {unlocked.badge} {unlocked.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Guardar */}
        {user ? (
          <motion.button
            onClick={handleSave}
<<<<<<< Updated upstream
            disabled={saving || disabled}
=======
            disabled={saving}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
>>>>>>> Stashed changes
            className="w-full max-w-[200px] py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: accentColor }}
          >
            {saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar avatar"}
          </motion.button>
        ) : (
          <p className="text-xs text-muted-foreground">Inicia sesión para guardar</p>
        )}
      </div>

      {/* Panel de personalización */}
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Tabs defaultValue="skin" className="w-full">
            <TabsList className="grid grid-cols-3 gap-4 mb-4 justify-items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <TabsTrigger value="skin">Piel</TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <TabsTrigger value="hair">Cabello</TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <TabsTrigger value="style">Estilo</TabsTrigger>
              </motion.div>
            </TabsList>

            {/* Piel */}
            <TabsContent value="skin" className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Tono de piel</p>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(SKIN_TONES).map(([key, { fill, label }]) => (
                    <motion.button
                      key={key}
                      title={label}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${config.skinTone === key ? "border-primary scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: fill }}
                      onClick={() => update("skinTone", key as AvatarConfig["skinTone"])}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Color de ojos</p>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(EYE_COLORS).map(([key, { fill, label }]) => (
                    <motion.button
                      key={key}
                      title={label}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${config.eyeColor === key ? "border-primary scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: fill }}
                      onClick={() => update("eyeColor", key as AvatarConfig["eyeColor"])}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Cabello */}
            <TabsContent value="hair" className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Estilo</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["short","medium","long","curly","bun","braids"] as const).map((s) => (
                    <motion.button key={s}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`p-2 text-xs rounded-lg border capitalize transition-colors ${config.hairStyle === s ? "border-primary bg-primary/10 font-medium" : "border-border bg-background"}`}
                      onClick={() => update("hairStyle", s)}
                    >
                      {{"short":"Corto","medium":"Medio","long":"Largo","curly":"Rizado","bun":"Moño","braids":"Trenzas"}[s]}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Color</p>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(HAIR_COLORS).map(([key, { fill, label }]) => (
                    <motion.button
                      key={key}
                      title={label}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${config.hairColor === key ? "border-primary scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: fill }}
                      onClick={() => update("hairColor", key as AvatarConfig["hairColor"])}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Estilo */}
            <TabsContent value="style" className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Ropa</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { v: "casual",  l: "Casual",    c: "#7F77DD" },
                    { v: "formal",  l: "Formal",    c: "#185FA5" },
                    { v: "sporty",  l: "Deportivo", c: "#1D9E75" },
                  ] as const).map(({ v, l, c }) => (
                    <motion.button key={v}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`p-2 text-xs rounded-lg border flex items-center gap-2 transition-colors ${config.outfitBase === v ? "border-primary bg-primary/10 font-medium" : "border-border bg-background"}`}
                      onClick={() => update("outfitBase", v)}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />
                      {l}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Fondo</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { v: "sky",      l: "Cielo",       c: "#E6F1FB" },
                    { v: "library",  l: "Biblioteca",  c: "#FAEEDA" },
                    { v: "lab",      l: "Laboratorio", c: "#E1F5EE" },
                    { v: "city",     l: "Ciudad",      c: "#B5D4F4" },
                    { v: "nature",   l: "Naturaleza",  c: "#EAF3DE" },
                    { v: "abstract", l: "Abstracto",   c: "#EEEDFE" },
                  ] as const).map(({ v, l, c }) => (
                    <motion.button key={v}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`p-2 text-xs rounded-lg border flex items-center gap-2 transition-colors ${config.background === v ? "border-primary bg-primary/10 font-medium" : "border-border bg-background"}`}
                      onClick={() => update("background", v)}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />
                      {l}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Cosmético activo (solo lectura) */}
              {config.careerCosmetic && (
                <div className="p-3 rounded-xl border border-violet-200 bg-violet-50 dark:bg-violet-950 dark:border-violet-800">
                  <p className="text-xs font-medium text-violet-500 uppercase tracking-wider mb-1">
                    Cosmético vocacional
                  </p>
                  <p className="text-sm font-semibold text-violet-800 dark:text-violet-200">
                    {config.careerCosmetic.label}
                  </p>
                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
                    {config.careerCosmetic.description}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
