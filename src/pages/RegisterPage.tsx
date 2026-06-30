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
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(99,102,241,0.045),transparent_42%,rgba(20,184,166,0.035))]" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/80 px-3 py-1 text-sm font-semibold text-muted shadow-sm backdrop-blur-sm">
            <Sparkles size={16} className="text-accent-500" aria-hidden />
            Registro seguro para estudiantes y mentores
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-text sm:text-5xl">
            Crea tu cuenta y entra a una plataforma pensada para crecer
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-muted sm:text-lg">
            Un registro más claro, una experiencia más confiable y acceso inmediato al ecosistema STEM Link.
          </p>

          <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
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
          <Card className="relative overflow-hidden border-border bg-surface p-5 sm:p-10">

            <div className="relative">
              <div className="mb-8 space-y-3 text-left">
                <div className="flex justify-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 shadow-[0_4px_12px_rgba(79,70,229,0.18)]">
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
