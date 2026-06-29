import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { parseApiError } from '../utils/errors'
import { GraduationCap } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-surface flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <GraduationCap size={40} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-text">Crear cuenta</h1>
          <p className="text-muted text-sm mt-1">Únete a la comunidad STEM Link</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nombre completo" placeholder="Ana Torres" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
          <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" error={errors.password?.message} {...register('password')} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text">Rol</label>
            <div className="grid grid-cols-2 gap-3">
              {(['STUDENT', 'MENTOR'] as const).map((r) => (
                <label key={r} className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${role === r ? 'border-primary-600 bg-primary-50' : 'border-border hover:border-primary-200'}`}>
                  <input type="radio" value={r} {...register('role')} className="hidden" />
                  <span className="text-sm font-medium">{r === 'STUDENT' ? '🎓 Estudiante' : '👨‍🏫 Mentor'}</span>
                </label>
              ))}
            </div>
            {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full">Crear cuenta</Button>
        </form>

        <p className="text-center text-sm text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
