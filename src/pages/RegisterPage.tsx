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
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.10),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_52%,_#f8fafc_100%)]" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/80 px-3 py-1 text-sm font-semibold text-muted shadow-sm backdrop-blur-sm">
            <Sparkles size={16} className="text-accent-500" aria-hidden />
            Registro seguro para estudiantes y mentores
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Crea tu cuenta y entra a una plataforma pensada para crecer
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-muted sm:text-lg">
            Un registro más claro, una experiencia más confiable y acceso inmediato al ecosistema STEM Link.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Card className="border-border/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Estudiantes</p>
              <p className="mt-2 text-lg font-bold text-text">Encuentra acompañamiento</p>
            </Card>
            <Card className="border-border/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Mentores</p>
              <p className="mt-2 text-lg font-bold text-text">Comparte experiencia</p>
            </Card>
          </div>
        </div>

        <div className="w-full">
          <Card className="relative overflow-hidden border-border/70 bg-surface/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary-100/70 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-100/60 blur-3xl" />

            <div className="relative">
              <div className="mb-8 space-y-3 text-left">
                <div className="flex justify-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 shadow-[0_12px_30px_rgba(79,70,229,0.25)]">
                    <Zap className="h-7 w-7 text-surface" aria-hidden />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-text">
                    STEM <span className="text-primary-600">Link</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    Crea tu cuenta para empezar tu experiencia de mentoría STEM
                  </p>
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-border/70 bg-surface-alt/80 px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <ShieldCheck size={18} aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">Registro guiado</p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Completa tus datos y elige el rol que mejor encaja con tu participación en la plataforma.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  id="name"
                  label="Nombre completo"
                  type="text"
                  placeholder="Ana Torres"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  id="email"
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                  <div className="space-y-2">
                    <Input
                    id="password"
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    helperText={!errors.password ? 'Debe incluir mayúscula, minúscula, número y carácter especial.' : undefined}
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

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-text">Selecciona tu rol</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(['STUDENT', 'MENTOR'] as const).map((r) => {
                      const selected = role === r
                      const Icon = r === 'STUDENT' ? GraduationCap : UserRound

                      return (
                        <label
                          key={r}
                          className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition-all ${selected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-border/70 bg-surface/90 hover:border-primary-200 hover:bg-surface-alt/80'}`}
                        >
                          <input type="radio" value={r} {...register('role')} className="sr-only" />
                          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? 'bg-primary-600 text-surface' : 'bg-surface-alt text-primary-600'}`}>
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
                  className="w-full py-3.5 text-base font-semibold"
                >
                  Crear cuenta <ArrowRight size={18} />
                </Button>

                <p className="pt-1 text-center text-sm text-muted">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">
                    Inicia sesión
                  </Link>
                </p>
              </form>

              <div className="relative mt-8 border-t border-border/70 pt-8">
                <p className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-surface px-2 text-xs text-muted">
                  Registro seguro
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-surface-alt/80 px-4 py-4">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden />
                  <p className="text-xs leading-5 text-muted">
                    Tus datos siguen el mismo flujo de autenticación existente y conservan las validaciones activas.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-surface-alt/80 px-4 py-4">
                  <GraduationCap size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden />
                  <p className="text-xs leading-5 text-muted">
                    Al registrarte podrás acceder al dashboard y continuar con la experiencia completa de STEM Link.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <p className="mt-6 text-center text-xs text-muted">
            Al registrarte, aceptas los términos de uso de la plataforma y su flujo de autenticación actual.
          </p>
        </div>
      </div>
    </main>
  )
}
