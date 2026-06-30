import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { parseApiError } from '../utils/errors'
import { ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await login(data)
      navigate('/dashboard')
    } catch (e) {
      toast.error(parseApiError(e))
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(99,102,241,0.08),transparent_42%,rgba(20,184,166,0.05)),radial-gradient(circle_at_top_left,rgba(99,102,241,0.1),transparent_24rem)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div className="max-w-xl">
          <div className="eyebrow">
            <Sparkles size={16} className="text-accent-500" aria-hidden />
            Acceso seguro a STEM Link
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-text sm:text-5xl">
            Entra al espacio donde la mentoría STEM se siente clara y profesional
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-muted sm:text-lg">
            Continúa tu recorrido con una interfaz más limpia, sesiones mejor organizadas y acceso directo a mentores y reservas.
          </p>

          <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
            <Card className="border-border/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Sesiones</p>
              <p className="mt-2 text-lg font-bold text-text">Reserva y seguimiento</p>
            </Card>
            <Card className="border-border/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Mentores</p>
              <p className="mt-2 text-lg font-bold text-text">Descubrimiento guiado</p>
            </Card>
          </div>
        </div>

        <div className="w-full">
          <Card className="relative overflow-hidden border-border bg-surface p-5 sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(99,102,241,0.08),transparent)]" aria-hidden />

            <div className="relative">
              <div className="mb-8 space-y-3 text-left">
                <div className="flex justify-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 shadow-[0_8px_20px_rgba(79,70,229,0.18)]">
                    <Zap className="h-7 w-7 text-surface" aria-hidden />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-text">
                    STEM <span className="text-primary-600">Link</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    Tu plataforma de mentoría en ciencia, tecnología, ingeniería y matemáticas
                  </p>
                </div>
              </div>

              <div className="surface-tint mb-6 rounded-[1.35rem] border border-border/70 px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <ShieldCheck size={18} aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">Sesión protegida</p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Usa tus credenciales de prueba para entrar al dashboard o al perfil de mentor.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  id="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                  <div className="space-y-2">
                    <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Contraseña"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
                    {showPassword ? 'Ocultar' : 'Mostrar'} contraseña
                  </button>
                </div>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full py-3.5 text-base font-semibold"
                >
                  Iniciar sesión <ArrowRight size={18} />
                </Button>

                <p className="pt-1 text-center text-sm text-muted">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">Regístrate</Link>
                </p>
              </form>

              <div className="surface-subtle mt-6 rounded-[1.35rem] p-4">
                <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted">Cuentas demo</p>
                <div className="space-y-1 text-center text-xs leading-5 text-muted">
                  <p>Estudiante: lucia.student@stemlink.com / Student@123</p>
                  <p>Mentor: carlos.mentor@stemlink.com / Mentor@123</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-muted">
              Al iniciar sesión, aceptas nuestros términos y política de privacidad.
            </p>
            <Link to="/mentors" className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">
              Ver mentores disponibles →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
