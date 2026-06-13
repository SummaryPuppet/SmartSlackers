"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { login, register } from "../../src/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register(email, password);
      alert("Usuario registrado correctamente");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Inicio de sesión exitoso");
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
              JourneyAI
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

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-gray-900">
              Bienvenido
            </h2>

            <p className="text-gray-500 mt-2">
              Inicia sesión para continuar
            </p>

          </div>

          <div className="space-y-5">

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

            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={handleLogin}
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
              Iniciar Sesión
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={handleRegister}
              className="
                w-full
                border-2
                border-red-800
                text-red-800
                hover:bg-red-50
                py-3
                rounded-xl
                font-semibold
                transition
              "
            >
              Registrarse
            </motion.button>

          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            JourneyAI © 2026
          </div>

        </motion.div>

      </section>

    </main>
  );
}