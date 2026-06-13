import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  { title: "+2,500", description: "estudiantes acompañados" },
  { title: "20+", description: "carreras exploradas" },
  { title: "98%", description: "de satisfacción" },
  { title: "76%", description: "más seguridad al elegir" },
];

const features = [
  {
    title: "Test vocacional",
    description: "Descubre tus intereses, fortalezas y áreas con más afinidad.",
    icon: "📋",
  },
  {
    title: "Explorar carreras",
    description: "Compara opciones, campos de estudio y salidas profesionales.",
    icon: "🔍",
  },
  {
    title: "Mentor IA",
    description: "Resuelve dudas al instante con acompañamiento inteligente.",
    icon: "🤖",
  },
  {
    title: "Plan personalizado",
    description: "Recibe recomendaciones claras según tu perfil y objetivos.",
    icon: "🎯",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_24%),linear-gradient(180deg,#fff5f5_0%,#fef2f2_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-red-300/30 blur-3xl animate-drift-slow" />
        <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-rose-300/30 blur-3xl animate-drift-slow animate-delay-300" />
        <div className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-300/25 blur-3xl animate-float-soft" />
      </div>

      <header className="relative z-10 border-b border-white/50 bg-white/50 backdrop-blur-xl animate-fade-up">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/25 animate-bounce-in">
              <span className="text-lg font-black">VT</span>
            </div>
            <div className="animate-slide-in-left animate-delay-100">
              <p className="text-lg font-extrabold tracking-tight text-slate-950">
                Vocatio
              </p>
              <p className="text-xs text-slate-500">Tu camino, tu futuro. </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a
              className="text-red-700 transition-colors hover:text-red-500"
              href="#inicio"
            >
              Inicio
            </a>
            <a className="transition-colors hover:text-red-500" href="#test">
              Test Vocacional
            </a>
            <a
              className="transition-colors hover:text-red-500"
              href="#carreras"
            >
              Explorar Carreras
            </a>
            <a className="transition-colors hover:text-red-500" href="#mentor">
              Mentor IA
            </a>
            <a
              className="transition-colors hover:text-red-500"
              href="#recursos"
            >
              Recursos
            </a>
            <a
              className="transition-colors hover:text-red-500"
              href="#comunidad"
            >
              Comunidad
            </a>
          </nav>

          <div className="flex items-center gap-3 animate-slide-in-right animate-delay-200">
            <Button variant="outline" size="lg">
              Iniciar sesión
            </Button>
            <Button
              size="lg"
              className="shadow-[0_16px_40px_rgba(220,38,38,0.28)] transition-transform hover:scale-105"
            >
              Registrarme
            </Button>
          </div>
        </div>
      </header>

      <section
        id="inicio"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-16"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-2xl">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm animate-fade-up animate-delay-200"
            >
              Tu guía vocacional empieza aquí
            </Badge>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl animate-fade-up animate-delay-300">
              Descubre tu camino.
              <span className="block bg-linear-to-r from-red-600 via-rose-600 to-orange-500 bg-clip-text text-transparent">
                Construye tu futuro.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl animate-fade-up animate-delay-400">
              Acompañamos a cada estudiante con orientación vocacional clara,
              recomendaciones personalizadas y herramientas de inteligencia
              artificial para decidir con seguridad.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-up animate-delay-500">
              <Button
                size="lg"
                className="bg-linear-to-r from-red-600 via-rose-600 to-orange-500 shadow-[0_18px_45px_rgba(220,38,38,0.35)] transition-all hover:brightness-110 hover:scale-105"
              >
                Comenzar mi viaje
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="transition-transform hover:scale-105"
              >
                Conocer más
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-slate-600 animate-fade-up animate-delay-600">
              <div className="flex -space-x-3">
                {["AM", "JR", "LP", "+2k"].map((item, index) => (
                  <Avatar
                    key={item}
                    size="lg"
                    className="transition-transform hover:scale-110 hover:z-10"
                  >
                    <AvatarFallback
                      className={
                        index === 3
                          ? "bg-linear-to-br from-red-600 to-rose-500 text-white"
                          : "bg-linear-to-br from-slate-700 to-slate-900 text-white"
                      }
                    >
                      {item}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p>
                <span className="font-semibold text-slate-900">
                  Más de 2,500
                </span>{" "}
                estudiantes ya encontraron un mejor rumbo.
              </p>
            </div>
          </div>

          <div className="relative animate-slide-in-right animate-delay-400">
            <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-red-500/10 via-white to-rose-500/10 blur-2xl animate-pulse-ring" />

            <Card className="relative overflow-hidden rounded-4xl border-white/70 bg-white/80 shadow-[0_30px_90px_rgba(220,38,38,0.12)] backdrop-blur-xl transition-shadow hover:shadow-[0_30px_90px_rgba(220,38,38,0.2)]">
              <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-linear-to-br from-red-500/35 to-rose-400/20 blur-2xl animate-float-soft" />
              <div className="absolute -left-10 bottom-6 h-40 w-40 rounded-full bg-orange-400/20 blur-2xl animate-float-soft animate-delay-500" />

              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <Badge className="bg-slate-950 px-4 py-2 text-sm text-white hover:bg-slate-950 animate-scale-in animate-delay-500">
                    Tu compatibilidad
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-xs animate-pulse-ring"
                  >
                    Mentor IA activo
                  </Badge>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                  <div className="relative">
                    <div className="mx-auto flex aspect-square max-w-88 items-center justify-center rounded-4xl bg-[radial-gradient(circle,rgba(220,38,38,0.2),rgba(255,255,255,0.06)_60%)] p-8">
                      <div className="relative flex h-full w-full items-center justify-center rounded-4xl border border-white/60 bg-linear-to-br from-red-500 via-rose-500 to-orange-500 p-6 shadow-[0_25px_60px_rgba(220,38,38,0.35)] animate-pulse-ring">
                        <div className="absolute inset-5 rounded-[1.6rem] border border-white/25" />
                        <div className="absolute left-4 top-8 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-700 shadow animate-bounce-in animate-delay-700">
                          Perfil analizado
                        </div>
                        <div className="absolute right-4 bottom-8 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-700 shadow animate-bounce-in animate-delay-800">
                          Recomendación precisa
                        </div>
                        <div className="relative z-10 flex h-72 w-56 items-end justify-center rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-4 shadow-inner">
                          <div className="relative h-56 w-40 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_12%,#fde68a_0,#f6d6b1_16%,#d9a37d_35%,#8b5e3c_100%)] shadow-[0_30px_60px_rgba(17,24,39,0.2)]">
                            <div className="absolute left-1/2 top-6 h-14 w-20 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_35%,#37210f_0,#120b07_85%)]" />
                            <div className="absolute left-1/2 top-12 h-6 w-28 -translate-x-1/2 rounded-full border-t-4 border-l-2 border-r-2 border-white/15 opacity-70" />
                            <div className="absolute inset-x-6 bottom-4 h-24 rounded-4xl bg-[linear-gradient(180deg,#fee2e2,#fca5a5_20%,#f87171_60%,#dc2626)]" />
                            <div className="absolute -bottom-2 left-1/2 h-20 w-52 -translate-x-1/2 rounded-full bg-slate-950/10 blur-xl" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute left-4 top-8 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-red-500/10 animate-float-soft animate-delay-200">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div className="absolute left-10 bottom-12 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-rose-500/10 animate-float-soft animate-delay-400">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div className="absolute right-5 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg shadow-orange-500/10 animate-float-soft animate-delay-600">
                      <span className="text-2xl">💬</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card
                      size="sm"
                      className="animate-fade-up animate-delay-600 transition-transform hover:scale-[1.02]"
                    >
                      <CardHeader>
                        <CardDescription>Resultado</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end justify-between gap-6">
                          <div>
                            <p className="text-4xl font-black text-slate-950">
                              92%
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                              de compatibilidad con Desarrollo de Software
                            </p>
                          </div>
                          <div className="h-24 w-24 rounded-full border-14 border-red-100 border-t-red-600 border-r-rose-500 border-b-red-500 border-l-rose-200 animate-spin-slow" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      size="sm"
                      className="animate-fade-up animate-delay-700 transition-transform hover:scale-[1.02]"
                    >
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white animate-bounce-in animate-delay-800">
                            🤖
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950">
                              Mentor IA
                            </p>
                            <p className="text-sm text-slate-600">
                              Hola, soy tu mentor virtual. ¿Qué quieres explorar
                              hoy?
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      size="sm"
                      className="animate-fade-up animate-delay-800 transition-transform hover:scale-[1.02]"
                    >
                      <CardHeader>
                        <CardTitle>Próximo paso</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600">
                          Completa el test de habilidades para afinar tu ruta
                          ideal.
                        </p>
                        <Button
                          variant="link"
                          className="mt-2 px-0 transition-colors hover:text-red-500"
                        >
                          Continuar →
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="recursos"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 lg:px-8 lg:pb-12"
      >
        <div className="grid gap-4 rounded-4xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(220,38,38,0.06)] backdrop-blur-xl lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={`border-slate-100 animate-scale-in animate-delay-${(index + 1) * 100} transition-all hover:scale-105 hover:shadow-lg hover:border-red-200`}
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-2xl transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <CardTitle className="mt-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="grid gap-4 rounded-4xl bg-linear-to-r from-red-700 via-rose-700 to-orange-600 p-6 text-white shadow-[0_24px_70px_rgba(220,38,38,0.28)] sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className={`rounded-3xl border border-white/15 bg-white/10 px-5 py-6 backdrop-blur-sm animate-fade-up animate-delay-${(index + 1) * 100} transition-all hover:bg-white/20 hover:scale-105`}
            >
              <p className="text-4xl font-black tracking-tight">{item.title}</p>
              <p className="mt-2 text-sm text-white/80">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
