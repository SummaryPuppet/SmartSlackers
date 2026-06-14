"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, register } from "../../src/services/authService";
import { hasAvatar } from "../../src/services/avatarService";
import { useRouter } from "next/navigation";

function SuccessModal({ message, onContinue }: { message: string; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center">¡Éxito!</h3>
        <p className="mt-2 text-sm text-slate-500 text-center">{message}</p>
        <button
          onClick={onContinue}
          className="mt-6 w-full rounded-xl bg-gradient-to-br from-red-500 to-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/25 transition hover:shadow-xl"
        >
          Continuar
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    setError("");

    if (!name.trim()) {
      setError("Ingresa tu nombre");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(email, password, name);
      document.cookie = `vocatio_session=${result.user.uid}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      setSuccessMessage("Usuario registrado correctamente");
      setShowSuccess(true);
      router.push("/avatar-setup");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await login(email, password);
      document.cookie = `vocatio_session=${result.user.uid}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      const avatarExists = await hasAvatar(result.user.uid);
      setSuccessMessage("Inicio de sesión exitoso");
      setShowSuccess(true);
      router.push(avatarExists ? "/" : "/avatar-setup");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
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
              <img
                src="/assets/login-cards.jpg"
                alt="UTP banner"
                loading="lazy"
                className="w-full rounded-[1.75rem] object-cover shadow-sm max-h-56 sm:max-h-72"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative flex flex-col justify-center gap-4 rounded-[2rem] border border-slate-200 bg-slate-50/95 p-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
          >
            {/* Campo Nombre (Solo si no es Login) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 mb-2"
                />
              </motion.div>
            )}

            {/* Campo Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 transition"
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 transition"
              />
            </div>

            {/* Campo Confirmar Contraseña (Solo si no es Login) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </motion.div>
            )}

            {/* Alerta de Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2"
                >
                  <svg className="h-4 w-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-600">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón Principal */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={isLogin ? handleLogin : handleRegister}
              disabled={isLoading}
              className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isLogin ? "Iniciando..." : "Creando cuenta..."}
                </>
              ) : (
                isLogin ? "Iniciar Sesión" : "Crear Cuenta"
              )}
            </motion.button>

            {/* Alternar Registro/Login */}
            <div className="text-center mt-2">
              {isLogin ? (
                <>
                  <span className="text-gray-500">¿No tienes cuenta?</span>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(""); }}
                    className="ml-2 text-red-700 font-semibold hover:underline"
                  >
                    Registrarse
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-500">¿Ya tienes cuenta?</span>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(""); }}
                    className="ml-2 text-red-700 font-semibold hover:underline"
                  >
                    Iniciar sesión
                  </button>
                </>
              )}
            </div>

            {/* Footer interno */}
            <div className="mt-4 text-center text-sm text-gray-500">
              VocatioAI © 2026
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* Modal de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            message={successMessage}
            onContinue={() => router.push("/")}
          />
        )}
      </AnimatePresence>
    </main>
  );
}