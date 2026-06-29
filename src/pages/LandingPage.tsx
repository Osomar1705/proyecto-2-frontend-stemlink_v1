import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Calendar, GraduationCap, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

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
  { label: 'Mentores verificados', value: '100+' },
  { label: 'Sesiones semanales', value: '24/7' },
  { label: 'Áreas STEM', value: '6+' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:gap-14 lg:px-8 lg:py-28">
          <div className="max-w-2xl text-left text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-primary-100">
              <Sparkles size={16} className="text-accent-400" aria-hidden />
              Tu próxima mentoría empieza aquí
            </div>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <GraduationCap size={30} className="text-accent-400" aria-hidden />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">STEM Link</h1>
            </div>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-primary-100 sm:text-xl">
              Conecta con mentores expertos en STEM, desarrolla nuevas habilidades y avanza con guía
              real en cada etapa de tu formación.
            </p>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="accent"
                onClick={() => navigate('/mentors')}
                className="px-8 py-3 text-base"
              >
                Ver Mentores <ArrowRight size={18} />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="px-8 py-3 text-base"
              >
                Iniciar Sesión
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-primary-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <ShieldCheck size={16} className="text-accent-400" aria-hidden />
                Mentorías verificadas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <Users size={16} className="text-accent-400" aria-hidden />
                Comunidad activa
              </span>
            </div>
          </div>

          <Card className="w-full max-w-xl border-white/20 bg-white/10 p-6 text-white shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-100">
                  Plataforma exclusiva
                </p>
                <h2 className="mt-2 text-2xl font-bold">Aprende con acompañamiento real</h2>
              </div>
              <div className="rounded-2xl bg-accent-400/20 p-3">
                <GraduationCap size={24} className="text-accent-400" aria-hidden />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-primary-100">{item.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-600">
            ¿Por qué elegir STEM Link?
          </p>
          <h2 className="text-3xl font-bold text-text sm:text-4xl">
            Una experiencia de mentoría pensada para crecer
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 shrink-0">
                <Icon size={24} className="text-primary-600" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-text">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-accent-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">¿Listo para empezar?</h2>
          <p className="max-w-lg text-muted">
            Únete a STEM Link y da el siguiente paso en tu formación con el apoyo de mentores reales.
          </p>
          <Button onClick={() => navigate('/register')} className="px-8 py-3 text-base">
            Crear cuenta gratis
          </Button>
        </div>
      </section>
    </div>
  )
}
