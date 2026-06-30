import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { parseApiError } from '../utils/errors'
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck, Sparkles, UserRound, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, 'Debe incluir mayúscula, minúscula, número y carácter especial'),
  role: z.enum(['STUDENT', 'MENTOR']).refine(v => !!v, 'Selecciona un rol'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const role = watch('role')

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data)
      toast.success('¡Cuenta creada exitosamente!')
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
                Crea tu cuenta para empezar tu experiencia de mentoría STEM
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-surface-alt px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Sparkles size={18} aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Mismo flujo, nueva interfaz</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  El registro mantiene la lógica actual de autenticación, validación y navegación.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-text">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                placeholder="Ana Torres"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 ${errors.name ? 'border-primary-600' : 'border-border'}`}
                {...register('name')}
              />
              {errors.name && <span id="name-error" className="text-xs text-primary-700">{errors.name.message}</span>}
            </div>

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
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : 'password-help'}
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
              {!errors.password && (
                <span id="password-help" className="text-xs text-muted">
                  Debe incluir mayúscula, minúscula, número y carácter especial.
                </span>
              )}
              {errors.password && <span id="password-error" className="text-xs text-primary-700">{errors.password.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">Selecciona tu rol</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(['STUDENT', 'MENTOR'] as const).map((r) => {
                  const selected = role === r
                  const Icon = r === 'STUDENT' ? GraduationCap : UserRound

                  return (
                    <label
                      key={r}
                      className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all ${selected ? 'border-primary-600 bg-primary-50 shadow-sm' : 'border-border bg-surface hover:bg-surface-alt'}`}
                    >
                      <input type="radio" value={r} {...register('role')} className="sr-only" />
                      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${selected ? 'bg-primary-600 text-surface' : 'bg-surface-alt text-primary-600'}`}>
                        <Icon size={20} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-text">
                          {r === 'STUDENT' ? 'Estudiante' : 'Mentor'}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {r === 'STUDENT' ? 'Busca acompañamiento y reserva sesiones.' : 'Comparte experiencia y guía a estudiantes.'}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-muted">
                Elige cómo vas a participar dentro de la plataforma.
              </p>
              {errors.role && <span className="text-xs text-primary-700">{errors.role.message}</span>}
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-2.5 font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              Crear cuenta <ArrowRight size={18} />
            </Button>

            <div className="pt-2 text-center">
              <p className="text-sm text-muted">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>

          <div className="relative mt-8 border-t border-border pt-8">
            <p className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-surface px-2 text-xs text-muted">
              Registro seguro
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-alt px-4 py-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden />
              <p className="text-xs leading-5 text-muted">
                Tus datos siguen el mismo flujo de autenticación existente y conservan las validaciones activas.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-alt px-4 py-3">
              <GraduationCap size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden />
              <p className="text-xs leading-5 text-muted">
                Al registrarte podrás acceder al dashboard y continuar con la experiencia completa de STEM Link.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Al registrarte, aceptas los términos de uso de la plataforma y su flujo de autenticación actual.
        </p>
      </div>
    </main>
  )
}
