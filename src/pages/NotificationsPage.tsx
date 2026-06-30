import { useCallback, useEffect, useMemo, useState } from 'react'
import { notificationsApi } from '../api/notifications.api'
import type { NotificationResponse, Page } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { usePagination } from '../hooks/usePagination'
import { parseApiError } from '../utils/errors'
import { Bell, Calendar, CheckCheck, CheckCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

function formatNotificationDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function detectNotificationTone(message: string) {
  const content = message.toLowerCase()
  if (content.includes('confirm')) return 'confirmation'
  if (content.includes('recordatorio') || content.includes('recuerda')) return 'reminder'
  return 'general'
}

function NotificationSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-5 w-32 rounded bg-surface-alt" />
            <div className="h-4 w-80 rounded bg-surface-alt" />
            <div className="h-4 w-64 rounded bg-surface-alt" />
          </div>
          <div className="h-5 w-24 rounded bg-surface-alt" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-surface-alt" />
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const { page, size, setPage, setSize } = usePagination(10)
  const [data, setData] = useState<Page<NotificationResponse> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [markingIds, setMarkingIds] = useState<number[]>([])

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      const res = await notificationsApi.list({ page, size }, signal)
      setData(res.data)
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
  }, [page, size])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load, retryKey])

  const retryNotifications = () => setRetryKey(prev => prev + 1)
  const unreadCount = data?.content.filter(notification => !notification.read).length || 0

  const visibleNotifications = useMemo(() => (
    filter === 'unread'
      ? data?.content.filter(notification => !notification.read)
      : data?.content
  ), [data?.content, filter])

  const markRead = async (id: number) => {
    setMarkingIds(prev => [...prev, id])
    try {
      await notificationsApi.markRead(id)
      setData(prev => prev ? {
        ...prev,
        content: prev.content.map(notification => notification.id === id ? { ...notification, read: true } : notification),
      } : null)
    } catch (e) {
      toast.error(parseApiError(e))
    } finally {
      setMarkingIds(prev => prev.filter(value => value !== id))
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
        <div className="relative p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary-100/70 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-100/60 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
                <Bell size={16} className="text-primary-600" aria-hidden />
                Centro de alertas
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Notificaciones</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Revisa recordatorios, confirmaciones y actividad reciente generada por tus sesiones y reservas.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt px-4 py-4 lg:max-w-sm">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Resumen</p>
              <p className="mt-2 text-sm font-semibold text-text">
                {unreadCount > 0
                  ? `${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer`
                  : 'No hay alertas pendientes'}
              </p>
              <p className="mt-1 text-sm text-muted">
                {data?.totalElements ?? 0} elemento{(data?.totalElements ?? 0) !== 1 ? 's' : ''} en la página actual del backend.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-surface-alt/60 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${filter === 'all' ? 'border-primary-600 bg-primary-600 text-surface' : 'border-border bg-surface text-muted hover:bg-surface-alt hover:text-text'}`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${filter === 'unread' ? 'border-primary-600 bg-primary-600 text-surface' : 'border-border bg-surface text-muted hover:bg-surface-alt hover:text-text'}`}
            >
              No leídas ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <NotificationSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <EmptyState
            icon={<Bell size={48} />}
            title="No pudimos cargar tus notificaciones"
            description={error}
            action={{ label: 'Reintentar', onClick: retryNotifications }}
          />
        </div>
      ) : data?.content.length === 0 || visibleNotifications?.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <EmptyState
            icon={<Bell size={48} />}
            title={filter === 'unread' ? 'Sin notificaciones nuevas' : 'Sin notificaciones'}
            description={filter === 'unread' ? 'No tienes notificaciones pendientes por revisar.' : 'Cuando tengas actividad aparecerá aquí.'}
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {visibleNotifications?.map(notification => {
              const tone = detectNotificationTone(notification.message)
              const icon = tone === 'confirmation'
                ? <CheckCircle size={20} className="text-secondary-600" aria-hidden />
                : tone === 'reminder'
                  ? <Calendar size={20} className="text-accent-500" aria-hidden />
                  : <Bell size={20} className="text-primary-600" aria-hidden />

              return (
                <Card
                  key={notification.id}
                  className={`border transition-all hover:shadow-md ${!notification.read ? 'border-primary-300 bg-primary-50/70' : 'border-border bg-surface'}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface">
                      {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold text-text">
                              {!notification.read ? 'Nueva actualización' : 'Actualización'}
                            </h2>
                            {!notification.read && <span className="inline-block size-2 rounded-full bg-primary-600" aria-hidden />}
                          </div>

                          <p className="mt-2 text-sm leading-7 text-muted">{notification.message}</p>
                        </div>

                        <div className="shrink-0 text-sm text-muted sm:text-right">
                          <p>{formatNotificationDate(notification.createdAt)}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {!notification.read ? (
                          <Button
                            variant="secondary"
                            loading={markingIds.includes(notification.id)}
                            disabled={markingIds.length > 0}
                            onClick={() => markRead(notification.id)}
                          >
                            <CheckCheck size={14} />
                            Marcar como leída
                          </Button>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                            <Sparkles size={12} className="text-accent-500" aria-hidden />
                            Leída
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {data && filter === 'all' && (
            <div className="mt-6">
              <Card className="border-border/70 p-5 sm:p-6">
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
      )}
    </div>
  )
}
