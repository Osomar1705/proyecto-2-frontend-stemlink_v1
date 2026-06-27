import { useEffect, useState } from 'react'
import { notificationsApi } from '../api/notifications.api'
import type { NotificationResponse, Page } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { usePagination } from '../hooks/usePagination'
import { parseApiError } from '../utils/errors'
import { Bell, CheckCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const { page, size, setPage, setSize } = usePagination(10)
  const [data, setData] = useState<Page<NotificationResponse> | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const res = await notificationsApi.list({ page, size }, signal)
      setData(res.data)
    } catch (e: unknown) {
      const err = e as { name?: string }
      if (err.name !== 'CanceledError') toast.error(parseApiError(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [page, size])

  const markRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id)
      setData(prev => prev ? {
        ...prev,
        content: prev.content.map(n => n.id === id ? { ...n, read: true } : n),
      } : null)
    } catch (e) { toast.error(parseApiError(e)) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
        <p className="text-gray-500 mt-1">Mantente al día con tu actividad</p>
      </div>

      {loading ? <Spinner size="lg" /> : data?.content.length === 0 ? (
        <EmptyState icon={<Bell size={48} />} title="Sin notificaciones" description="Cuando tengas actividad aparecerá aquí." />
      ) : (
        <>
          <div className="space-y-2">
            {data?.content.map(n => (
              <Card key={n.id} className={`transition-colors ${!n.read ? 'border-indigo-200 bg-indigo-50/50' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleString('es-PE')}</p>
                    </div>
                  </div>
                  {!n.read && (
                    <Button variant="ghost" onClick={() => markRead(n.id)} className="!px-2 !py-1 flex-shrink-0">
                      <CheckCheck size={14} />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {data && (
            <Pagination
              page={data.number}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              size={data.size}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          )}
        </>
      )}
    </div>
  )
}
