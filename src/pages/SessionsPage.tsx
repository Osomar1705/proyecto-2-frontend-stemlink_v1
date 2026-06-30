import { useCallback, useEffect, useMemo, useState } from 'react'
import { sessionsApi } from '../api/sessions.api'
import { bookingsApi } from '../api/bookings.api'
import type { MentorshipSessionResponse } from '../types'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
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
type FeedbackForm = typeof DEFAULT_FEEDBACK
type FeedbackErrors = Partial<Record<keyof FeedbackForm, string>>

function getStatusColor(status: string): BadgeColor {
  return status in statusColor ? statusColor[status as SessionStatus] : 'neutral'
}

function getStatusLabel(status: string) {
  return status in statusLabel ? statusLabel[status as SessionStatus] : status
}

function validateFeedback(feedback: FeedbackForm): FeedbackErrors {
  const errors: FeedbackErrors = {}

  if (feedback.stars < 1 || feedback.stars > 5) errors.stars = 'Selecciona una calificación válida'
  if (feedback.mentorComments.trim().length < 10) errors.mentorComments = 'Escribe al menos 10 caracteres'
  if (feedback.impactRecord.trim().length < 10) errors.impactRecord = 'Describe el impacto en al menos 10 caracteres'

  return errors
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
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
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
    <Card className="border-border bg-surface p-6 shadow-sm transition-all hover:shadow-lg">
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
          <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Fecha</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-text">
              <Calendar size={15} className="text-primary-600" aria-hidden />
              {formatSessionDate(session.date)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Horario</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-text">
              <Clock size={15} className="text-primary-600" aria-hidden />
              {session.startTime} - {session.endTime}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
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
  const [sessions, setSessions] = useState<MentorshipSessionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [filter, setFilter] = useState('')
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; sessionId: number | null }>({ open: false, sessionId: null })
  const [feedback, setFeedback] = useState<FeedbackForm>(DEFAULT_FEEDBACK)
  const [feedbackErrors, setFeedbackErrors] = useState<FeedbackErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      const res = await sessionsApi.list(filter || undefined, signal)
      setSessions(res.data)
    } catch (e: unknown) {
      const err = e as { name?: string }
      if (err.name !== 'CanceledError') {
        const message = parseApiError(e)
        setError(message)
        setSessions([])
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load, retryKey])

  const retrySessions = () => setRetryKey(prev => prev + 1)

  const handleConfirm = async (bookingId: number) => {
    setActionLoadingId(bookingId)
    try {
      await bookingsApi.updateStatus(bookingId, 'CONFIRMED')
      toast.success('Reserva confirmada')
      load()
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
      load()
    } catch (e) {
      toast.error(parseApiError(e))
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleFeedback = async () => {
    if (!feedbackModal.sessionId) return
    const errors = validateFeedback(feedback)
    setFeedbackErrors(errors)
    if (Object.keys(errors).length > 0) {
      toast.error('Revisa tu feedback antes de enviarlo')
      return
    }

    setSubmitting(true)
    try {
      await sessionsApi.submitFeedback(feedbackModal.sessionId, {
        stars: feedback.stars,
        mentorComments: feedback.mentorComments.trim(),
        impactRecord: feedback.impactRecord.trim(),
      })
      toast.success('¡Gracias por tu feedback!')
      setFeedbackModal({ open: false, sessionId: null })
      setFeedback(DEFAULT_FEEDBACK)
      setFeedbackErrors({})
      load()
    } catch (e) {
      toast.error(parseApiError(e))
    } finally {
      setSubmitting(false)
    }
  }

  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, sessionId: null })
    setFeedback(DEFAULT_FEEDBACK)
    setFeedbackErrors({})
  }

  const openFeedbackModal = (sessionId: number) => {
    setFeedback(DEFAULT_FEEDBACK)
    setFeedbackErrors({})
    setFeedbackModal({ open: true, sessionId })
  }

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
      tone: 'bg-secondary-100 text-secondary-700',
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
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
        <div className="relative p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary-100/70 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-100/60 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
                <Calendar size={16} className="text-primary-600" aria-hidden />
                Gestión de sesiones
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Mis sesiones</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Revisa próximas mentorías, confirma acciones pendientes y conserva un historial claro de tu actividad.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt px-4 py-4 lg:max-w-sm">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Vista activa</p>
              <p className="mt-2 text-sm font-semibold text-text">
                {filter ? `Filtro por ${getStatusLabel(filter)}` : 'Todas las sesiones'}
              </p>
              <p className="mt-1 text-sm text-muted">
                {sessions.length} resultado{sessions.length !== 1 ? 's' : ''} cargado{sessions.length !== 1 ? 's' : ''} desde el backend.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-surface-alt/60 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap gap-2">
            {SESSION_FILTERS.map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${filter === status ? 'border-primary-600 bg-primary-600 text-surface shadow-sm' : 'border-border bg-surface text-muted hover:bg-surface-alt hover:text-text'}`}
              >
                {status ? getStatusLabel(status) : 'Todas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
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
      ) : error ? (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <EmptyState
            icon={<Calendar size={48} />}
            title="No pudimos cargar tus sesiones"
            description={error}
            action={{ label: 'Reintentar', onClick: retrySessions }}
          />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <EmptyState
            icon={<Calendar size={48} />}
            title={filter ? `No hay sesiones ${getStatusLabel(filter).toLowerCase()}` : 'No tienes sesiones'}
            description={filter
              ? 'Prueba cambiando el filtro para revisar otros estados.'
              : 'Reserva una sesión con un mentor para comenzar.'}
          />
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ title, value, helper, icon: Icon, tone }) => (
              <Card key={title} className="border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-text">{value}</p>
                    <p className="mt-2 text-sm text-muted">{helper}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
                    <Icon size={22} aria-hidden />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="border-border bg-surface p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-text">Calendario</h2>
                  <p className="mt-1 text-sm text-muted">
                    Próximas sesiones confirmadas o pendientes de respuesta.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-muted">
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
                    <div key={session.id} className="rounded-xl border border-border bg-surface-alt p-4">
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

            <Card className="border-border bg-surface p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text">Historial</h2>
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
                    <div key={session.id} className="rounded-xl border border-border bg-surface-alt px-4 py-4">
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
              <h2 className="text-2xl font-bold text-text">Todas las sesiones</h2>
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
      )}

      <Modal open={feedbackModal.open} onClose={closeFeedbackModal} title="Enviar feedback">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
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
                  onClick={() => setFeedback(f => ({ ...f, stars: n }))}
                  aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                  aria-pressed={n <= feedback.stars}
                  className={`text-2xl transition-transform hover:scale-110 ${n <= feedback.stars ? 'text-accent-500' : 'text-border'}`}
                >
                  ★
                </button>
              ))}
            </div>
            {feedbackErrors.stars && <span className="text-xs text-primary-700">{feedbackErrors.stars}</span>}
          </div>

          <div>
            <label htmlFor="feedback-mentor-comments" className="mb-1 block text-sm font-medium text-text">
              Comentarios sobre el mentor
            </label>
            <textarea
              id="feedback-mentor-comments"
              rows={3}
              value={feedback.mentorComments}
              onChange={e => setFeedback(f => ({ ...f, mentorComments: e.target.value }))}
              aria-invalid={!!feedbackErrors.mentorComments}
              aria-describedby={feedbackErrors.mentorComments ? 'feedback-mentor-comments-error' : undefined}
              className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 ${feedbackErrors.mentorComments ? 'border-primary-600' : 'border-border'}`}
            />
            {feedbackErrors.mentorComments && (
              <span id="feedback-mentor-comments-error" className="text-xs text-primary-700">
                {feedbackErrors.mentorComments}
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
              value={feedback.impactRecord}
              onChange={e => setFeedback(f => ({ ...f, impactRecord: e.target.value }))}
              aria-invalid={!!feedbackErrors.impactRecord}
              aria-describedby={feedbackErrors.impactRecord ? 'feedback-impact-error' : undefined}
              className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 ${feedbackErrors.impactRecord ? 'border-primary-600' : 'border-border'}`}
            />
            {feedbackErrors.impactRecord && (
              <span id="feedback-impact-error" className="text-xs text-primary-700">
                {feedbackErrors.impactRecord}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={closeFeedbackModal}>
              Cancelar
            </Button>
            <Button className="flex-1" loading={submitting} onClick={handleFeedback}>
              Enviar feedback
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
