import { useEffect, useState } from 'react'
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
import { Calendar, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColor: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
  CONFIRMED: 'green', PENDING: 'yellow', CANCELLED: 'red', COMPLETED: 'green',
}

export default function SessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<MentorshipSessionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; sessionId: number | null }>({ open: false, sessionId: null })
  const [feedback, setFeedback] = useState({ stars: 5, mentorComments: '', impactRecord: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const res = await sessionsApi.list(filter || undefined, signal)
      setSessions(res.data)
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
  }, [filter])

  const handleConfirm = async (bookingId: number) => {
    try {
      await bookingsApi.updateStatus(bookingId, 'CONFIRMED')
      toast.success('Reserva confirmada')
      load()
    } catch (e) { toast.error(parseApiError(e)) }
  }

  const handleCancel = async (bookingId: number) => {
    try {
      await bookingsApi.updateStatus(bookingId, 'CANCELLED')
      toast.success('Reserva cancelada')
      load()
    } catch (e) { toast.error(parseApiError(e)) }
  }

  const handleFeedback = async () => {
    if (!feedbackModal.sessionId) return
    setSubmitting(true)
    try {
      await sessionsApi.submitFeedback(feedbackModal.sessionId, feedback)
      toast.success('¡Gracias por tu feedback!')
      setFeedbackModal({ open: false, sessionId: null })
      load()
    } catch (e) { toast.error(parseApiError(e)) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Mis Sesiones</h1>
        <p className="text-muted mt-1">Historial y próximas sesiones</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${filter === s ? 'bg-primary-600 text-surface border-primary-600' : 'border-border text-text hover:border-primary-400'}`}>
            {s || 'Todas'}
          </button>
        ))}
      </div>

      {loading ? <Spinner size="lg" /> : sessions.length === 0 ? (
        <EmptyState icon={<Calendar size={48} />} title="No tienes sesiones" description="Reserva una sesión con un mentor para comenzar." />
      ) : (
        <div className="space-y-3">
          {sessions.map(s => (
            <Card key={s.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text">{s.topic}</h3>
                    <Badge label={s.status} color={statusColor[s.status] || 'gray'} />
                  </div>
                  <p className="text-sm text-muted">
                    {s.date} · {s.startTime} – {s.endTime}
                  </p>
                  <p className="text-sm text-muted">
                    {user?.role === 'STUDENT' ? `Mentor: ${s.mentorName}` : `Estudiante: ${s.studentName}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {user?.role === 'MENTOR' && s.status === 'PENDING' && (
                    <>
                      <Button onClick={() => handleConfirm(s.id)}>Confirmar</Button>
                      <Button variant="danger" onClick={() => handleCancel(s.id)}>Rechazar</Button>
                    </>
                  )}
                  {user?.role === 'STUDENT' && s.status === 'COMPLETED' && (
                    <Button variant="secondary" onClick={() => setFeedbackModal({ open: true, sessionId: s.id })}>
                      <Star size={14} /> Dejar feedback
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={feedbackModal.open} onClose={() => setFeedbackModal({ open: false, sessionId: null })} title="Dejar feedback">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text block mb-1">Calificación</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setFeedback(f => ({ ...f, stars: n }))}
                  className={`text-2xl transition-transform hover:scale-110 ${n <= feedback.stars ? 'text-accent-500' : 'text-border'}`}>★</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text block mb-1">Comentarios sobre el mentor</label>
            <textarea rows={3} value={feedback.mentorComments} onChange={e => setFeedback(f => ({ ...f, mentorComments: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-text block mb-1">¿Qué impacto tuvo esta sesión?</label>
            <textarea rows={2} value={feedback.impactRecord} onChange={e => setFeedback(f => ({ ...f, impactRecord: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setFeedbackModal({ open: false, sessionId: null })}>Cancelar</Button>
            <Button className="flex-1" loading={submitting} onClick={handleFeedback}>Enviar feedback</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
