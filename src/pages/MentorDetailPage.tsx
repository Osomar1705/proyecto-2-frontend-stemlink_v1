import { useCallback, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { mentorsApi } from '../api/mentors.api'
import { bookingsApi } from '../api/bookings.api'
import type { MentorProfileResponse, AvailabilityBlockDTO } from '../types'
import { AsyncContent } from '../components/ui/AsyncContent'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { useAuth } from '../contexts/AuthContext'
import { parseApiError } from '../utils/errors'
import { ArrowLeft, AtSign, Award, Calendar, Clock, ExternalLink, GraduationCap, Sparkles, Users, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import { MentorAvatar } from '../components/mentors/MentorAvatar'
import { getMentorInstagram, getMentorPhoto } from '../utils/mentorProfileAssets'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const DAY_ES: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}
const EMPTY_BOOKING_FORM = { date: '', availabilityBlockId: '', topic: '' }
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0]

const bookingSchema = z.object({
  topic: z.string().trim().min(1, 'Ingresa el tema de la sesión'),
  date: z.string().min(1, 'Selecciona una fecha').refine((value) => value >= TOMORROW, {
    message: 'La fecha debe ser posterior a hoy',
  }),
  availabilityBlockId: z.string().min(1, 'Selecciona un horario disponible'),
})

type BookingForm = z.infer<typeof bookingSchema>
interface MentorDetailResource {
  mentor: MentorProfileResponse | null
  availability: AvailabilityBlockDTO[]
}

function parseMentorId(id: string | undefined): number | null {
  if (!id) return null
  const parsed = Number(id)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const mentorId = parseMentorId(id)
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [bookingOpen, setBookingOpen] = useState(false)
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: EMPTY_BOOKING_FORM,
  })

  const loadMentorDetail = useCallback(async (signal: AbortSignal): Promise<MentorDetailResource> => {
    if (!mentorId) {
      return { mentor: null, availability: [] }
    }

    const [mentorResponse, availabilityResponse] = await Promise.all([
      mentorsApi.getById(mentorId, signal),
      isAuthenticated
        ? mentorsApi.getAvailability(mentorId, signal)
        : Promise.resolve({ data: [] as AvailabilityBlockDTO[] }),
    ])

    return {
      mentor: mentorResponse.data,
      availability: availabilityResponse.data,
    }
  }, [mentorId, isAuthenticated])

  const { data, loading, error, reload } = useAsyncResource<MentorDetailResource>({
    initialData: { mentor: null, availability: [] },
    load: loadMentorDetail,
    onError: (message) => toast.error(message),
  })

  const mentor = data.mentor
  const availability = data.availability
  const mentorPhoto = mentor ? (mentor.photoUrl || getMentorPhoto(mentor.id)) : null
  const instagramUrl = mentor ? getMentorInstagram(mentor.id) : ''
  const selectedAvailabilityId = watch('availabilityBlockId')
  const selectedAvailability = useMemo(
    () => availability.find((slot) => String(slot.id) === selectedAvailabilityId) ?? null,
    [availability, selectedAvailabilityId],
  )

  const availabilityOptions = useMemo(
    () => [
      { value: '', label: 'Selecciona un bloque disponible' },
      ...availability.map((slot) => ({
        value: String(slot.id),
        label: `${DAY_ES[slot.dayOfWeek]} · ${slot.startTime} - ${slot.endTime}`,
      })),
    ],
    [availability],
  )

  const handleBook = async (data: BookingForm) => {
    try {
      if (!mentorId) throw new Error('Mentor inválido')

      if (!selectedAvailability) {
        throw new Error('Selecciona un bloque disponible')
      }

      const selectedDate = new Date(`${data.date}T00:00:00`)
      const selectedDay = DAYS[(selectedDate.getDay() + 6) % 7]

      if (Number.isNaN(selectedDate.getTime()) || selectedDay !== selectedAvailability.dayOfWeek) {
        toast.error(`La fecha debe corresponder a ${DAY_ES[selectedAvailability.dayOfWeek]}.`)
        return
      }

      await bookingsApi.create({
        mentorProfileId: mentorId,
        date: data.date,
        availabilityBlockId: Number(data.availabilityBlockId),
        topic: data.topic.trim(),
      })
      toast.success('¡Reserva enviada! El mentor la revisará pronto.')
      setBookingOpen(false)
      reset(EMPTY_BOOKING_FORM)
    } catch (e) {
      toast.error(parseApiError(e))
    }
  }

  const closeBookingModal = () => {
    setBookingOpen(false)
    reset(EMPTY_BOOKING_FORM)
  }

  const availabilityDays = useMemo(
    () => DAYS.filter(day => availability.some(a => a.dayOfWeek === day)),
    [availability],
  )

  if (!mentorId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/mentors')} className="flex items-center gap-2 text-sm text-muted transition-all duration-300 ease-in-out hover:text-primary-600">
          <ArrowLeft size={16} /> Volver a mentores
        </button>
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <EmptyState
            icon={<Users size={48} />}
            title="Mentor inválido"
            description="El identificador del mentor no es válido. Vuelve al listado para elegir otro perfil."
            action={{ label: 'Ver mentores', onClick: () => navigate('/mentors') }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Mentores', to: '/mentors' }, { label: mentor?.name ?? 'Detalle' }]} />

      <button
        onClick={() => navigate('/mentors')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-all duration-300 ease-in-out hover:text-primary-700"
      >
        <ArrowLeft size={18} /> Volver a mentores
      </button>

      <AsyncContent
        loading={loading}
        error={error}
        isEmpty={!mentor}
        errorIcon={<Users size={48} />}
        errorTitle="No pudimos cargar el perfil del mentor"
        onRetry={reload}
        emptyIcon={<Users size={48} />}
        emptyTitle="Mentor no encontrado"
        emptyDescription="Revisa el enlace o vuelve al listado para elegir otro mentor."
        emptyAction={{ label: 'Ver mentores', onClick: () => navigate('/mentors') }}
      >
        {mentor ? <>
          <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-card overflow-hidden rounded-[2rem] border border-border/70 shadow-sm">
            <div className="relative p-6 sm:p-8">
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
                  <Sparkles size={16} className="text-accent-500" aria-hidden />
                  Perfil de mentor STEM
                </div>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                  <MentorAvatar name={mentor!.name} src={mentorPhoto} size="xl" className="mx-auto sm:mx-0" />

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
                      {mentor!.name}
                    </h1>
                    <p className="mt-2 text-base text-muted sm:text-lg">
                      Mentor especializado en áreas STEM
                    </p>
                    <p className="mt-4 max-w-3xl leading-8 text-text">
                      {mentor!.bio || 'Mentor especializado en áreas STEM listo para acompañarte con sesiones personalizadas.'}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                      {mentor!.linkedinUrl && (
                        <a
                          href={mentor!.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-primary-400 hover:text-primary-700 hover:shadow-[0_10px_24px_rgba(79,70,229,0.08)]"
                        >
                          <ExternalLink size={14} className="text-primary-600" aria-hidden />
                          LinkedIn
                        </a>
                      )}
                      {instagramUrl && (
                        <a
                          href={instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-fuchsia-300 hover:text-fuchsia-700 hover:shadow-[0_10px_24px_rgba(217,70,239,0.10)]"
                        >
                          <AtSign size={14} className="text-fuchsia-500" aria-hidden />
                          Instagram
                        </a>
                      )}
                      {mentor!.videoCallUrl && (
                        <a
                          href={mentor!.videoCallUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-accent-400 hover:text-accent-700 hover:shadow-[0_10px_24px_rgba(13,148,136,0.08)]"
                        >
                          <Video size={14} className="text-accent-500" aria-hidden />
                          Videollamada
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 border-t border-border bg-surface-alt/60 p-6 sm:grid-cols-3 sm:p-8">
              <div className="panel-shell rounded-xl px-4 py-4 text-center">
                <div className="mb-2 inline-flex items-center gap-1 font-bold text-text">
                  <Award size={16} className="text-accent-500" aria-hidden />
                  {mentor!.skills?.length || 0}
                </div>
                <p className="text-xs text-muted">Especialidades registradas</p>
              </div>
              <div className="panel-shell rounded-xl px-4 py-4 text-center">
                <div className="mb-2 inline-flex items-center gap-1 font-bold text-text">
                  <Calendar size={16} className="text-primary-600" aria-hidden />
                  {availability.length}
                </div>
                <p className="text-xs text-muted">Bloques disponibles</p>
              </div>
              <div className="panel-shell rounded-xl px-4 py-4 text-center">
                <div className="mb-2 inline-flex items-center gap-1 font-bold text-text">
                  <GraduationCap size={16} className="text-primary-600" aria-hidden />
                  STEM
                </div>
                <p className="text-xs text-muted">Área principal</p>
              </div>
            </div>
          </div>

          <Card className="flex h-fit flex-col gap-5 border-border/80 p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-text">Acción principal</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Revisa el perfil, valida la disponibilidad y agenda una sesión cuando estés listo.
              </p>
            </div>

            {isAuthenticated && user?.role === 'STUDENT' ? (
              <Button
                onClick={() => setBookingOpen(true)}
                disabled={availability.length === 0}
                className="w-full bg-accent-500 hover:bg-accent-600"
              >
                <Calendar size={16} /> {availability.length === 0 ? 'Sin horarios disponibles' : 'Reservar sesión'}
              </Button>
            ) : !isAuthenticated ? (
              <Button variant="secondary" onClick={() => navigate('/login')} className="w-full">
                Inicia sesión para reservar
              </Button>
            ) : null}

            <div className="rounded-[1.35rem] border border-border bg-surface-alt p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Resumen</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted">Especialidades</span>
                  <span className="text-sm font-semibold text-text">{mentor!.skills?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted">Disponibilidad</span>
                  <span className="text-sm font-semibold text-text">{availability.length}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted">Visibilidad</span>
                  <span className="text-sm font-semibold text-text">{isAuthenticated ? 'Autenticada' : 'Pública'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-border bg-surface-alt p-4">
              <p className="text-sm font-semibold text-text">Disponibilidad</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {isAuthenticated
                  ? availability.length > 0
                    ? 'Este mentor ya publicó horarios disponibles para coordinar sesiones.'
                    : 'Aún no hay horarios publicados por este mentor.'
                  : 'Inicia sesión para consultar los bloques disponibles y reservar.'}
              </p>
            </div>
          </Card>
        </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/80 p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text">Especialidades</h2>
              <p className="mt-1 text-sm text-muted">
                Áreas técnicas publicadas por el mentor dentro de la plataforma.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {mentor!.skills?.map(skill => (
                <Badge key={skill.id} label={skill.name} />
              ))}
              {!mentor!.skills?.length && <Badge label="STEM" color="neutral" />}
            </div>
          </Card>

          <Card className="border-border/80 p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-text">Canales del mentor</h2>
                <p className="mt-1 text-sm text-muted">
                  Espacios para conectar mejor antes de la sesión y validar su presencia profesional.
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50">
                <Users size={20} className="text-primary-600" aria-hidden />
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">LinkedIn</p>
                <p className="mt-2 text-sm font-medium text-text">
                  {mentor!.linkedinUrl || 'No disponible'}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                <div className="flex items-center gap-2">
                  <AtSign size={15} className="text-accent-500" aria-hidden />
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Instagram</p>
                </div>
                <p className="mt-2 text-sm font-medium text-text">
                  {instagramUrl || 'No disponible'}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Videollamada</p>
                <p className="mt-2 text-sm font-medium text-text break-all">
                  {mentor!.videoCallUrl || 'No disponible'}
                </p>
              </div>
            </div>
          </Card>
        </div>

          <div className="mt-8">
          <Card className="border border-border/80 bg-surface p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-text">
                <Calendar size={18} className="text-primary-600" aria-hidden />
                Disponibilidad
              </h2>
              <span className="rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-muted">
                {availability.length} bloques
              </span>
            </div>

            {!isAuthenticated ? (
              <div className="rounded-2xl border border-border bg-surface-alt p-6">
                <EmptyState
                  icon={<Clock size={40} />}
                  title="Inicia sesión para ver la disponibilidad"
                  description="El listado de horarios se muestra solo a usuarios autenticados."
                  action={{ label: 'Iniciar sesión', onClick: () => navigate('/login') }}
                />
              </div>
            ) : availability.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface-alt p-6">
                <EmptyState
                  icon={<Clock size={40} />}
                  title="Sin disponibilidad publicada"
                  description="Este mentor aún no ha registrado bloques de horario disponibles."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {availabilityDays.map(day => (
                  <div key={day} className="rounded-[1.35rem] border border-border bg-surface-alt p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                    <p className="mb-3 text-sm font-semibold text-text">{DAY_ES[day]}</p>
                    <div className="space-y-2">
                      {availability.filter(slot => slot.dayOfWeek === day).map(slot => (
                        <div key={slot.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted">
                          <Clock size={16} className="text-primary-600" aria-hidden />
                          <span className="font-medium text-text">{slot.startTime} - {slot.endTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          </div>
        </> : null}
      </AsyncContent>

      <Modal open={bookingOpen} onClose={closeBookingModal} title="Reservar sesión con mentor">
        <form className="space-y-4" onSubmit={handleSubmit(handleBook)}>
          <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
            <p className="text-sm font-semibold text-text">{mentor?.name ?? 'Mentor STEM'}</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Elige una fecha compatible con el bloque del mentor. Reserva con claridad, sin cruces y usando los horarios reales publicados.
            </p>
          </div>

          <Input
            id="booking-topic"
            label="Tema de la sesión"
            placeholder="Ej: Introducción a Java"
            autoComplete="off"
            error={errors.topic?.message}
            {...register('topic')}
          />
          <Input
            id="booking-date"
            label="Fecha"
            type="date"
            min={TOMORROW}
            error={errors.date?.message}
            {...register('date')}
          />

          <Select
            id="booking-availability"
            label="Bloque disponible"
            options={availabilityOptions}
            error={errors.availabilityBlockId?.message}
            helperText={selectedAvailability
              ? `Horario seleccionado: ${DAY_ES[selectedAvailability.dayOfWeek]} de ${selectedAvailability.startTime} a ${selectedAvailability.endTime}.`
              : 'Selecciona uno de los bloques publicados por el mentor.'}
            {...register('availabilityBlockId')}
          />

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeBookingModal}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={isSubmitting}>
              Confirmar reserva
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
