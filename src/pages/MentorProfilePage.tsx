import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { mentorsApi } from '../api/mentors.api'
import { authApi } from '../api/auth.api'
import type { TechnicalSkillDTO, AvailabilityBlockDTO } from '../types'
import { AsyncContent } from '../components/ui/AsyncContent'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHero } from '../components/ui/PageHero'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { parseApiError } from '../utils/errors'
import { Calendar, Camera, Clock, ExternalLink, Plus, Sparkles, Trash2, UserRound, Video } from 'lucide-react'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  bio: z.string().min(10, 'La bio debe tener al menos 10 caracteres'),
  videoCallUrl: z.string().url('URL inválida').or(z.literal('')),
  linkedinUrl: z.string().url('URL inválida').or(z.literal('')),
})

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const
const dayEnum = z.enum(DAYS)

const availabilitySchema = z.object({
  dayOfWeek: dayEnum,
  startTime: z.string().min(1, 'Selecciona la hora de inicio'),
  endTime: z.string().min(1, 'Selecciona la hora de fin'),
}).refine((data) => data.endTime > data.startTime, {
  path: ['endTime'],
  message: 'La hora de fin debe ser posterior al inicio',
})

type ProfileFormData = z.infer<typeof profileSchema>
type AvailabilityFormData = z.infer<typeof availabilitySchema>

const DAY_ES: Record<(typeof DAYS)[number], string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}

const DEFAULT_AVAILABILITY: AvailabilityFormData = {
  dayOfWeek: 'MONDAY',
  startTime: '09:00',
  endTime: '10:00',
}

type MentorProfileResource = {
  skills: TechnicalSkillDTO[]
  selectedSkills: number[]
  availability: AvailabilityBlockDTO[]
  profile: ProfileFormData
}

function compareAvailability(a: AvailabilityBlockDTO, b: AvailabilityBlockDTO) {
  const dayDiff = DAYS.indexOf(a.dayOfWeek as (typeof DAYS)[number]) - DAYS.indexOf(b.dayOfWeek as (typeof DAYS)[number])
  if (dayDiff !== 0) return dayDiff
  return a.startTime.localeCompare(b.startTime)
}

export default function MentorProfilePage() {
  const [skills, setSkills] = useState<TechnicalSkillDTO[]>([])
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])
  const [availability, setAvailability] = useState<AvailabilityBlockDTO[]>([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: '',
      videoCallUrl: '',
      linkedinUrl: '',
    },
  })

  const {
    register: registerAvailability,
    handleSubmit: handleAvailabilitySubmit,
    reset: resetAvailability,
    setError: setAvailabilityError,
    clearErrors: clearAvailabilityErrors,
    formState: { errors: availabilityErrors, isSubmitting: isAddingAvailability },
  } = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: DEFAULT_AVAILABILITY,
  })

  const bio = watch('bio')
  const videoCallUrl = watch('videoCallUrl')
  const linkedinUrl = watch('linkedinUrl')

  const loadMentorProfile = useCallback(async (_signal: AbortSignal) => {
    const authRes = await authApi.me()
    const mentorId = authRes.data.id
    const [tagsRes, profileRes, availabilityRes] = await Promise.all([
      mentorsApi.getTags(),
      mentorsApi.getById(mentorId),
      mentorsApi.getAvailability(mentorId),
    ])

    const resource: MentorProfileResource = {
      skills: tagsRes.data,
      selectedSkills: profileRes.data.skills?.map((skill) => skill.id) || [],
      availability: availabilityRes.data.sort(compareAvailability),
      profile: {
        bio: profileRes.data.bio || '',
        videoCallUrl: profileRes.data.videoCallUrl || '',
        linkedinUrl: profileRes.data.linkedinUrl || '',
      },
    }

    setSkills(resource.skills)
    setSelectedSkills(resource.selectedSkills)
    setAvailability(resource.availability)
    reset(resource.profile)

    return resource
  }, [reset])

  const { data, loading, error, reload } = useAsyncResource<MentorProfileResource | null>({
    initialData: null,
    load: loadMentorProfile,
    deps: [loadMentorProfile],
    onError: (message) => toast.error(message),
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await mentorsApi.updateProfile(data)
      await mentorsApi.updateTags(selectedSkills)
      toast.success('Perfil actualizado')
      reload()
    } catch (error) {
      toast.error(parseApiError(error))
    }
  }

  const onAddAvailability = async (data: AvailabilityFormData) => {
    const alreadyExists = availability.some((item) =>
      item.dayOfWeek === data.dayOfWeek &&
      item.startTime === data.startTime &&
      item.endTime === data.endTime,
    )

    if (alreadyExists) {
      setAvailabilityError('root', { message: 'Ya existe un bloque con ese día y horario' })
      toast.error('Ya existe un bloque con ese día y horario')
      return
    }

    try {
      const response = await mentorsApi.addAvailability(data)
      setAvailability((previous) => [...previous, response.data].sort(compareAvailability))
      clearAvailabilityErrors()
      resetAvailability(DEFAULT_AVAILABILITY)
      toast.success('Disponibilidad agregada')
    } catch (error) {
      toast.error(parseApiError(error))
    }
  }

  const deleteAvailability = async (id: number, label: string) => {
    if (!window.confirm(`¿Eliminar el bloque ${label}?`)) return

    try {
      await mentorsApi.deleteAvailability(id)
      setAvailability((previous) => previous.filter((item) => item.id !== id))
      toast.success('Disponibilidad eliminada')
    } catch (error) {
      toast.error(parseApiError(error))
    }
  }

  const groupedAvailability = useMemo(
    () => DAYS.filter((day) => availability.some((item) => item.dayOfWeek === day)),
    [availability],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/dashboard' }, { label: 'Mi perfil de mentor' }]} />

      <AsyncContent
        loading={loading}
        error={error}
        isEmpty={!data}
        errorIcon={<UserRound size={48} />}
        errorTitle="No pudimos cargar tu perfil"
        onRetry={reload}
        emptyIcon={<UserRound size={48} />}
        emptyTitle="No encontramos tu perfil"
        emptyDescription="Intenta recargar la vista para obtener nuevamente tus datos de mentor."
      >
        <div className="mb-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <PageHero
            badge={(
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
                <Sparkles size={16} className="text-accent-500" aria-hidden />
                Perfil público de mentor
              </div>
            )}
            title="Mi perfil"
            description="Actualiza cómo te ven los estudiantes dentro de STEM Link."
            aside={(
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-3xl font-bold text-surface shadow-lg">
                    STEM
                  </div>
                  <div className="absolute bottom-0 right-0 rounded-lg border border-border bg-surface p-2 text-muted shadow-sm">
                    <Camera size={16} aria-hidden />
                  </div>
                </div>
              </div>
            )}
            footer={(
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-surface px-4 py-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Skills</p>
                  <p className="mt-2 text-2xl font-bold text-text">{selectedSkills.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface px-4 py-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Horarios</p>
                  <p className="mt-2 text-2xl font-bold text-text">{availability.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface px-4 py-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Bio</p>
                  <p className="mt-2 text-2xl font-bold text-text">{bio?.trim().length || 0}</p>
                </div>
              </div>
            )}
          />

          <Card className="border-border/70 p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text">Información básica</h2>
              <p className="mt-1 text-sm text-muted">
                Define tu presentación, enlaces y especialidades visibles para estudiantes.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="mentor-bio" className="text-sm font-medium text-text">Bio</label>
                <textarea
                  id="mentor-bio"
                  rows={6}
                  {...register('bio')}
                  className="resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-muted focus:ring-2 focus:ring-primary-200"
                  placeholder="Cuéntales a los estudiantes sobre tu experiencia y en qué puedes ayudarlos..."
                />
                {errors.bio && <span className="text-xs text-primary-700">{errors.bio.message}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="URL de videollamada"
                  placeholder="https://meet.google.com/..."
                  error={errors.videoCallUrl?.message}
                  helperText="Enlace que usarás para tus sesiones."
                  {...register('videoCallUrl')}
                />
                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/..."
                  error={errors.linkedinUrl?.message}
                  helperText="Perfil profesional visible en tu ficha."
                  {...register('linkedinUrl')}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text">Habilidades</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const active = selectedSkills.includes(skill.id)
                    return (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => setSelectedSkills((previous) => previous.includes(skill.id)
                          ? previous.filter((value) => value !== skill.id)
                          : [...previous, skill.id])}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? 'border-primary-600 bg-primary-600 text-surface shadow-sm' : 'border-border bg-surface text-muted hover:border-primary-400 hover:text-text'}`}
                      >
                        {skill.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
                Guardar cambios
              </Button>
            </form>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-border/70 p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-text">Disponibilidad semanal</h2>
                <p className="mt-1 text-sm text-muted">
                  Administra los bloques de horario que podrán reservar los estudiantes.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-muted">
                <Calendar size={14} className="text-primary-600" aria-hidden />
                {availability.length} bloques
              </div>
            </div>

            <form
              onSubmit={handleAvailabilitySubmit(onAddAvailability)}
              className="grid grid-cols-1 items-end gap-3 rounded-xl border border-border bg-surface-alt p-4 sm:grid-cols-4"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="availability-day" className="text-xs font-medium text-muted">Día</label>
                <select
                  id="availability-day"
                  {...registerAvailability('dayOfWeek')}
                  aria-invalid={!!availabilityErrors.dayOfWeek}
                  aria-describedby={availabilityErrors.dayOfWeek ? 'availability-day-error' : undefined}
                  className={`rounded-lg border bg-surface px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-200 ${availabilityErrors.dayOfWeek ? 'border-primary-600' : 'border-border'}`}
                >
                  {DAYS.map((day) => <option key={day} value={day}>{DAY_ES[day]}</option>)}
                </select>
                {availabilityErrors.dayOfWeek && <span id="availability-day-error" className="text-xs text-primary-700">{availabilityErrors.dayOfWeek.message}</span>}
              </div>

              <Input
                id="availability-start"
                type="time"
                label="Inicio"
                error={availabilityErrors.startTime?.message}
                {...registerAvailability('startTime')}
              />
              <Input
                id="availability-end"
                type="time"
                label="Fin"
                error={availabilityErrors.endTime?.message || availabilityErrors.root?.message}
                {...registerAvailability('endTime')}
              />

              <Button type="submit" loading={isAddingAvailability} className="w-full">
                <Plus size={14} /> Agregar
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              {availability.length === 0 ? (
                <EmptyState
                  icon={<Clock size={40} />}
                  title="Sin bloques de disponibilidad"
                  description="Agrega tu primer horario disponible para comenzar a recibir reservas."
                />
              ) : (
                groupedAvailability.map((day) => (
                  <div key={day} className="rounded-xl border border-border bg-surface-alt p-4">
                    <p className="mb-3 text-sm font-semibold text-text">{DAY_ES[day]}</p>
                    <div className="space-y-2">
                      {availability.filter((item) => item.dayOfWeek === day).map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-3">
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-text">
                            <Clock size={16} className="text-primary-600" aria-hidden />
                            {item.startTime} - {item.endTime}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteAvailability(item.id, `${DAY_ES[day]} ${item.startTime} - ${item.endTime}`)}
                            aria-label={`Eliminar disponibilidad de ${DAY_ES[day]} ${item.startTime} a ${item.endTime}`}
                            className="rounded-lg p-2 text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-700"
                          >
                            <Trash2 size={14} aria-hidden />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="border-border/70 p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text">Resumen público</h2>
              <p className="mt-1 text-sm text-muted">
                Vista rápida de lo que el estudiante podrá interpretar de tu perfil.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                    <UserRound size={18} className="text-primary-600" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">Bio</p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {bio?.trim() || 'Aún no has agregado una descripción pública.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                    <Video size={18} className="text-primary-600" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">Videollamada</p>
                    <p className="mt-1 break-all text-sm text-muted">
                      {videoCallUrl || 'Sin enlace registrado'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                    <ExternalLink size={18} className="text-primary-600" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">LinkedIn</p>
                    <p className="mt-1 break-all text-sm text-muted">
                      {linkedinUrl || 'Sin enlace registrado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </AsyncContent>
    </div>
  )
}
