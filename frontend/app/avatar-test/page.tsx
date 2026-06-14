"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AvatarCustomizer from "@/app/components/avatar/AvatarCustomizer";
import DinosaurSVG from "@/app/components/avatar/DinosaurSVG";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/config";

export default function AvatarPage() {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-1.5 text-xs font-semibold text-red-600 shadow-sm">
            🎨 Personalización de avatar
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Tu Avatar Vocacional
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Tu avatar cambia de ropa por completo según tu carrera ideal.
            Completa el test vocacional para desbloquear el traje de tu especialidad.
          </p>
        </motion.div>

        {/* Si no ha iniciado sesión — mostrar mascota */}
        {!loading && !user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl text-center"
          >
            <div className="mx-auto mb-4 w-fit overflow-hidden rounded-2xl shadow-md">
              <DinosaurSVG size={180} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">¡Hola! Soy Dino 🦕</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Inicia sesión para crear y personalizar tu avatar vocacional.
              Una vez que completes el test, tu avatar recibirá el traje de tu carrera ideal.
            </p>
            <a
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
            >
              Iniciar sesión →
            </a>
          </motion.div>
        )}

        {/* Avatar customizer completo */}
        {!loading && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {/* Tip panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mb-8 max-w-2xl rounded-2xl border border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-800"
            >
              <span className="font-semibold">💡 Tip:</span> Completa el test vocacional y tu avatar recibirá automáticamente el traje completo de tu carrera. ¡Cada carrera tiene un traje único!
            </motion.div>

            <AvatarCustomizer />
          </motion.div>
        )}

        {/* Galería de trajes */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-slate-800">
            Trajes disponibles
          </h2>
          <p className="mb-8 text-center text-sm text-slate-400">
            Completa el test para desbloquear el traje de tu carrera
          </p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-7">
            {[
              ["software","💻","Dev"],
              ["medicina","⚕️","Médico"],
              ["ingenieria","⚙️","Ingeniero"],
              ["derecho","⚖️","Abogado"],
              ["gastronomia","👨‍🍳","Chef"],
              ["astronauta","🚀","Astro"],
              ["psicologia","🧠","Psico"],
              ["diseno","🎨","Diseño"],
              ["musica","🎵","Música"],
              ["matematicas","📐","Mate"],
              ["literatura","📚","Letras"],
              ["administracion","💼","Admin"],
              ["arquitectura","🏛️","Arq"],
              ["marketing","📣","Marketing"],
            ].map(([career, emoji, label]) => (
              <motion.div
                key={career}
                whileHover={{ scale: 1.06, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="overflow-hidden rounded-2xl shadow-md border border-slate-100">
                  <DinosaurSVG career={career} size={90} />
                </div>
                <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight">
                  {emoji} {label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
