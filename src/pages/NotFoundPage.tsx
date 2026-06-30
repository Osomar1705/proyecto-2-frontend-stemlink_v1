import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ArrowLeft, Compass, GraduationCap } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-alt px-4 py-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-10 top-16 h-72 w-72 rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute bottom-12 left-8 h-80 w-80 rounded-full bg-accent-100/70 blur-3xl" />
      </div>

      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-surface shadow-lg">
          <GraduationCap size={30} aria-hidden />
        </div>

        <p className="text-sm font-bold text-primary-600">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text">Página no encontrada</h1>
        <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
          La ruta que intentaste abrir no existe o cambió. Puedes volver al inicio o explorar otras áreas disponibles de STEM Link.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button onClick={() => navigate('/')} className="w-full">
            <ArrowLeft size={16} />
            Volver al inicio
          </Button>
          <Button variant="secondary" onClick={() => navigate('/mentors')} className="w-full">
            <Compass size={16} />
            Explorar mentores
          </Button>
        </div>
      </div>
    </div>
  )
}
