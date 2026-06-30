import { useEffect, useState } from 'react'
import { authApi } from '../api/auth.api'
import { notificationsApi } from '../api/notifications.api'
import { sessionsApi } from '../api/sessions.api'
import type { UserResponse, MentorshipSessionResponse } from '../types'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'
import { parseApiError } from '../utils/errors'
import { Bell, Calendar, Mail, Sparkles, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'

type ProfileSummary = {
  user: UserResponse
  sessions: MentorshipSessionResponse[]
  unreadCount: number
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const [userRes, sessionsRes, notificationsRes] = await Promise.all([
          authApi.me(),
          sessionsApi.list(undefined, controller.signal),
          notificationsApi.list({ page: 0, size: 20 }, controller.signal),
        ])

        setData({
          user: userRes.data,
          sessions: sessionsRes.data,
          unreadCount: notificationsRes.data.content.filter((notification) => !notification.read).length,
        })
      } catch (e: unknown) {
        const err = e as { name?: string }
        if (err.name !== 'CanceledError') {
          const message = parseApiError(e)
          setError(message)
          setData(null)
          toast.error(message)
        }
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [retryKey])

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-border/70 bg-surface p-6 shadow-sm">
          <EmptyState
            icon={<UserRound size={48} />}
            title="No pudimos cargar tu perfil"
            description={error || 'No encontramos información del usuario.'}
            action={{ label: 'Reintentar', onClick: () => setRetryKey((value) => value + 1) }}
          />
        </div>
      </div>
    )
  }

  const completedSessions = data.sessions.filter((session) => session.status === 'COMPLETED').length
  const nextSessions = data.sessions.filter((session) => session.status === 'CONFIRMED' || session.status === 'PENDING').length

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
          <div className="relative p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary-100/70 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-100/60 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
                <Sparkles size={16} className="text-accent-500" aria-hidden />
                Perfil del estudiante
              </div>

              <div className="mt-6 flex flex-col items-center text-center">
                <div className="mb-5 flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-3xl font-bold text-surface shadow-lg">
                  {data.user.name.slice(0, 2).toUpperCase()}
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-text">{data.user.name}</h2>
                <p className="mt-2 text-sm text-muted">Tu resumen personal dentro de STEM Link.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-border bg-surface-alt/60 p-6 sm:grid-cols-3 sm:p-8">
            <div className="rounded-xl border border-border bg-surface px-4 py-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Próximas</p>
              <p className="mt-2 text-2xl font-bold text-text">{nextSessions}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Completadas</p>
              <p className="mt-2 text-2xl font-bold text-text">{completedSessions}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Alertas</p>
              <p className="mt-2 text-2xl font-bold text-text">{data.unreadCount}</p>
            </div>
          </div>
        </div>

        <Card className="border-border/70 p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text">Información principal</h2>
            <p className="mt-1 text-sm text-muted">
              Datos cargados desde tu sesión y actividad reciente.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface-alt p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <UserRound size={18} className="text-primary-600" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Nombre</p>
                  <p className="mt-1 text-sm text-muted">{data.user.name}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <Mail size={18} className="text-primary-600" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Correo</p>
                  <p className="mt-1 text-sm break-all text-muted">{data.user.email}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <Badge label="STUDENT" color="neutral" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Rol</p>
                  <p className="mt-1 text-sm text-muted">Cuenta activa como estudiante.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50">
              <Calendar size={20} className="text-primary-600" aria-hidden />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">Actividad</h2>
              <p className="mt-1 text-sm text-muted">Resumen de tus sesiones recientes.</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.sessions.slice(0, 4).map((session) => (
              <div key={session.id} className="rounded-xl border border-border bg-surface-alt px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-text">{session.topic}</p>
                  <Badge label={session.status} color="neutral" />
                </div>
                <p className="mt-2 text-sm text-muted">
                  {session.date} · {session.startTime} - {session.endTime}
                </p>
              </div>
            ))}

            {data.sessions.length === 0 && (
              <EmptyState
                icon={<Calendar size={36} />}
                title="Sin sesiones registradas"
                description="Cuando reserves tu primera mentoría verás su resumen aquí."
              />
            )}
          </div>
        </Card>

        <Card className="border-border/70 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50">
              <Bell size={20} className="text-primary-600" aria-hidden />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">Estado de alertas</h2>
              <p className="mt-1 text-sm text-muted">Lectura rápida de tu centro de notificaciones.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-alt p-5">
            <p className="text-sm font-semibold text-text">
              {data.unreadCount > 0
                ? `Tienes ${data.unreadCount} notificación${data.unreadCount !== 1 ? 'es' : ''} sin revisar.`
                : 'No tienes alertas pendientes.'}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Usa el panel de notificaciones para revisar recordatorios, cambios de estado y confirmaciones de sesiones.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
