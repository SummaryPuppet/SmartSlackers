"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { login, register } from "../../src/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    try {
      if (!name.trim()) {
        alert("Ingresa tu nombre");
        return;
      }

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      const result = await register(email, password, name);
      document.cookie = `vocatio_session=${result.user.uid}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      alert("Usuario registrado correctamente");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await login(email, password);
      document.cookie = `vocatio_session=${result.user.uid}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      alert("Inicio de sesión exitoso");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.18),transparent_20%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.14),transparent_20%),linear-gradient(180deg,#fff1f2_0%,#fef2f2_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-16 h-72 w-72 rounded-full bg-red-300/30 blur-3xl" />
        <div className="absolute right-10 top-28 h-80 w-80 rounded-full bg-rose-300/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid w-full gap-10 overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:grid-cols-[1.1fr_0.9fr] sm:p-10"
        >
          <div className="flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-red-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-red-700">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                Vocatio AI
              </div>
              <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Bienvenido al hub vocacional más dinámico
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Un inicio de sesión moderno con los tonos y la energía del sistema. Aquí comienza tu camino hacia la UTP con mentoría, recursos y admisión.
              </p>
            </div>

            <div className="flex items-center justify-center">
              {/* Image placeholder: place your uploaded image at `public/assets/login-cards.png` */}
              <img
                src="/assets/login-cards.png"
                alt="UTP banner"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  // Inline SVG fallback that looks like the original cards area
                  const svg = `
                    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>
                      <defs>
                        <linearGradient id='g' x1='0' x2='1'>
                          <stop offset='0' stop-color='%23ffecec'/>
                          <stop offset='1' stop-color='%23fff6ec'/>
                        </linearGradient>
                      </defs>
                      <rect x='0' y='0' width='1200' height='420' rx='28' fill='url(#g)' />
                      <rect x='40' y='36' width='520' height='140' rx='20' fill='%23fff1f2' stroke='%23fde6e8' />
                      <rect x='640' y='36' width='520' height='140' rx='20' fill='%23fff9f0' stroke='%23fff0e0' />
                      <rect x='40' y='200' width='1120' height='140' rx='24' fill='url(#g)' stroke='%23fde6e8' />
                      <text x='70' y='88' font-family='Georgia, serif' font-size='20' fill='%23c92a2a' letter-spacing='3'>RÁPIDO</text>
                      <text x='670' y='88' font-family='Georgia, serif' font-size='20' fill='%23d3591f' letter-spacing='3'>CONFIANZA</text>
                      <text x='70' y='252' font-family='Georgia, serif' font-size='20' fill='%23c92a2a' letter-spacing='3'>SUGERENCIA</text>
                    </svg>`;
                  target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
                }}
                className="w-full rounded-[1.75rem] object-cover shadow-sm max-h-56 sm:max-h-72"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative rounded-[2rem] border border-slate-200 bg-slate-50/95 p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Acceso</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">
                  {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                </h2>
              </div>
              <span className="inline-flex rounded-3xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">
                {isLogin ? "Usuario existente" : "Nuevo usuario"}
              </span>
            </div>

            <div className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={isLogin ? handleLogin : handleRegister}
                className="w-full rounded-3xl bg-gradient-to-r from-red-700 via-rose-600 to-orange-500 py-4 text-base font-semibold text-white shadow-[0_24px_60px_rgba(220,38,38,0.22)] transition duration-200 hover:shadow-[0_28px_70px_rgba(220,38,38,0.28)]"
              >
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </motion.button>

              <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <p>{isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}</p>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-red-700 font-semibold transition hover:text-red-900"
                >
                  {isLogin ? "Registrarse" : "Iniciar sesión"}
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-xs uppercase tracking-[0.24em] text-slate-400">
              VocatioAI © 2026
            </p>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
