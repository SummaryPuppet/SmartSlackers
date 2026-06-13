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

    // Validar nombre
    if (!name.trim()) {
      alert("Ingresa tu nombre");
      return;
    }

    // Validar contraseñas
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Validar longitud mínima
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

      await register(
      email,
      password,
      name
    );

    alert("Usuario registrado correctamente");

    router.push("/");

  } catch (error: any) {
    alert(error.message);
  }
};

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Inicio de sesión exitoso");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
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
              onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
            onChange={(e) => setConfirmPassword(e.target.value)}
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

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={isLogin ? handleLogin : handleRegister}
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
        "
      >
        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
      </motion.button>

          <div className="text-center mt-4">
      {isLogin ? (
        <>
          <span className="text-gray-500">
            ¿No tienes cuenta?
          </span>

          <button
            onClick={() => setIsLogin(false)}
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
            onClick={() => setIsLogin(true)}
            className="ml-2 text-red-700 font-semibold hover:underline"
          >
            Iniciar sesión
          </button>
        </>
      )}
    </div>

          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            JourneyAI © 2026
          </div>

        </motion.div>

      </section>

    </main>
  );
}