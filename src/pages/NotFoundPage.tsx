import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-bold text-indigo-200">404</h1>
        <h2 className="text-2xl font-bold text-gray-800">Página no encontrada</h2>
        <p className="text-gray-500">La página que buscas no existe.</p>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    </div>
  )
}
