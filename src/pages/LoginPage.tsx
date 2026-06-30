import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { parseApiError } from '../utils/errors'
import { Code, Eye, EyeOff, Zap } from 'lucide-react'
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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface-alt px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-20 top-20 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute bottom-32 left-10 h-80 w-80 rounded-full bg-accent-100/60 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border/70 bg-surface p-8 shadow-lg sm:p-10">
          <div className="mb-8 space-y-3 text-center">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 shadow-lg">
                <Zap className="h-8 w-8 text-surface" aria-hidden />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-text">
                STEM <span className="text-primary-600">Link</span>
              </h1>
              <p className="mt-1 text-sm text-muted">
                Tu plataforma de mentoría en ciencia, tecnología, ingeniería y matemáticas
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-text">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 ${errors.email ? 'border-primary-600' : 'border-border'}`}
                {...register('email')}
              />
              {errors.email && <span id="email-error" className="text-xs text-primary-700">{errors.email.message}</span>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-text">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`w-full rounded-lg border bg-surface px-4 py-2.5 pr-11 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 ${errors.password ? 'border-primary-600' : 'border-border'}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
                </button>
              </div>
              {errors.password && <span id="password-error" className="text-xs text-primary-700">{errors.password.message}</span>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-border bg-surface text-primary-600"
                />
                <span className="text-muted">Recuérdame</span>
              </label>
              <a href="#login" className="font-medium text-primary-600 transition-colors hover:text-primary-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-3 font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Iniciar sesión
            </Button>

            <div className="pt-2 text-center">
              <p className="text-sm text-muted">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">Regístrate</Link>
              </p>
            </div>
          </form>

          <div className="relative mt-8 border-t border-border pt-8">
            <p className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-surface px-2 text-xs text-muted">
              O continúa con
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-alt"
              aria-label="Continuar con Google"
            >
              <span className="text-base font-bold text-primary-600" aria-hidden>G</span>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-alt"
              aria-label="Continuar con GitHub"
            >
              <Code size={18} aria-hidden />
              GitHub
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-surface-alt p-3">
            <p className="mb-2 text-center text-xs font-semibold text-text">Cuentas demo</p>
            <div className="space-y-1 text-center text-xs leading-5 text-muted">
              <p>Estudiante: lucia.student@stemlink.com / Student@123</p>
              <p>Mentor: carlos.mentor@stemlink.com / Mentor@123</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Al iniciar sesión, aceptas nuestros{' '}
          <a href="#terms" className="text-primary-600 hover:underline">Términos de Servicio</a>
          {' '}y{' '}
          <a href="#privacy" className="text-primary-600 hover:underline">Política de Privacidad</a>
        </p>

        <div className="mt-6 text-center">
          <p className="mb-2 text-xs text-muted">¿Quieres explorar la app?</p>
          <Link to="/mentors" className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">
            Ver mentores disponibles →
          </Link>
        </div>
      </div>
    </main>
  )
}
