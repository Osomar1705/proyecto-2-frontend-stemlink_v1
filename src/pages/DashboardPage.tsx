import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { sessionsApi } from '../api/sessions.api'
import { notificationsApi } from '../api/notifications.api'
import { AsyncContent } from '../components/ui/AsyncContent'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { PageHero } from '../components/ui/PageHero'
import { StatCard } from '../components/ui/StatCard'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { ArrowRight, Bell, BookOpen, Calendar, CheckCircle2, Clock3, GraduationCap, Sparkles, TrendingUp, UserRound, Users } from 'lucide-react'
import type { MentorshipSessionResponse } from '../types'
import toast from 'react-hot-toast'

function formatSessionDate(value: string) {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const loadDashboard = useCallback(async (signal: AbortSignal) => {
    const [sessRes, notifRes] = await Promise.all([
      sessionsApi.list(undefined, signal),
      notificationsApi.list({ page: 0, size: 50 }, signal),
    ])

    return {
      sessions: sessRes.data,
      unreadCount: notifRes.data.content.filter((notification) => !notification.read).length,
    }
  }, [])

  const { data, loading, error, reload } = useAsyncResource({
    initialData: { sessions: [] as MentorshipSessionResponse[], unreadCount: 0 },
    load: loadDashboard,
    onError: (message) => toast.error(message),
  })

  const { sessions, unreadCount } = data

  const confirmed = sessions.filter(s => s.status === 'CONFIRMED')
  const pending = sessions.filter(s => s.status === 'PENDING')
  const completed = sessions.filter(s => s.status === 'COMPLETED')
  const nextSessions = confirmed.slice(0, 3)
  const totalSessions = sessions.length
  const completionRate = totalSessions > 0 ? Math.round((completed.length / totalSessions) * 100) : 0
  const primaryLabel = user?.role === 'MENTOR' ? 'Mi perfil de mentor' : 'Explorar mentores'
  const primaryAction = () => navigate(user?.role === 'MENTOR' ? '/mentor/profile' : '/mentors')

  const stats = [
    {
      title: 'Sesiones completadas',
      value: completed.length,
      helper: `${completionRate}% del total`,
      icon: CheckCircle2,
      iconClass: 'bg-primary-50 text-primary-600',
    },
    {
      title: 'Sesiones confirmadas',
      value: confirmed.length,
      helper: nextSessions.length > 0 ? `${nextSessions.length} próximas agendadas` : 'Sin próximas sesiones',
      icon: Calendar,
      iconClass: 'bg-accent-100 text-accent-600',
    },
    {
      title: 'Reservas pendientes',
      value: pending.length,
      helper: pending.length > 0 ? 'Requieren seguimiento' : 'Sin pendientes ahora',
      icon: Clock3,
      iconClass: 'bg-accent-100 text-accent-600',
    },
    {
      title: 'Notificaciones nuevas',
      value: unreadCount,
      helper: unreadCount > 0 ? 'Hay actividad por revisar' : 'Todo al día',
      icon: Bell,
      iconClass: 'bg-primary-100 text-primary-700',
    },
  ]

  const quickActions = [
    {
      key: 'primary',
      title: user?.role === 'MENTOR' ? 'Perfil profesional' : 'Explorar mentores',
      description: user?.role === 'MENTOR'
        ? 'Actualiza tu bio, enlaces y disponibilidad para recibir más reservas.'
        : 'Descubre expertos STEM y encuentra el acompañamiento adecuado para tus metas.',
      icon: user?.role === 'MENTOR' ? GraduationCap : Users,
      tone: 'bg-primary-50 text-primary-600',
      onClick: primaryAction,
    },
    {
      key: 'sessions',
      title: 'Mis sesiones',
      description: 'Visualiza tus mentorías confirmadas, pendientes y completadas.',
      icon: Calendar,
      tone: 'bg-accent-100 text-accent-600',
      onClick: () => navigate('/sessions'),
    },
    {
      key: 'notifications',
      title: 'Notificaciones',
      description: unreadCount > 0
        ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} por revisar.`
        : 'Tu centro de alertas está al día.',
      icon: Bell,
      tone: 'bg-accent-100 text-accent-600',
      onClick: () => navigate('/notifications'),
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Inicio' }, { label: 'Dashboard' }]} />

      <AsyncContent
        loading={loading}
        error={error}
        errorIcon={<BookOpen size={48} />}
        errorTitle="No pudimos cargar tu panel"
        onRetry={reload}
      >
      <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <PageHero
          badge={(
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
              <Sparkles size={16} className="text-accent-500" aria-hidden />
              {user?.role === 'MENTOR' ? 'Panel de mentor' : 'Panel de estudiante'}
            </div>
          )}
          title="¡Bienvenido a STEM Link!"
          description={`Hola, ${user?.name}. Revisa tu actividad, prioriza tus sesiones y mantén tu progreso visible desde un solo panel.`}
          actions={(
            <>
              <Button onClick={primaryAction}>
                {primaryLabel} <ArrowRight size={16} />
              </Button>
              <Button variant="secondary" onClick={() => navigate('/sessions')}>
                Ver sesiones
              </Button>
            </>
          )}
          footer={(
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-surface/80 p-4 ring-1 ring-border/60">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Actividad total</p>
                <p className="mt-2 text-2xl font-bold text-text">{totalSessions}</p>
                <p className="mt-1 text-sm text-muted">sesiones registradas en tu cuenta</p>
              </div>
              <div className="rounded-2xl bg-surface/80 p-4 ring-1 ring-border/60">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Progreso</p>
                <p className="mt-2 text-2xl font-bold text-text">{completionRate}%</p>
                <p className="mt-1 text-sm text-muted">de sesiones marcadas como completadas</p>
              </div>
              <div className="rounded-2xl bg-surface/80 p-4 ring-1 ring-border/60">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Estado actual</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge label={`${confirmed.length} confirmadas`} color="success" />
                  <Badge label={`${pending.length} pendientes`} color="warning" />
                </div>
              </div>
            </div>
          )}
        />

        <div className="grid gap-4">
          <Card className="border-border/60 bg-surface/90 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Resumen de hoy</p>
                <p className="mt-2 text-2xl font-bold text-text">
                  {nextSessions.length > 0 ? `${nextSessions.length} sesión${nextSessions.length !== 1 ? 'es' : ''}` : 'Sin agenda'}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {nextSessions.length > 0
                    ? 'Tienes sesiones confirmadas listas para seguimiento.'
                    : 'Explora mentores o espera nuevas confirmaciones para continuar.'}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50/80">
                <TrendingUp size={22} className="text-primary-600" aria-hidden />
              </div>
            </div>
          </Card>

          <Card
            onClick={() => navigate('/notifications')}
            className="border-border bg-surface p-6 hover:border-primary-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Centro de alertas</p>
                <p className="mt-2 text-2xl font-bold text-text">{unreadCount}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {unreadCount > 0
                    ? 'Revisa confirmaciones, cambios o recordatorios pendientes.'
                    : 'No tienes novedades pendientes por revisar.'}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-100/80">
                <Bell size={22} className="text-accent-600" aria-hidden />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ title, value, helper, icon, iconClass }) => (
          <StatCard
            key={title}
            title={title}
            value={value}
            helper={helper}
            icon={icon}
            tone={iconClass}
          />
        ))}
      </div>

      <div className="mb-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text">Acciones rápidas</h2>
            <p className="mt-1 text-sm text-muted">Accede a las áreas con mayor impacto para tu actividad.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quickActions.map(({ key, title, description, icon: Icon, tone, onClick }) => (
          <Card
            key={key}
            className="group border-border bg-surface p-6 hover:border-primary-200"
            onClick={onClick}
          >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                <Icon size={24} aria-hidden />
              </div>
              <h3 className="mb-1 font-bold text-text">{title}</h3>
              <p className="text-sm leading-6 text-muted">{description}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary-600">
                Ir ahora <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text">Próximas sesiones</h2>
              <p className="mt-1 text-sm text-muted">Tus encuentros confirmados más cercanos.</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/sessions')}>Ver todas</Button>
          </div>

          {nextSessions.length === 0 ? (
            <Card className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                <Calendar size={24} className="text-primary-600" aria-hidden />
              </div>
              <p className="text-sm text-muted">No tienes sesiones próximas</p>
              <Button variant="secondary" onClick={() => navigate('/mentors')} className="mt-5">
                Explorar mentores
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {nextSessions.map(s => (
                <Card key={s.id} className="group border-border bg-surface p-6 hover:border-primary-200">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 transition-colors group-hover:bg-primary-100">
                      <Calendar className="text-primary-600" size={24} aria-hidden />
                    </div>
                    <Badge label="Confirmada" color="success" />
                  </div>
                  <h3 className="font-bold text-text">{s.topic}</h3>
                  <div className="mt-3 space-y-2 text-sm text-muted">
                    <p>{formatSessionDate(s.date)} · {s.startTime} - {s.endTime}</p>
                    <p>
                      {user?.role === 'STUDENT' ? `Mentor: ${s.mentorName}` : `Estudiante: ${s.studentName}`}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => navigate('/sessions')} className="mt-5 !px-0 text-primary-600 hover:!bg-transparent hover:underline">
                    Ver detalle
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text">Resumen operativo</h2>
            <p className="mt-1 text-sm text-muted">Indicadores rápidos para priorizar tu siguiente acción.</p>
          </div>

          <Card className="border-border bg-surface p-6 shadow-sm">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text">Sesiones con seguimiento inmediato</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Confirmadas y pendientes concentradas en un solo vistazo.
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50">
                  <BookOpen size={20} className="text-primary-600" aria-hidden />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted">Confirmadas</span>
                    <span className="text-lg font-bold text-text">{confirmed.length}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted">Pendientes</span>
                    <span className="text-lg font-bold text-text">{pending.length}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted">Completadas</span>
                    <span className="text-lg font-bold text-text">{completed.length}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-text">Progreso de sesiones</p>
                  <span className="text-sm font-semibold text-primary-600">{completionRate}%</span>
                </div>
                <div className="h-2 rounded-full bg-border/70">
                  <div
                    className="h-2 rounded-full bg-primary-600 transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-muted">
                  Este indicador usa únicamente el estado actual de las sesiones que ya devuelve el backend.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={() => navigate('/sessions')}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-alt px-4 py-3 text-left transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-3">
                    <Calendar size={18} className="text-primary-600" aria-hidden />
                    <span className="text-sm font-medium text-text">Gestionar sesiones</span>
                  </span>
                  <ArrowRight size={16} className="text-muted" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/notifications')}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-alt px-4 py-3 text-left transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-3">
                    <UserRound size={18} className="text-primary-600" aria-hidden />
                    <span className="text-sm font-medium text-text">Revisar alertas</span>
                  </span>
                  <ArrowRight size={16} className="text-muted" aria-hidden />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </AsyncContent>
    </div>
  )
}
