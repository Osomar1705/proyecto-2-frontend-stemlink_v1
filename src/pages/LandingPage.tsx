import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  Clock3,
  Compass,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const stats = [
  { icon: Users, label: 'Mentores activos', value: '100+' },
  { icon: Clock3, label: 'Disponibilidad', value: '24/7' },
  { icon: BookOpen, label: 'Áreas STEM', value: '6+' },
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
    <div className="overflow-x-clip text-text">
      <section className="relative isolate px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-18 lg:px-8 lg:pb-24 lg:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.07),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(20,184,166,0.06),transparent_28%)]"
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
            <Card className="border-border bg-surface p-5 sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-5 border-b border-border/80 pb-5">
                <div>
                  <p className="text-sm font-semibold text-primary-600">Tu aprendizaje, bien acompañado</p>
                  <h2 className="mt-1.5 text-xl font-bold tracking-tight text-text sm:text-2xl">Todo listo para tu próxima meta</h2>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <GraduationCap size={23} aria-hidden="true" />
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 py-5 sm:gap-3">
                {stats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="panel-shell min-w-0 rounded-xl p-3 sm:p-4">
                    <Icon size={18} className="mb-3 text-primary-600" aria-hidden="true" />
                    <p className="text-xl font-bold tracking-tight text-text sm:text-2xl">{value}</p>
                    <p className="mt-1 text-[0.7rem] leading-4 text-muted sm:text-xs">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.5rem] bg-primary-600 p-4 text-surface shadow-[0_18px_36px_rgba(79,70,229,0.18)] sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface/15">
                    <ShieldCheck size={21} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">Conexiones de calidad</p>
                    <p className="mt-0.5 text-sm leading-5 text-primary-100">Perfiles claros para que elijas al mentor adecuado.</p>
                  </div>
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
