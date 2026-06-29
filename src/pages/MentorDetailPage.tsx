import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mentorsApi } from '../api/mentors.api'
import { bookingsApi } from '../api/bookings.api'
import type { MentorProfileResponse, AvailabilityBlockDTO } from '../types'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { useAuth } from '../contexts/AuthContext'
import { parseApiError } from '../utils/errors'
import { ExternalLink, Video, Calendar, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
const DAY_ES: Record<string, string> = { MONDAY:'Lunes', TUESDAY:'Martes', WEDNESDAY:'Miércoles', THURSDAY:'Jueves', FRIDAY:'Viernes', SATURDAY:'Sábado', SUNDAY:'Domingo' }

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [mentor, setMentor] = useState<MentorProfileResponse | null>(null)
  const [availability, setAvailability] = useState<AvailabilityBlockDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '', topic: '' })

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const [mRes, aRes] = await Promise.all([
          mentorsApi.getById(Number(id), controller.signal),
          isAuthenticated ? mentorsApi.getAvailability(Number(id)) : Promise.resolve({ data: [] }),
        ])
        setMentor(mRes.data)
        setAvailability(aRes.data)
      } catch (e: unknown) {
        const err = e as { name?: string }
        if (err.name !== 'CanceledError') toast.error(parseApiError(e))
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [id, isAuthenticated])

  const handleBook = async () => {
    if (!form.date || !form.startTime || !form.endTime || !form.topic) {
      toast.error('Completa todos los campos')
      return
    }
    setSubmitting(true)
    try {
      await bookingsApi.create({ mentorProfileId: Number(id), ...form })
      toast.success('¡Reserva enviada! El mentor la revisará pronto.')
      setBookingOpen(false)
      setForm({ date: '', startTime: '', endTime: '', topic: '' })
    } catch (e) {
      toast.error(parseApiError(e))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!mentor) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <button onClick={() => navigate('/mentors')} className="flex items-center gap-2 text-sm text-muted hover:text-primary-600 transition-colors">
        <ArrowLeft size={16} /> Volver a mentores
      </button>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text">{mentor.name}</h1>
            <div className="flex gap-3">
              {mentor.linkedinUrl && (
                <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary-600 hover:underline">
                  <ExternalLink size={14} /> LinkedIn
                </a>
              )}
              {mentor.videoCallUrl && (
                <a href={mentor.videoCallUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-green-600 hover:underline">
                  <Video size={14} /> Videollamada
                </a>
              )}
            </div>
          </div>
          {isAuthenticated && user?.role === 'STUDENT' && (
            <Button onClick={() => setBookingOpen(true)} className="flex items-center gap-2">
              <Calendar size={16} /> Reservar sesión
            </Button>
          )}
        </div>

        <p className="text-text mt-4 leading-relaxed">{mentor.bio || 'Sin descripción'}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {mentor.skills?.map(s => <Badge key={s.id} label={s.name} />)}
        </div>
      </Card>

      {isAuthenticated && availability.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-primary-600" /> Disponibilidad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DAYS.filter(d => availability.some(a => a.dayOfWeek === d)).map(day => (
              <div key={day}>
                <p className="text-xs font-semibold text-muted mb-1">{DAY_ES[day]}</p>
                {availability.filter(a => a.dayOfWeek === day).map(a => (
                  <div key={a.id} className="text-sm text-text bg-primary-50 px-3 py-1.5 rounded-lg mb-1">
                    {a.startTime} – {a.endTime}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title="Reservar sesión con mentor">
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text">Tema de la sesión</label>
            <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="ej: Introducción a Java" className="px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text">Fecha</label>
            <input type="date" value={form.date} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text">Hora inicio</label>
              <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text">Hora fin</label>
              <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setBookingOpen(false)}>Cancelar</Button>
            <Button className="flex-1" loading={submitting} onClick={handleBook}>Confirmar reserva</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
