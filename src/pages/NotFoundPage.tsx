import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ArrowLeft, Compass, GraduationCap } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-alt px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.1),transparent_24rem),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.08),transparent_20rem)]" aria-hidden />

      <div className="surface-card w-full max-w-xl rounded-[2rem] p-8 text-center sm:p-10">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary-600 text-surface shadow-[0_14px_30px_rgba(79,70,229,0.22)]">
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
