import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Calendar, CheckCircle, GraduationCap, ShieldCheck, Sparkles, TrendingUp, Users, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import heroImage from '../assets/hero.png'

const features = [
  {
    icon: BookOpen,
    title: 'Mentores especializados',
    description:
      'Conecta con expertos en Ciencia, Tecnología, Ingeniería y Matemáticas listos para guiarte.',
  },
  {
    icon: Calendar,
    title: 'Sesiones flexibles',
    description:
      'Agenda mentorías en el horario que más te convenga, de forma simple y sin complicaciones.',
  },
  {
    icon: TrendingUp,
    title: 'Crecimiento real',
    description:
      'Recibe orientación personalizada y acelera tu desarrollo académico y profesional.',
  },
]

const highlights = [
  { icon: Users, label: 'Mentores activos', value: '100+' },
  { icon: Calendar, label: 'Sesiones flexibles', value: '24/7' },
  { icon: BookOpen, label: 'Áreas STEM', value: '6+' },
]

const steps = [
  'Explora mentores por especialidad.',
  'Reserva una sesión según tu disponibilidad.',
  'Recibe feedback y registra tu progreso.',
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-alt text-text">
      <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-10 top-16 h-72 w-72 rounded-full bg-primary-100/70 blur-3xl" />
          <div className="absolute bottom-12 left-8 h-80 w-80 rounded-full bg-accent-100/70 blur-3xl" />
        </div>

        <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 shadow-[0_12px_30px_rgba(79,70,229,0.25)]">
                <Zap size={30} className="text-surface" aria-hidden />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-text">
                  STEM <span className="text-primary-600">Link</span>
                </p>
                <p className="text-sm text-muted">Mentoría STEM personalizada</p>
              </div>
            </div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/85 px-3 py-1 text-sm font-semibold text-primary-700 shadow-sm backdrop-blur-sm">
              <ShieldCheck size={16} aria-hidden />
              Mentores verificados para tu crecimiento
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
              Conecta con expertos STEM y acelera tu aprendizaje
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted sm:text-lg">
              Encuentra mentores en ciencia, tecnología, ingeniería y matemáticas. Reserva sesiones,
              recibe orientación personalizada y organiza tu progreso desde una sola plataforma.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="accent"
                onClick={() => navigate('/mentors')}
                className="px-8 py-3 text-base font-semibold shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Ver Mentores <ArrowRight size={18} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/login')}
                className="px-8 py-3 text-base font-semibold shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Iniciar Sesión
              </Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                    <item.icon size={20} className="text-primary-600" aria-hidden />
                  </div>
                  <p className="text-2xl font-bold text-text">{item.value}</p>
                  <p className="mt-1 text-sm text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <Card className="overflow-hidden rounded-2xl border-border bg-surface p-0 shadow-lg">
              <div className="border-b border-border px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-primary-600">Plataforma de mentoría</p>
                    <h2 className="mt-1 text-2xl font-bold text-text">Aprende con acompañamiento real</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
                    <GraduationCap size={24} className="text-accent-600" aria-hidden />
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="rounded-xl bg-surface-alt p-4">
                  <img
                    src={heroImage}
                    alt="Estudiantes colaborando en una mentoría STEM"
                    className="mx-auto h-auto w-full max-w-sm object-contain"
                  />
                </div>

                <div className="mt-6 space-y-3">
                  {steps.map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-600">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium text-text">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-sm font-semibold text-text">Sesiones a tu ritmo</p>
                    <p className="mt-1 text-sm leading-6 text-muted">Agenda con mentores según tu disponibilidad.</p>
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4">
                    <p className="text-sm font-semibold text-text">Ruta de aprendizaje</p>
                    <p className="mt-1 text-sm leading-6 text-muted">Organiza tus objetivos y avances en un solo lugar.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium text-muted">
              <Sparkles size={16} className="text-accent-500" aria-hidden />
              Experiencia diseñada para estudiantes STEM
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Una plataforma clara para aprender mejor
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted lg:text-base">
            STEM Link centraliza descubrimiento de mentores, reservas, sesiones y seguimiento para que el estudiante pase menos tiempo organizando y más tiempo aprendiendo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="group flex flex-col gap-4 border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 transition-colors group-hover:bg-primary-100">
                <Icon size={24} className="text-primary-600" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-text">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500">
              <Zap size={24} className="text-surface" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">¿Listo para empezar?</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted">
              Crea tu cuenta y empieza a conectar con mentores reales para impulsar tu formación STEM.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button onClick={() => navigate('/register')} className="px-8 py-3 text-base font-semibold shadow-sm">
              Crear cuenta gratis
            </Button>
            <Button variant="secondary" onClick={() => navigate('/login')} className="px-8 py-3 text-base font-semibold shadow-sm">
              Iniciar sesión
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-semibold text-text">
            <CheckCircle size={18} className="text-accent-500" aria-hidden />
            STEM Link
          </div>
          <p>Mentoría STEM personalizada para aprendizaje continuo.</p>
        </div>
      </section>
    </div>
  )
}
