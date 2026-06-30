import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { sessionsApi } from '../api/sessions.api'
import { bookingsApi } from '../api/bookings.api'
import type { MentorshipSessionResponse } from '../types'
import { AsyncContent } from '../components/ui/AsyncContent'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Modal } from '../components/ui/Modal'
import { PageHero } from '../components/ui/PageHero'
import { StatCard } from '../components/ui/StatCard'
import { EmptyState } from '../components/ui/EmptyState'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { useAuth } from '../contexts/AuthContext'
import { parseApiError } from '../utils/errors'
import { Calendar, CheckCircle2, Clock, History, Sparkles, Star, UserRound, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const SESSION_FILTERS = ['', 'CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'] as const
type SessionStatus = Exclude<(typeof SESSION_FILTERS)[number], ''>
type BadgeColor = 'success' | 'warning' | 'danger' | 'neutral'

const statusColor: Record<SessionStatus, BadgeColor> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  CANCELLED: 'danger',
  COMPLETED: 'success',
}

const statusLabel: Record<SessionStatus, string> = {
  CONFIRMED: 'Confirmada',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
}

const DEFAULT_FEEDBACK = { stars: 5, mentorComments: '', impactRecord: '' }
const feedbackSchema = z.object({
  stars: z.number().min(1, 'Selecciona una calificación válida').max(5, 'Selecciona una calificación válida'),
  mentorComments: z.string().trim().min(10, 'Escribe al menos 10 caracteres'),
  impactRecord: z.string().trim().min(10, 'Describe el impacto en al menos 10 caracteres'),
})

type FeedbackForm = z.infer<typeof feedbackSchema>

function getStatusColor(status: string): BadgeColor {
  return status in statusColor ? statusColor[status as SessionStatus] : 'neutral'
}

function getStatusLabel(status: string) {
  return status in statusLabel ? statusLabel[status as SessionStatus] : status
}

function parseDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatSessionDate(value: string) {
  const date = parseDate(value)
  if (!date) return value

  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function compareSessionsByDate(a: MentorshipSessionResponse, b: MentorshipSessionResponse) {
  const aDate = parseDate(a.date)?.getTime() ?? 0
  const bDate = parseDate(b.date)?.getTime() ?? 0
  if (aDate !== bDate) return aDate - bDate
  return a.startTime.localeCompare(b.startTime)
}

function SessionSkeleton() {
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border/60">
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-5 w-40 rounded bg-surface-alt" />
            <div className="h-4 w-32 rounded bg-surface-alt" />
          </div>
          <div className="h-6 w-24 rounded-full bg-surface-alt" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-14 rounded-xl bg-surface-alt" />
          <div className="h-14 rounded-xl bg-surface-alt" />
          <div className="h-14 rounded-xl bg-surface-alt" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-surface-alt" />
      </div>
    </div>
  )
}

function SessionCard({
  session,
  role,
  actionLoadingId,
  onConfirm,
  onCancel,
  onOpenFeedback,
}: {
  session: MentorshipSessionResponse
  role: 'STUDENT' | 'MENTOR' | undefined
  actionLoadingId: number | null
  onConfirm: (id: number) => void
  onCancel: (id: number) => void
  onOpenFeedback: (id: number) => void
}) {
  const counterpartLabel = role === 'STUDENT' ? 'Mentor' : 'Estudiante'
  const counterpartName = role === 'STUDENT' ? session.mentorName : session.studentName
  const isPendingMentorAction = role === 'MENTOR' && session.status === 'PENDING'
  const canLeaveFeedback = role === 'STUDENT' && session.status === 'COMPLETED'

  return (
    <Card className="border-border/60 bg-surface/90 p-6 shadow-sm transition-all hover:shadow-lg">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-text">{counterpartName}</h3>
              <Badge label={getStatusLabel(session.status)} color={getStatusColor(session.status)} />
            </div>
            <p className="mt-2 font-semibold text-primary-600">{session.topic}</p>
          </div>

          {(isPendingMentorAction || canLeaveFeedback) && (
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {isPendingMentorAction && (
                <>
                  <Button
                    loading={actionLoadingId === session.id}
                    disabled={actionLoadingId !== null}
                    onClick={() => onConfirm(session.id)}
                  >
                    Confirmar
                  </Button>
                  <Button
                    variant="danger"
                    loading={actionLoadingId === session.id}
                    disabled={actionLoadingId !== null}
                    onClick={() => onCancel(session.id)}
                  >
                    Rechazar
                  </Button>
                </>
              )}

              {canLeaveFeedback && (
                <Button variant="secondary" onClick={() => onOpenFeedback(session.id)}>
                  <Star size={14} /> Dejar feedback
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-surface-alt/70 px-4 py-3 ring-1 ring-border/60">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Fecha</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-text">
              <Calendar size={15} className="text-primary-600" aria-hidden />
              {formatSessionDate(session.date)}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-alt/70 px-4 py-3 ring-1 ring-border/60">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Horario</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-text">
              <Clock size={15} className="text-primary-600" aria-hidden />
              {session.startTime} - {session.endTime}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-alt/70 px-4 py-3 ring-1 ring-border/60">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{counterpartLabel}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-text">
              <UserRound size={15} className="text-primary-600" aria-hidden />
              {counterpartName}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function SessionsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('')
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; sessionId: number | null }>({ open: false, sessionId: null })
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: feedbackErrors, isSubmitting: submitting, isValid },
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: DEFAULT_FEEDBACK,
    mode: 'onChange',
  })

  const load = useCallback(async (signal: AbortSignal) => {
    const res = await sessionsApi.list(filter || undefined, signal)
    return res.data
  }, [filter])

  const { data: sessions, loading, error, reload } = useAsyncResource<MentorshipSessionResponse[]>({
    initialData: [],
    load,
    onError: (message) => toast.error(message),
  })

  const handleConfirm = async (bookingId: number) => {
    setActionLoadingId(bookingId)
    try {
      await bookingsApi.updateStatus(bookingId, 'CONFIRMED')
      toast.success('Reserva confirmada')
      reload()
    } catch (e) {
      toast.error(parseApiError(e))
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleCancel = async (bookingId: number) => {
    setActionLoadingId(bookingId)
    try {
      await bookingsApi.updateStatus(bookingId, 'CANCELLED')
      toast.success('Reserva cancelada')
      reload()
    } catch (e) {
      toast.error(parseApiError(e))
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleFeedback = async (data: FeedbackForm) => {
    if (!feedbackModal.sessionId) return

    try {
      await sessionsApi.submitFeedback(feedbackModal.sessionId, {
        stars: data.stars,
        mentorComments: data.mentorComments.trim(),
        impactRecord: data.impactRecord.trim(),
      })
      toast.success('¡Gracias por tu feedback!')
      setFeedbackModal({ open: false, sessionId: null })
      reset(DEFAULT_FEEDBACK)
      reload()
    } catch (e) {
      toast.error(parseApiError(e))
    }
  }

  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, sessionId: null })
    reset(DEFAULT_FEEDBACK)
  }

  const openFeedbackModal = (sessionId: number) => {
    reset(DEFAULT_FEEDBACK)
    setFeedbackModal({ open: true, sessionId })
  }

  const selectedStars = watch('stars')

  const sortedSessions = useMemo(
    () => [...sessions].sort(compareSessionsByDate),
    [sessions],
  )

  const confirmedSessions = sortedSessions.filter(session => session.status === 'CONFIRMED')
  const pendingSessions = sortedSessions.filter(session => session.status === 'PENDING')
  const completedSessions = sortedSessions.filter(session => session.status === 'COMPLETED')
  const cancelledSessions = sortedSessions.filter(session => session.status === 'CANCELLED')
  const historySessions = sortedSessions.filter(session => session.status === 'COMPLETED' || session.status === 'CANCELLED')
  const calendarSessions = sortedSessions.filter(session => session.status === 'CONFIRMED' || session.status === 'PENDING')

  const stats = [
    {
      title: 'Confirmadas',
      value: confirmedSessions.length,
      helper: 'Sesiones listas para realizarse',
      icon: CheckCircle2,
      tone: 'bg-primary-50 text-primary-600',
    },
    {
      title: 'Pendientes',
      value: pendingSessions.length,
      helper: 'Sesiones esperando decisión',
      icon: Clock,
      tone: 'bg-accent-100 text-accent-600',
    },
    {
      title: 'Completadas',
      value: completedSessions.length,
      helper: 'Base del historial de trabajo',
      icon: History,
      tone: 'bg-accent-100 text-accent-600',
    },
    {
      title: 'Canceladas',
      value: cancelledSessions.length,
      helper: 'Sesiones no realizadas',
      icon: XCircle,
      tone: 'bg-surface-alt text-muted',
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/dashboard' }, { label: 'Sesiones' }]} />

      <div className="mb-8">
        <PageHero
          badge={(
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
              <Calendar size={16} className="text-primary-600" aria-hidden />
              Gestión de sesiones
            </div>
          )}
          title="Mis sesiones"
          description="Revisa próximas mentorías, confirma acciones pendientes y conserva un historial claro de tu actividad."
          aside={(
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
              <div className="rounded-2xl bg-surface/80 px-4 py-3 shadow-sm ring-1 ring-border/60">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Vista activa</p>
                <p className="mt-1 text-sm font-semibold text-text">
                  {filter ? `Filtro por ${getStatusLabel(filter)}` : 'Todas las sesiones'}
                </p>
              </div>
              <div className="rounded-2xl bg-surface/80 px-4 py-3 shadow-sm ring-1 ring-border/60">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Resultados</p>
                <p className="mt-1 text-sm font-semibold text-text">
                  {sessions.length} cargadas
                </p>
              </div>
            </div>
          )}
          footer={(
            <div className="flex flex-wrap gap-2 rounded-3xl bg-surface/70 p-4 ring-1 ring-border/60">
              {SESSION_FILTERS.map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  aria-pressed={filter === status}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-all ${filter === status ? 'bg-primary-600 text-surface ring-primary-600' : 'bg-surface text-muted ring-border/60 hover:text-text hover:ring-primary-400'}`}
                >
                  {status ? getStatusLabel(status) : 'Todas'}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <AsyncContent
        loading={loading}
        error={error}
        isEmpty={sessions.length === 0}
        loadingFallback={(
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border/60">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 w-24 rounded bg-surface-alt" />
                    <div className="h-8 w-16 rounded bg-surface-alt" />
                    <div className="h-4 w-40 rounded bg-surface-alt" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <SessionSkeleton />
              <SessionSkeleton />
            </div>
          </div>
        )}
        errorIcon={<Calendar size={48} />}
        errorTitle="No pudimos cargar tus sesiones"
        onRetry={reload}
        emptyIcon={<Calendar size={48} />}
        emptyTitle={filter ? `No hay sesiones ${getStatusLabel(filter).toLowerCase()}` : 'No tienes sesiones'}
        emptyDescription={filter
          ? 'Prueba cambiando el filtro para revisar otros estados.'
          : 'Reserva una sesión con un mentor para comenzar.'}
      >
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ title, value, helper, icon, tone }) => (
              <StatCard
                key={title}
                title={title}
                value={value}
                helper={helper}
                icon={icon}
                tone={tone}
              />
            ))}
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="border-border/70 bg-surface/90 p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-text">Calendario</h2>
                  <p className="mt-1 text-sm text-muted">
                    Próximas sesiones confirmadas o pendientes de respuesta.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-alt/80 px-3 py-1 text-xs font-medium text-muted ring-1 ring-border/60">
                  <Sparkles size={14} className="text-accent-500" aria-hidden />
                  Agenda actual
                </div>
              </div>

              {calendarSessions.length === 0 ? (
                <EmptyState
                  icon={<Calendar size={40} />}
                  title="Sin sesiones próximas"
                  description="Cuando tengas sesiones confirmadas o pendientes aparecerán aquí."
                />
              ) : (
                <div className="space-y-4">
                  {calendarSessions.map(session => (
                    <div key={session.id} className="rounded-2xl bg-surface-alt/70 p-4 ring-1 ring-border/60">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-text">{session.topic}</p>
                            <Badge label={getStatusLabel(session.status)} color={getStatusColor(session.status)} />
                          </div>
                          <p className="mt-2 text-sm text-muted">
                            {user?.role === 'STUDENT' ? session.mentorName : session.studentName}
                          </p>
                        </div>
                        <div className="grid gap-2 text-sm text-muted sm:text-right">
                          <span className="inline-flex items-center gap-2 sm:justify-end">
                            <Calendar size={15} className="text-primary-600" aria-hidden />
                            {formatSessionDate(session.date)}
                          </span>
                          <span className="inline-flex items-center gap-2 sm:justify-end">
                            <Clock size={15} className="text-primary-600" aria-hidden />
                            {session.startTime} - {session.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="border-border/70 bg-surface/90 p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-text">Historial</h2>
                <p className="mt-1 text-sm text-muted">
                  Sesiones completadas o canceladas dentro del resultado actual.
                </p>
              </div>

              {historySessions.length === 0 ? (
                <EmptyState
                  icon={<History size={40} />}
                  title="Sin historial disponible"
                  description="Aquí verás las sesiones completadas o canceladas cuando existan."
                />
              ) : (
                <div className="space-y-3">
                  {historySessions.map(session => (
                    <div key={session.id} className="rounded-2xl bg-surface-alt/70 px-4 py-4 ring-1 ring-border/60">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-text">{session.topic}</p>
                            <Badge label={getStatusLabel(session.status)} color={getStatusColor(session.status)} />
                          </div>
                          <p className="mt-2 text-sm text-muted">
                            {user?.role === 'STUDENT' ? session.mentorName : session.studentName}
                          </p>
                        </div>
                        <div className="text-sm text-muted sm:text-right">
                          <p>{formatSessionDate(session.date)}</p>
                          <p className="mt-1">{session.startTime} - {session.endTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-text">Todas las sesiones</h2>
              <p className="mt-1 text-sm text-muted">
                Vista completa del resultado cargado, con acciones según rol y estado.
              </p>
            </div>

            <div className="space-y-4">
              {sortedSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  role={user?.role}
                  actionLoadingId={actionLoadingId}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  onOpenFeedback={openFeedbackModal}
                />
              ))}
            </div>
          </div>
        </>
      </AsyncContent>

      <Modal open={feedbackModal.open} onClose={closeFeedbackModal} title="Enviar feedback">
        <form className="space-y-4" onSubmit={handleSubmit(handleFeedback)} noValidate>
          <div className="rounded-xl bg-surface-alt px-4 py-3 ring-1 ring-border/60">
            <p className="text-sm font-semibold text-text">Feedback de la sesión</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Este formulario conserva el mismo envío actual al backend y solo cambia la interfaz.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">Calificación</label>
            <div className="flex gap-2" role="radiogroup" aria-label="Calificación de la sesión">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValue('stars', n, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                  aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                  aria-pressed={n <= selectedStars}
                  className={`text-2xl transition-transform hover:scale-110 ${n <= selectedStars ? 'text-accent-500' : 'text-border'}`}
                >
                  ★
                </button>
              ))}
            </div>
            {feedbackErrors.stars && <span className="text-xs text-primary-700">{feedbackErrors.stars.message}</span>}
          </div>

          <div>
            <label htmlFor="feedback-mentor-comments" className="mb-1 block text-sm font-medium text-text">
              Comentarios sobre el mentor
            </label>
            <textarea
              id="feedback-mentor-comments"
              rows={3}
              {...register('mentorComments')}
              aria-invalid={!!feedbackErrors.mentorComments}
              aria-describedby={feedbackErrors.mentorComments ? 'feedback-mentor-comments-error' : undefined}
              className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 ${feedbackErrors.mentorComments ? 'border-primary-600' : 'border-border'}`}
            />
            {feedbackErrors.mentorComments && (
              <span id="feedback-mentor-comments-error" className="text-xs text-primary-700">
                {feedbackErrors.mentorComments.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="feedback-impact" className="mb-1 block text-sm font-medium text-text">
              ¿Qué impacto tuvo esta sesión?
            </label>
            <textarea
              id="feedback-impact"
              rows={2}
              {...register('impactRecord')}
              aria-invalid={!!feedbackErrors.impactRecord}
              aria-describedby={feedbackErrors.impactRecord ? 'feedback-impact-error' : undefined}
              className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 ${feedbackErrors.impactRecord ? 'border-primary-600' : 'border-border'}`}
            />
            {feedbackErrors.impactRecord && (
              <span id="feedback-impact-error" className="text-xs text-primary-700">
                {feedbackErrors.impactRecord.message}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeFeedbackModal}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={submitting} disabled={!isValid || submitting}>
              Enviar feedback
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
