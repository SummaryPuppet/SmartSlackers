import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const admissionSteps = [
  {
    title: "Inscripción rápida",
    icon: "📝",
    description: "Completa tu solicitud en línea con datos personales, DNI y correo electrónico.",
  },
  {
    title: "Revisa requisitos",
    icon: "📌",
    description: "Confirma la documentación necesaria y los plazos de postulación para tu carrera.",
  },
  {
    title: "Elige modalidad",
    icon: "🎓",
    description: "Selecciona entre presencial, semipresencial o 100% virtual según tu disponibilidad.",
  },
  {
    title: "Contáctanos",
    icon: "💬",
    description: "Comunícate con el equipo de admisión por WhatsApp, correo o teléfono para resolver dudas.",
  },
];

export default function AdmissionPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.14),transparent_26%),linear-gradient(180deg,#fff5f5_0%,#fdf2f2_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-red-300/30 blur-3xl" />
        <div className="absolute -right-28 top-24 h-96 w-96 rounded-full bg-rose-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-300/25 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/50 bg-white/50 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/25">
              <span className="text-lg font-black">VT</span>
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-950">Vocatio</p>
              <p className="text-xs text-slate-500">Admisión UTP Perú</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a className="text-red-700 transition-colors hover:text-red-500" href="/#inicio">
              Inicio
            </a>
            <a className="transition-colors hover:text-red-500" href="/test">
              Test Vocacional
            </a>
            <a className="transition-colors hover:text-red-500" href="/carreras">
              Explorar Carreras
            </a>
            <a className="transition-colors hover:text-red-500" href="/#mentor">
              Mentor IA
            </a>
            <a className="transition-colors hover:text-red-500" href="/recursos">
              Recursos
            </a>
            <a className="transition-colors hover:text-red-500" href="/#comunidad">
              Comunidad
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg">
              Iniciar sesión
            </Button>
            <Button size="lg" className="shadow-[0_16px_40px_rgba(220,38,38,0.28)] transition-transform hover:scale-105">
              Registrarme
            </Button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 p-3 shadow-lg shadow-slate-950/20">
              <svg viewBox="0 0 120 40" className="h-full w-full">
                <rect x="0" y="0" width="38" height="40" fill="#c8102e" />
                <rect x="41" y="0" width="38" height="40" fill="#c8102e" />
                <rect x="82" y="0" width="38" height="40" fill="#c8102e" />
                <text x="19" y="27" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
                  U
                </text>
                <text x="60" y="27" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
                  T
                </text>
                <text x="101" y="27" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
                  P
                </text>
              </svg>
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-red-600">Admisión UTP Perú</p>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Todo lo que necesitas saber para postular a la UTP.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Información oficial de admisión, requisitos, modalidades y contactos para que tu postulación sea clara y rápida.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://www.utp.edu.pe"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-red-600 via-rose-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(220,38,38,0.35)] transition hover:brightness-110 hover:scale-105"
              >
                Ver UTP Oficial
              </a>
              <a
                href="/recursos"
                className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Volver a Recursos
              </a>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white/95 p-8 shadow-[0_35px_100px_rgba(220,38,38,0.12)] border border-white/80">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-100 text-red-700 text-2xl">🎓</div>
            <div className="mt-8 space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Modalidades</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">Presencial, semipresencial y 100% virtual</h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                UTP ofrece horarios flexibles y opciones para estudiar desde el campus o desde cualquier lugar con su plataforma virtual.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "Presencial",
                  "Semipresencial",
                  "100% Virtual",
                ].map((mode) => (
                  <div key={mode} className="rounded-3xl bg-slate-100 p-4 text-center text-sm font-semibold text-slate-950">
                    {mode}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {admissionSteps.map((step) => (
            <Card key={step.title} className="overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-[0_24px_90px_rgba(220,38,38,0.08)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(220,38,38,0.14)]">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-red-100 text-2xl">
                  {step.icon}
                </div>
                <CardTitle className="mt-6 text-xl font-semibold text-slate-950">{step.title}</CardTitle>
                <CardDescription className="mt-3 text-sm leading-6 text-slate-600">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="rounded-[2.5rem] bg-white/95 p-10 shadow-[0_35px_120px_rgba(220,38,38,0.08)] border border-white/80">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-red-600">Contacto de admisión</p>
              <h2 className="mt-4 text-4xl font-black text-slate-950">
                Habla con el equipo de admisión de UTP.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Teléfono, WhatsApp y correo oficial para resolver tus dudas y recibir acompañamiento en la postulación.
              </p>
              <div className="mt-8 overflow-hidden rounded-[2rem] bg-slate-100">
                <img
                  src="https://www.utp.edu.pe/sites/default/files/campus/SJL-600x600.webp"
                  alt="Infraestructura universitaria moderna de UTP"
                  className="h-72 w-full object-cover"
                />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-4xl bg-slate-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-red-100 text-2xl">📞</div>
                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">Postulantes</p>
                <p className="mt-3 text-2xl font-bold text-slate-950">(01) 315 9610</p>
                <p className="mt-2 text-sm text-slate-600">Provincia: 0800 71 900</p>
              </div>
              <div className="rounded-4xl bg-slate-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-red-100 text-2xl">✉️</div>
                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">Correo</p>
                <p className="mt-3 text-2xl font-bold text-slate-950">admision@utp.edu.pe</p>
              </div>
              <div className="rounded-4xl bg-slate-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-red-100 text-2xl">💬</div>
                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-slate-500">WhatsApp</p>
                <a className="mt-3 block text-2xl font-bold text-slate-950 hover:text-red-600" href="https://bit.ly/ConversaUTP_WA" target="_blank" rel="noreferrer">
                  Conversa UTP
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white/95 p-10 shadow-[0_35px_120px_rgba(220,38,38,0.08)] border border-white/80">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">¿Por qué elegir UTP?</p>
            <h2 className="mt-4 text-4xl font-black text-slate-950">Un enfoque práctico con respaldo empresarial.</h2>
            <ul className="mt-8 space-y-4 text-sm leading-7 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 text-xl">🎯</span>
                <span>Modelo académico enfocado en experiencia práctica y empleabilidad.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-xl">🤝</span>
                <span>Conexión con el grupo Intercorp y empresas líderes del país.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-xl">💼</span>
                <span>+100,000 ofertas de empleo en la Bolsa de Trabajo UTP.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-xl">📚</span>
                <span>Clases grabadas, tutorías gratuitas y apoyo de bienestar estudiantil.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-xl">🏫</span>
                <span>Infraestructura moderna con 15 campus a nivel nacional.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 p-10 text-white shadow-[0_35px_120px_rgba(220,38,38,0.22)] border border-white/20">
            <p className="text-sm uppercase tracking-[0.24em] text-red-100">Datos rápidos</p>
            <div className="mt-6 space-y-5 text-lg leading-8">
              <div className="flex gap-4">
                <span className="mt-1 text-2xl">🌟</span>
                <p>UTP es reconocida por su enseñanza práctica y sus convenios con el sector productivo.</p>
              </div>
              <div className="flex gap-4">
                <span className="mt-1 text-2xl">📅</span>
                <p>Las modalidades disponibles son perfectas para quienes estudian, trabajan o necesitan horarios flexibles.</p>
              </div>
              <div className="flex gap-4">
                <span className="mt-1 text-2xl">🕒</span>
                <p>El equipo de admisión atiende de lunes a sábado de 8:30 a.m. a 8:00 p.m.</p>
              </div>
              <div className="flex gap-4">
                <span className="mt-1 text-2xl">📝</span>
                <p>El proceso de postulación inicia con el registro en línea y la entrega de tu documentación.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
