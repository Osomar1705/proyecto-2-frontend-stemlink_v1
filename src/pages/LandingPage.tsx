import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  Compass,
  Search,
  Sparkles,
  TrendingUp,
  Video,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { MentorAvatar } from '../components/mentors/MentorAvatar'

const mentorPreview = [
  { name: 'Valeria Torres', skill: 'Data Science · Python', image: '/mentor-avatars/portrait-a.png' },
  { name: 'Diego Ramos', skill: 'Cloud · Backend', image: '/mentor-avatars/portrait-b.png' },
]

const features = [
  {
    icon: Compass,
    title: 'Encuentra al mentor ideal',
    description: 'Explora perfiles por especialidad, experiencia y disponibilidad para elegir con confianza.',
  },
  {
    icon: Calendar,
    title: 'Reserva sin fricción',
    description: 'Coordina sesiones en horarios compatibles y gestiona tus próximas mentorías en un solo lugar.',
  },
  {
    icon: TrendingUp,
    title: 'Avanza con dirección',
    description: 'Convierte tus objetivos académicos y profesionales en pasos claros con acompañamiento experto.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Explora',
    description: 'Filtra mentores según el área STEM en la que quieres crecer.',
  },
  {
    number: '02',
    title: 'Conecta',
    description: 'Revisa su perfil y reserva una sesión en el horario que prefieras.',
  },
  {
    number: '03',
    title: 'Progresa',
    description: 'Recibe orientación práctica y mantén el foco en tus objetivos.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="animated-stage overflow-x-clip text-text">
      <section className="relative isolate px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-18 lg:px-8 lg:pb-24 lg:pt-20">
        <div
          className="hero-backdrop pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-16">
          <div className="max-w-3xl">
            <div className="eyebrow mb-6 text-primary-700 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
              <Sparkles size={16} aria-hidden="true" />
              Mentoría STEM hecha para avanzar
            </div>

            <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-text sm:text-5xl lg:text-[3.75rem]">
              Aprende más rápido con la guía de quienes ya recorrieron el camino.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Conecta con mentores verificados en ciencia, tecnología, ingeniería y matemáticas. Encuentra la orientación que necesitas y transforma tus metas en progreso real.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="accent"
                onClick={() => navigate('/mentors')}
                className="w-full px-6 py-3 text-base sm:w-auto"
              >
                Explorar mentores
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/register')}
                className="w-full px-6 py-3 text-base sm:w-auto"
              >
                Crear cuenta gratis
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-accent-600" aria-hidden="true" />
                Registro gratuito
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-accent-600" aria-hidden="true" />
                Mentores verificados
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-accent-600" aria-hidden="true" />
                Horarios flexibles
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <Card className="hero-glow border-border bg-surface p-4 sm:p-5 lg:p-6">
              <div className="relative z-10 flex items-start justify-between gap-5 border-b border-border/80 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600">Explorar mentores</p>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-text sm:text-2xl">Encuentra el match correcto</h2>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5 text-xs font-semibold text-accent-700 ring-1 ring-accent-200">
                  <span className="h-2 w-2 rounded-full bg-accent-500" aria-hidden />
                  En línea
                </span>
              </div>

              <div className="relative z-10 py-4">
                <div className="field-shell flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted">
                  <Search size={18} className="text-primary-600" aria-hidden />
                  <span className="truncate">¿En qué quieres mejorar?</span>
                  <span className="ml-auto hidden rounded-lg bg-primary-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-700 sm:inline">Buscar</span>
                </div>

                <div className="mt-4 space-y-3">
                  {mentorPreview.map((mentor, index) => (
                    <div
                      key={mentor.name}
                      className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300 ${index === 0 ? 'border-primary-200 bg-primary-50/55 shadow-[0_12px_28px_rgba(79,70,229,0.08)]' : 'border-border/80 bg-surface/80'}`}
                    >
                      <MentorAvatar name={mentor.name} src={mentor.image} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-text">{mentor.name}</p>
                          {index === 0 && <Sparkles size={13} className="shrink-0 text-accent-500" aria-hidden />}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted">{mentor.skill}</p>
                      </div>
                      <span className="rounded-xl bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-primary-700 ring-1 ring-border/70">
                        Ver perfil
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-primary-600 p-3.5 text-surface shadow-[0_18px_36px_rgba(79,70,229,0.18)]">
                  <div className="flex items-center gap-2">
                    <Calendar size={17} aria-hidden />
                    <p className="text-xs font-semibold text-primary-100">Reserva flexible</p>
                  </div>
                  <p className="mt-2 text-sm font-bold">Elige tu horario</p>
                </div>
                <div className="panel-shell rounded-2xl p-3.5">
                  <div className="flex items-center gap-2 text-accent-700">
                    <Video size={17} aria-hidden />
                    <p className="text-xs font-semibold">Todo conectado</p>
                  </div>
                  <p className="mt-2 text-sm font-bold text-text">Sesiones y feedback</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface-alt/60 px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-600">Una mejor forma de aprender</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">Menos incertidumbre. Más progreso.</h2>
            <p className="mt-4 text-base leading-7 text-muted">
              STEM Link reúne las herramientas esenciales para descubrir expertos, organizar sesiones y mantener tu aprendizaje en movimiento.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-5">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="h-full border-border bg-surface p-5 sm:p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-text">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-24">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                <BookOpen size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-text sm:text-4xl">Empieza en tres pasos</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-muted">
                Un flujo simple para que pases de una pregunta a una conversación útil sin perder tiempo.
              </p>
              <Button variant="secondary" onClick={() => navigate('/mentors')} className="mt-6 px-5">
                Ver todos los mentores
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </div>

            <ol className="grid gap-3">
              {steps.map((step) => (
                <li key={step.number} className="grid gap-3 rounded-[1.6rem] border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_16px_34px_rgba(15,23,42,0.06)] sm:grid-cols-[3.25rem_1fr] sm:items-start sm:p-6">
                  <span className="text-sm font-bold tracking-[0.12em] text-primary-600">{step.number}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-text">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-primary-700 bg-primary-900 px-6 py-10 text-surface shadow-[0_12px_36px_rgba(49,46,129,0.16)] sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary-100">Tu siguiente paso puede empezar hoy</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Encuentra la guía que necesitas para avanzar.</h2>
            <p className="mt-4 text-base leading-7 text-primary-100">Únete a STEM Link y conecta con especialistas dispuestos a compartir experiencia práctica.</p>
          </div>
          <div className="mt-7 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0">
            <Button variant="accent" onClick={() => navigate('/register')} className="w-full px-6 py-3 sm:w-auto">
              Crear cuenta gratis
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full px-6 py-3 sm:w-auto">
              Iniciar sesión
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface/80 px-4 py-8 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-text">
              <CheckCircle size={18} className="text-accent-500" aria-hidden="true" />
              STEM Link
            </div>
            <p className="mt-2">Mentoría personalizada para la próxima generación STEM.</p>
          </div>
          <nav aria-label="Navegación del pie de página" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/mentors" className="transition-all duration-300 ease-in-out hover:text-text">Mentores</Link>
            <Link to="/login" className="transition-all duration-300 ease-in-out hover:text-text">Iniciar sesión</Link>
            <Link to="/register" className="transition-all duration-300 ease-in-out hover:text-text">Crear cuenta</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
