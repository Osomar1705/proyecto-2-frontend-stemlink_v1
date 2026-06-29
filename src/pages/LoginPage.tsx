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
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-surface flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <GraduationCap size={40} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-text">Bienvenido a STEM Link</h1>
          <p className="text-muted text-sm mt-1">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
          <Input label="Contraseña" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          <Button type="submit" loading={isSubmitting} className="w-full">Iniciar sesión</Button>
        </form>

        <p className="text-center text-sm text-muted">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary-600 hover:underline font-medium">Regístrate</Link>
        </p>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted text-center mb-2">Cuentas demo:</p>
          <div className="text-xs text-muted space-y-1 text-center">
            <p>Estudiante: lucia.student@stemlink.com / Student@123</p>
            <p>Mentor: carlos.mentor@stemlink.com / Mentor@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
