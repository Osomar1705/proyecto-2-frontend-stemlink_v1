import { useCallback, useState } from 'react'
import { bookingsApi } from '../api/bookings.api'
import type { BookingResponse, Page } from '../types'
import { AsyncContent } from '../components/ui/AsyncContent'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Pagination } from '../components/ui/Pagination'
import { PageHero } from '../components/ui/PageHero'
import { StatCard } from '../components/ui/StatCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { usePagination } from '../hooks/usePagination'
import { useAuth } from '../contexts/AuthContext'
import { parseApiError } from '../utils/errors'
import { Calendar, CheckCircle2, Clock, History, Sparkles, UserRound, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const SESSION_FILTERS = ['', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const
type SessionStatus = Exclude<(typeof SESSION_FILTERS)[number], ''>
type BadgeColor = 'success' | 'warning' | 'danger' | 'neutral'

const statusColor: Record<SessionStatus, BadgeColor> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  CANCELLED: 'danger',
}

const statusLabel: Record<SessionStatus, string> = {
  CONFIRMED: 'Confirmada',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelada',
}

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

function compareBookingsByDate(a: BookingResponse, b: BookingResponse) {
  const aDate = parseDate(a.date)?.getTime() ?? 0
  const bDate = parseDate(b.date)?.getTime() ?? 0
  if (aDate !== bDate) return aDate - bDate
  return a.startTime.localeCompare(b.startTime)
}

interface PendingAction {
  bookingId: number
  type: 'cancel' | 'reject'
}

function SessionSkeleton() {
  return (
    <div className="fade-in-section rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border/60">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="skeleton-shimmer h-5 w-40 rounded" />
            <div className="skeleton-shimmer h-4 w-32 rounded" />
          </div>
          <div className="skeleton-shimmer h-6 w-24 rounded-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="skeleton-shimmer h-14 rounded-xl" />
          <div className="skeleton-shimmer h-14 rounded-xl" />
          <div className="skeleton-shimmer h-14 rounded-xl" />
        </div>
        <div className="skeleton-shimmer h-10 w-36 rounded-lg" />
      </div>
    </div>
  )
}

function SessionCard({
  booking,
  role,
  actionLoadingId,
  onConfirm,
  onCancel,
}: {
  booking: BookingResponse
  role: 'STUDENT' | 'MENTOR' | undefined
  actionLoadingId: number | null
  onConfirm: (id: number) => void
  onCancel: (id: number) => void
}) {
  const counterpartLabel = role === 'STUDENT' ? 'Mentor' : 'Estudiante'
  const counterpartName = role === 'STUDENT' ? booking.mentorName : booking.studentName
  const isPendingMentorAction = role === 'MENTOR' && booking.status === 'PENDING'
  const canStudentCancel = role === 'STUDENT' && booking.status !== 'CANCELLED'

  return (
    <Card className="border-border bg-surface p-6 hover:border-primary-200">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-text">{counterpartName}</h3>
              <Badge label={getStatusLabel(booking.status)} color={getStatusColor(booking.status)} />
            </div>
            <p className="mt-2 font-semibold text-primary-600">{booking.topic}</p>
          </div>

          {(isPendingMentorAction || canStudentCancel) && (
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {isPendingMentorAction && (
                <>
                  <Button
                    loading={actionLoadingId === booking.id}
                    disabled={actionLoadingId !== null}
                    onClick={() => onConfirm(booking.id)}
                  >
                    Confirmar
                  </Button>
                  <Button
                    variant="danger"
                    loading={false}
                    disabled={actionLoadingId !== null}
                    onClick={() => onCancel(booking.id)}
                  >
                    Rechazar
                  </Button>
                </>
              )}

              {canStudentCancel && !isPendingMentorAction && (
                <Button
                  variant="danger"
                  loading={false}
                  disabled={actionLoadingId !== null}
                  onClick={() => onCancel(booking.id)}
                >
                  Cancelar
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
              {formatSessionDate(booking.date)}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-alt/70 px-4 py-3 ring-1 ring-border/60">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Horario</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-text">
              <Clock size={15} className="text-primary-600" aria-hidden />
              {booking.startTime} - {booking.endTime}
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
  const { page, size, setPage, setSize } = usePagination(10)
  const [filter, setFilter] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)

  const load = useCallback(async (signal: AbortSignal) => {
    try {
      const res = await bookingsApi.list({
        page,
        size,
        status: filter || undefined,
      }, signal)
      return res.data
    } catch {
      return {
        content: [],
        number: page,
        size,
        totalElements: 0,
        totalPages: 0,
      }
    }
  }, [filter, page, size])

  const { data, loading, error, reload } = useAsyncResource<Page<BookingResponse> | null>({
    initialData: null,
    load,
    onError: (message) => toast.error(message),
  })

  const bookings = data?.content ?? []

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
      toast.success('Reserva actualizada')
      reload()
    } catch (e) {
      toast.error(parseApiError(e))
    } finally {
      setActionLoadingId(null)
    }
  }

  const sortedBookings = [...bookings].sort(compareBookingsByDate)

  const confirmedBookings = sortedBookings.filter((booking) => booking.status === 'CONFIRMED')
  const pendingBookings = sortedBookings.filter((booking) => booking.status === 'PENDING')
  const cancelledBookings = sortedBookings.filter((booking) => booking.status === 'CANCELLED')
  const historyBookings = sortedBookings.filter((booking) => booking.status === 'CANCELLED')
  const calendarBookings = sortedBookings.filter((booking) => booking.status === 'CONFIRMED' || booking.status === 'PENDING')
  const pendingBooking = pendingAction ? bookings.find((booking) => booking.id === pendingAction.bookingId) ?? null : null
  const pendingActionTitle = pendingAction?.type === 'reject' ? 'Rechazar solicitud' : 'Cancelar reserva'
  const pendingActionDescription = pendingAction?.type === 'reject'
    ? 'Esta acción marcará la reserva como cancelada y el estudiante verá el cambio de estado.'
    : 'Esta acción cancelará tu reserva actual y actualizará su estado para ambas partes.'

  const confirmPendingAction = async () => {
    if (!pendingAction) return

    setPendingAction(null)
    await handleCancel(pendingAction.bookingId)
  }

  const stats = [
    {
      title: 'Confirmadas',
      value: confirmedBookings.length,
      helper: 'Listas para ejecutarse',
      icon: CheckCircle2,
      tone: 'bg-primary-50 text-primary-600',
    },
    {
      title: 'Pendientes',
      value: pendingBookings.length,
      helper: 'Esperando respuesta',
      icon: Clock,
      tone: 'bg-accent-100 text-accent-600',
    },
    {
      title: 'Canceladas',
      value: cancelledBookings.length,
      helper: 'No seguirán activas',
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
              Gestión de reservas
            </div>
          )}
          title="Mis sesiones"
          description="Revisa reservas reales del backend, responde pendientes y mantén una vista clara de tu agenda."
          aside={(
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
              <div className="panel-shell rounded-2xl px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Vista activa</p>
                <p className="mt-1 text-sm font-semibold text-text">
                  {filter ? `Filtro por ${getStatusLabel(filter)}` : 'Todas las reservas'}
                </p>
              </div>
              <div className="panel-shell rounded-2xl px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Resultados</p>
                <p className="mt-1 text-sm font-semibold text-text">
                  {data?.totalElements ?? 0} totales
                </p>
              </div>
            </div>
          )}
          footer={(
            <div className="flex flex-wrap gap-2 rounded-[1.4rem] border border-border bg-surface p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              {SESSION_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setFilter(status)
                    setPage(0)
                  }}
                  aria-pressed={filter === status}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-all duration-300 ease-in-out ${filter === status ? 'bg-primary-600 text-surface ring-primary-600 shadow-[0_10px_22px_rgba(79,70,229,0.12)]' : 'bg-surface text-muted ring-border/60 hover:-translate-y-0.5 hover:text-text hover:ring-primary-400 hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)]'}`}
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
        isEmpty={bookings.length === 0}
        loadingFallback={(
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
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
        errorTitle="No pudimos cargar tus reservas"
        onRetry={reload}
        emptyIcon={<Calendar size={48} />}
        emptyTitle={filter ? `No hay reservas ${getStatusLabel(filter).toLowerCase()}` : 'No tienes reservas'}
        emptyDescription={filter
          ? 'Prueba cambiando el filtro para revisar otros estados.'
          : 'Reserva una sesión con un mentor para comenzar.'}
      >
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
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
                  <h2 className="text-2xl font-bold tracking-tight text-text">Agenda</h2>
                  <p className="mt-1 text-sm text-muted">
                    Reservas confirmadas o pendientes dentro de la página actual.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-alt/80 px-3 py-1 text-xs font-medium text-muted ring-1 ring-border/60">
                  <Sparkles size={14} className="text-accent-500" aria-hidden />
                  Agenda actual
                </div>
              </div>

              {calendarBookings.length === 0 ? (
                <EmptyState
                  icon={<Calendar size={40} />}
                  title="Sin sesiones próximas"
                  description="Cuando tengas reservas confirmadas o pendientes aparecerán aquí."
                />
              ) : (
                <div className="space-y-4">
                  {calendarBookings.map((booking) => (
                    <div key={booking.id} className="rounded-2xl bg-surface-alt/70 p-4 ring-1 ring-border/60">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-text">{booking.topic}</p>
                            <Badge label={getStatusLabel(booking.status)} color={getStatusColor(booking.status)} />
                          </div>
                          <p className="mt-2 text-sm text-muted">
                            {user?.role === 'STUDENT' ? booking.mentorName : booking.studentName}
                          </p>
                        </div>
                        <div className="grid gap-2 text-sm text-muted sm:text-right">
                          <span className="inline-flex items-center gap-2 sm:justify-end">
                            <Calendar size={15} className="text-primary-600" aria-hidden />
                            {formatSessionDate(booking.date)}
                          </span>
                          <span className="inline-flex items-center gap-2 sm:justify-end">
                            <Clock size={15} className="text-primary-600" aria-hidden />
                            {booking.startTime} - {booking.endTime}
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
                  Reservas canceladas dentro del resultado cargado.
                </p>
              </div>

              {historyBookings.length === 0 ? (
                <EmptyState
                  icon={<History size={40} />}
                  title="Sin historial cancelado"
                  description="Aquí aparecerán reservas canceladas cuando existan."
                />
              ) : (
                <div className="space-y-3">
                  {historyBookings.map((booking) => (
                    <div key={booking.id} className="rounded-2xl bg-surface-alt/70 px-4 py-4 ring-1 ring-border/60">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-text">{booking.topic}</p>
                            <Badge label={getStatusLabel(booking.status)} color={getStatusColor(booking.status)} />
                          </div>
                          <p className="mt-2 text-sm text-muted">
                            {user?.role === 'STUDENT' ? booking.mentorName : booking.studentName}
                          </p>
                        </div>
                        <div className="text-sm text-muted sm:text-right">
                          <p>{formatSessionDate(booking.date)}</p>
                          <p className="mt-1">{booking.startTime} - {booking.endTime}</p>
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
              <h2 className="text-2xl font-bold tracking-tight text-text">Todas las reservas</h2>
              <p className="mt-1 text-sm text-muted">
                Vista completa de la página actual, con acciones según rol y estado.
              </p>
            </div>

            <div className="space-y-4">
              {sortedBookings.map((booking) => (
                <SessionCard
                  key={booking.id}
                  booking={booking}
                  role={user?.role}
                  actionLoadingId={actionLoadingId}
                  onConfirm={handleConfirm}
                  onCancel={(bookingId) => {
                    setPendingAction({
                      bookingId,
                      type: user?.role === 'MENTOR' ? 'reject' : 'cancel',
                    })
                  }}
                />
              ))}
            </div>
          </div>

          {data && (
            <div className="mt-6">
              <Card className="border-border/60 bg-surface/90 p-5 sm:p-6">
                <Pagination
                  page={data.number}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  size={data.size}
                  onPageChange={setPage}
                  onSizeChange={setSize}
                />
              </Card>
            </div>
          )}
        </>
      </AsyncContent>

      <Modal
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        title={pendingActionTitle}
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm leading-7 text-muted">
              {pendingActionDescription}
            </p>
            {pendingBooking && (
              <div className="rounded-2xl border border-border bg-surface-alt/70 px-4 py-3">
                <p className="font-semibold text-text">{pendingBooking.topic}</p>
                <p className="mt-1 text-sm text-muted">
                  {formatSessionDate(pendingBooking.date)} · {pendingBooking.startTime} - {pendingBooking.endTime}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setPendingAction(null)}>
              Volver
            </Button>
            <Button
              variant="danger"
              loading={pendingBooking ? actionLoadingId === pendingBooking.id : false}
              onClick={confirmPendingAction}
            >
              Confirmar acción
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
