import Navbar from "../components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const resourceCards = [
  {
    title: "Portal UTP Perú",
    description: "Accede al sitio oficial de la Universidad Tecnológica del Perú y toda la información institucional.",
    href: "https://www.utp.edu.pe",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Admisión UTP",
    description: "Revisa requisitos, fechas de postulación y guías completas para postular a UTP.",
    href: "/recursos/admision",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Carreras UTP",
    description: "Explora las carreras profesionales, áreas de enseñanza y las sedes disponibles.",
    href: "https://www.utp.edu.pe/carreras",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
  },
];

const utpResources = [
  {
    title: "Campus UTP",
    description: "Conoce nuestras sedes, laboratorios y espacios para estudiantes.",
    icon: "🏫",
  },
  {
    title: "Carreras destacadas",
    description: "Explora programas como Ingeniería de Software, Diseño Digital y Gestión Empresarial.",
    icon: "🎓",
  },
  {
    title: "Becas y apoyos",
    description: "Encuentra los apoyos económicos disponibles para estudiantes nuevos.",
    icon: "💰",
  },
  {
    title: "Talleres UTP",
    description: "Participa en sesiones de orientación, entrevistas y preparación académica.",
    icon: "📘",
  },
];

const studentServices = [
  {
    title: "Mentorías vocacionales",
    detail: "Sesiones personalizadas para definir tus intereses y opciones de estudio.",
    icon: "🧭",
  },
  {
    title: "Asesoría de admisión",
    detail: "Guía paso a paso para preparar tu postulación y documentos.",
    icon: "📝",
  },
  {
    title: "Financiamiento UTP",
    detail: "Becas parciales, programas de apoyo y facilidades de pago.",
    icon: "🤝",
  },
];

export default function ResourcesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.14),transparent_26%),linear-gradient(180deg,#fff5f5_0%,#fdf2f2_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-red-300/30 blur-3xl" />
        <div className="absolute -right-28 top-24 h-96 w-96 rounded-full bg-rose-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-300/25 blur-3xl" />
      </div>

      <Navbar />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
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
            <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Recursos UTP para impulsar tu ingreso a la universidad.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Información, eventos y apoyo diseñado para futuros estudiantes de la UTP. Aprende qué estudiar, cómo postular y qué becas están disponibles.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-4xl bg-white/90 p-6 shadow-[0_25px_70px_rgba(220,38,38,0.08)] border border-white/80">
                <p className="text-sm uppercase tracking-[0.2em] text-red-600">Becas UTP</p>
                <p className="mt-4 text-lg font-semibold text-slate-950">Apoyos económicos y planes de pago flexibles.</p>
              </div>
              <div className="rounded-4xl bg-white/90 p-6 shadow-[0_25px_70px_rgba(220,38,38,0.08)] border border-white/80">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-700">Talleres</p>
                <p className="mt-4 text-lg font-semibold text-slate-950">Sesiones para presentar tu perfil y conocer carreras.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2.5rem] bg-white/95 p-8 shadow-[0_35px_100px_rgba(220,38,38,0.12)] border border-white/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-100 text-red-700 text-2xl">📚</div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Recursos</p>
                <p className="mt-3 text-4xl font-black text-slate-950">UTP Guide</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">Recopilación de guías, fechas, carreras y becas oficiales de la UTP.</p>
              </div>
            </div>
            <div className="rounded-[2.5rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 p-8 shadow-[0_35px_100px_rgba(220,38,38,0.22)] text-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-2xl">✨</div>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.24em] text-red-100">Éxito</p>
                <p className="mt-3 text-4xl font-black">UTP en tu futuro</p>
                <p className="mt-4 text-sm leading-6 text-red-100/90">Prepárate para un camino más claro con contenidos diseñados para tus intereses y metas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {resourceCards.map((card) => (
            <Card key={card.title} className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_90px_rgba(220,38,38,0.08)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(220,38,38,0.14)]">
              <img src={card.image} alt={card.title} className="h-56 w-full object-cover" />
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold text-slate-950">{card.title}</CardTitle>
                <CardDescription className="mt-3 text-sm leading-6 text-slate-600">{card.description}</CardDescription>
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-6 inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Ir al recurso
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {utpResources.map((resource) => (
            <Card key={resource.title} className="overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-[0_24px_90px_rgba(220,38,38,0.08)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(220,38,38,0.14)]">
              <CardContent className="p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-2xl">{resource.icon}</div>
                <CardTitle className="mt-6 text-xl font-semibold text-slate-950">{resource.title}</CardTitle>
                <CardDescription className="mt-3 text-sm leading-6 text-slate-600">{resource.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {studentServices.map((service) => (
            <div key={service.title} className="rounded-4xl bg-white/95 p-8 shadow-[0_28px_90px_rgba(220,38,38,0.08)] border border-white/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-100 text-rose-700 text-2xl">{service.icon}</div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{service.detail}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
