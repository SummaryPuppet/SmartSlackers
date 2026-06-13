"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, register } from "../../src/services/authService";
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
      setSuccessMessage("Inicio de sesión exitoso");
      setShowSuccess(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-slate-100">

      {/* PANEL IZQUIERDO */}
      <motion.section
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-white items-center justify-center p-12"
      >
        <div className="max-w-md">

          <div className="mb-8">

            <motion.h1
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-5xl font-bold mb-3"
            >
              Vocatio
            </motion.h1>

            <div className="w-24 h-1 bg-white rounded-full"></div>
          </div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
            }}
            className="text-3xl font-semibold mb-6 leading-tight"
          >
            Descubre tu camino profesional con Inteligencia Artificial
          </motion.h2>

          <p className="text-red-100 text-lg leading-relaxed">
            Explora carreras, conversa con un mentor virtual y construye un
            roadmap personalizado para alcanzar tus objetivos académicos y
            profesionales.
          </p>

          <div className="mt-10 space-y-4">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.5,
              }}
              className="flex items-center gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Test vocacional inteligente</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.7,
                duration: 0.5,
              }}
              className="flex items-center gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Mentor IA personalizado</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.9,
                duration: 0.5,
              }}
              className="flex items-center gap-3"
            >
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Roadmap profesional dinámico</span>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* PANEL DERECHO */}
      <section className="flex-1 flex items-center justify-center p-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8"
        >

        <h2 className="text-3xl font-bold text-gray-900">
          {isLogin ? "Bienvenido" : "Crear Cuenta"}
        </h2>

        <p className="text-gray-500 mt-2">
          {isLogin
            ? "Inicia sesión para continuar"
            : "Completa tus datos para registrarte"}
        </p>

          <div className="space-y-5">

        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>

              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                className="
                w-full
                px-4
                py-3
                border
                border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-red-700
              "
            />
          </motion.div>
        )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>

              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-gray-300
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-700
                  transition
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-gray-300
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-700
                  transition
                "
              />
            </div>

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
            className="
              w-full
              px-4
              py-3
              border
              border-gray-300
              rounded-xl
              focus:outline-none
              focus:ring-2
              focus:ring-red-700
            "
          />
        </motion.div>
      )}

      <AnimatePresence>
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

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={isLogin ? handleLogin : handleRegister}
        disabled={isLoading}
        className="
          w-full
          bg-red-800
          hover:bg-red-900
          text-white
          py-3
          rounded-xl
          font-semibold
          transition
          shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
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

          <div className="text-center mt-4">
      {isLogin ? (
        <>
          <span className="text-gray-500">
            ¿No tienes cuenta?
          </span>

          <button
            onClick={() => { setIsLogin(false); setError(""); }}
            className="ml-2 text-red-700 font-semibold hover:underline"
          >
            Registrarse
          </button>
        </>
      ) : (
        <>
          <span className="text-gray-500">
            ¿Ya tienes cuenta?
          </span>

          <button
            onClick={() => { setIsLogin(true); setError(""); }}
            className="ml-2 text-red-700 font-semibold hover:underline"
          >
            Iniciar sesión
          </button>
        </>
      )}
    </div>

          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            VocatioAI © 2026
          </div>

        </motion.div>

      </section>

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