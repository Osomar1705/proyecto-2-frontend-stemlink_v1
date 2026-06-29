import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { sessionsApi } from '../api/sessions.api'
import { notificationsApi } from '../api/notifications.api'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Calendar, Bell, Users, BookOpen } from 'lucide-react'
import type { MentorshipSessionResponse } from '../types'
import toast from 'react-hot-toast'
import { parseApiError } from '../utils/errors'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<MentorshipSessionResponse[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const [sessRes, notifRes] = await Promise.all([
          sessionsApi.list(undefined, controller.signal),
          notificationsApi.list({ page: 0, size: 50 }, controller.signal),
        ])
        setSessions(sessRes.data)
        setUnreadCount(notifRes.data.content.filter(n => !n.read).length)
      } catch (e: unknown) {
        const err = e as { name?: string }
        if (err.name !== 'CanceledError') toast.error(parseApiError(e))
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  const confirmed = sessions.filter(s => s.status === 'CONFIRMED')
  const pending = sessions.filter(s => s.status === 'PENDING')

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">Hola, {user?.name} 👋</h1>
        <p className="text-muted mt-1">
          {user?.role === 'MENTOR' ? 'Panel de mentor' : 'Panel de estudiante'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-xl"><Calendar className="text-primary-600" size={24} /></div>
          <div>
            <p className="text-2xl font-bold text-text">{confirmed.length}</p>
            <p className="text-sm text-muted">Sesiones confirmadas</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-xl"><BookOpen className="text-yellow-600" size={24} /></div>
          <div>
            <p className="text-2xl font-bold text-text">{pending.length}</p>
            <p className="text-sm text-muted">Pendientes</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4" onClick={() => navigate('/notifications')}>
          <div className="p-3 bg-red-100 rounded-xl"><Bell className="text-red-600" size={24} /></div>
          <div>
            <p className="text-2xl font-bold text-text">{unreadCount}</p>
            <p className="text-sm text-muted">Notificaciones sin leer</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Próximas sesiones</h2>
            <Button variant="ghost" onClick={() => navigate('/sessions')}>Ver todas</Button>
          </div>
          {confirmed.length === 0 ? (
            <p className="text-muted text-sm text-center py-6">No tienes sesiones próximas</p>
          ) : (
            <div className="space-y-3">
              {confirmed.slice(0, 3).map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-surface-alt rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-text">{s.topic}</p>
                    <p className="text-xs text-muted">{s.date} · {s.startTime} - {s.endTime}</p>
                  </div>
                  <Badge label="Confirmada" color="green" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Acciones rápidas</h2>
          </div>
          <div className="space-y-2">
            {user?.role === 'STUDENT' && (
              <Button variant="secondary" className="w-full justify-start gap-3" onClick={() => navigate('/mentors')}>
                <Users size={18} className="text-primary-600" /> Explorar mentores
              </Button>
            )}
            {user?.role === 'MENTOR' && (
              <Button variant="secondary" className="w-full justify-start gap-3" onClick={() => navigate('/mentor/profile')}>
                <Users size={18} className="text-primary-600" /> Editar perfil de mentor
              </Button>
            )}
            <Button variant="secondary" className="w-full justify-start gap-3" onClick={() => navigate('/sessions')}>
              <Calendar size={18} className="text-primary-600" /> Mis sesiones
            </Button>
            <Button variant="secondary" className="w-full justify-start gap-3" onClick={() => navigate('/notifications')}>
              <Bell size={18} className="text-red-500" /> Notificaciones {unreadCount > 0 && `(${unreadCount})`}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
