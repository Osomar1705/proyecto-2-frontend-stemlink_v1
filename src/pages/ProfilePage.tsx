import { useCallback, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { authApi } from '../api/auth.api'
import { bookingsApi } from '../api/bookings.api'
import { notificationsApi } from '../api/notifications.api'
import type { UserResponse, BookingResponse } from '../types'
import { AsyncContent } from '../components/ui/AsyncContent'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { PageHero } from '../components/ui/PageHero'
import { Button } from '../components/ui/Button'
import { MentorAvatar } from '../components/mentors/MentorAvatar'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { clearUserPhoto, getUserProfileEnhancements, saveUserProfileEnhancements } from '../utils/mentorProfileAssets'
import { AtSign, Bell, Calendar, ImagePlus, Mail, Sparkles, Upload, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'

type ProfileSummary = {
  user: UserResponse
  bookings: BookingResponse[]
  unreadCount: number
  instagramUrl: string
  photoUrl: string | null
}

const EMPTY_PROFILE: ProfileSummary = {
  user: { id: 0, name: '', email: '', role: '' },
  bookings: [],
  unreadCount: 0,
  instagramUrl: '',
  photoUrl: null,
}

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [instagramUrl, setInstagramUrl] = useState('')

  const loadProfile = useCallback(async (signal: AbortSignal) => {
    const [userRes, bookingsRes, notificationsRes] = await Promise.all([
      authApi.me(signal),
      bookingsApi.list({ page: 0, size: 20 }, signal),
      notificationsApi.list({ page: 0, size: 20 }, signal),
    ])

    const enhancements = getUserProfileEnhancements(userRes.data.id)
    setPhotoUrl(enhancements.photoUrl)
    setInstagramUrl(enhancements.instagramUrl)

    return {
      user: userRes.data,
      bookings: bookingsRes.data.content,
      unreadCount: notificationsRes.data.content.filter((notification) => !notification.read).length,
      instagramUrl: enhancements.instagramUrl,
      photoUrl: enhancements.photoUrl,
    }
  }, [])

  const { data, loading, error, reload } = useAsyncResource<ProfileSummary | null>({
    initialData: null,
    load: loadProfile,
    onError: (message) => toast.error(message),
  })

  const profileData = data ?? EMPTY_PROFILE
  const confirmedBookings = profileData.bookings.filter((booking) => booking.status === 'CONFIRMED').length
  const upcomingBookings = profileData.bookings.filter((booking) => booking.status === 'CONFIRMED' || booking.status === 'PENDING').length
  const roleLabel = profileData.user.role === 'MENTOR' ? 'MENTOR' : 'STUDENT'
  const roleTitle = profileData.user.role === 'MENTOR' ? 'Perfil del mentor' : 'Perfil del estudiante'
  const roleDescription = profileData.user.role === 'MENTOR'
    ? 'Cuenta activa como mentor.'
    : 'Cuenta activa como estudiante.'
  const resolvedPhoto = photoUrl ?? profileData.photoUrl
  const resolvedInstagram = instagramUrl || profileData.instagramUrl

  const handlePhotoSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const userId = profileData.user.id

    if (!file || !userId) return

    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona una imagen válida.')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error('La imagen debe pesar menos de 3 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      if (!result) {
        toast.error('No pudimos procesar la imagen seleccionada.')
        return
      }

      saveUserProfileEnhancements(userId, { photoUrl: result })
      setPhotoUrl(result)
      toast.success('Foto de perfil actualizada.')
    }
    reader.onerror = () => toast.error('No pudimos leer la imagen seleccionada.')
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleResetPhoto = () => {
    if (!profileData.user.id) return
    clearUserPhoto(profileData.user.id)
    setPhotoUrl(null)
    toast.success('Retrato restaurado.')
  }

  const handleInstagramSave = () => {
    if (!profileData.user.id) return

    if (resolvedInstagram.trim()) {
      try {
        new URL(resolvedInstagram)
      } catch {
        toast.error('Ingresa una URL válida para Instagram.')
        return
      }
    }

    saveUserProfileEnhancements(profileData.user.id, { instagramUrl: resolvedInstagram.trim() })
    setInstagramUrl(resolvedInstagram.trim())
    toast.success('Enlace de Instagram actualizado.')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/dashboard' }, { label: 'Mi perfil' }]} />

      <AsyncContent
        loading={loading}
        error={error}
        isEmpty={!data}
        errorIcon={<UserRound size={48} />}
        errorTitle="No pudimos cargar tu perfil"
        onRetry={reload}
        emptyIcon={<UserRound size={48} />}
        emptyTitle="No encontramos tu perfil"
        emptyDescription="Intenta recargar la vista para volver a consultar tu información."
      >
        <>
          <div className="mb-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <PageHero
          badge={(
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
              <Sparkles size={16} className="text-accent-500" aria-hidden />
              {roleTitle}
            </div>
          )}
          title={profileData.user.name}
          description="Tu resumen personal dentro de STEM Link, con foco en actividad, progreso y visibilidad de tu cuenta."
          aside={(
            <div className="flex flex-col items-center text-center">
              <div className="surface-tint rounded-[1.75rem] px-6 py-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                <MentorAvatar
                  name={profileData.user.name || 'Usuario STEM'}
                  src={resolvedPhoto}
                  size="xl"
                  className="mx-auto mb-4"
                />
                <div className="space-y-2">
                  <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={14} />
                    Cambiar foto
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleResetPhoto} disabled={!resolvedPhoto}>
                    <ImagePlus size={14} />
                    Usar retrato sugerido
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handlePhotoSelection}
                />
                <p className="text-sm font-semibold text-text">Cuenta activa</p>
                <p className="mt-1 text-xs text-muted">Información sincronizada con tu sesión actual.</p>
              </div>
            </div>
          )}
          footer={(
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="panel-shell rounded-2xl px-4 py-4 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Próximas</p>
                <p className="mt-2 text-2xl font-bold text-text">{upcomingBookings}</p>
              </div>
              <div className="panel-shell rounded-2xl px-4 py-4 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Confirmadas</p>
                <p className="mt-2 text-2xl font-bold text-text">{confirmedBookings}</p>
              </div>
              <div className="panel-shell rounded-2xl px-4 py-4 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Alertas</p>
                <p className="mt-2 text-2xl font-bold text-text">{profileData.unreadCount}</p>
              </div>
            </div>
          )}
        />

        <Card className="border-border/60 bg-surface/90 p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text">Información principal</h2>
            <p className="mt-1 text-sm text-muted">
              Datos cargados desde tu sesión y actividad reciente.
            </p>
          </div>

          <div className="space-y-4">
            <div className="surface-subtle rounded-[1.35rem] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50/80">
                  <UserRound size={18} className="text-primary-600" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Nombre</p>
                  <p className="mt-1 text-sm text-muted">{profileData.user.name}</p>
                </div>
              </div>
            </div>

            <div className="surface-subtle rounded-[1.35rem] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50/80">
                  <Mail size={18} className="text-primary-600" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Correo</p>
                  <p className="mt-1 text-sm break-all text-muted">{profileData.user.email}</p>
                </div>
              </div>
            </div>

            <div className="surface-subtle rounded-[1.35rem] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50/80">
                  <Badge label={roleLabel} color="neutral" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Rol</p>
                  <p className="mt-1 text-sm text-muted">{roleDescription}</p>
                </div>
              </div>
            </div>

            <div className="surface-subtle rounded-[1.35rem] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50/80">
                  <AtSign size={18} className="text-primary-600" aria-hidden />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text">Instagram</p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="url"
                      value={resolvedInstagram}
                      onChange={(event) => setInstagramUrl(event.target.value)}
                      placeholder="https://instagram.com/tuusuario"
                      className="field-shell w-full rounded-2xl px-4 py-3 text-sm text-text outline-none transition-all duration-300 ease-in-out placeholder:text-muted/70 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                    />
                    <Button type="button" variant="secondary" onClick={handleInstagramSave}>
                      Guardar enlace
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/60 bg-surface/90 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50/80">
              <Calendar size={20} className="text-primary-600" aria-hidden />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">Actividad</h2>
              <p className="mt-1 text-sm text-muted">Resumen de tus reservas recientes.</p>
            </div>
          </div>

          <div className="space-y-3">
            {profileData.bookings.slice(0, 4).map((booking) => (
              <div key={booking.id} className="surface-subtle rounded-[1.35rem] px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-text">{booking.topic}</p>
                  <Badge label={booking.status} color="neutral" />
                </div>
                <p className="mt-2 text-sm text-muted">
                  {booking.date} · {booking.startTime} - {booking.endTime}
                </p>
              </div>
            ))}

            {profileData.bookings.length === 0 && (
              <EmptyState
                icon={<Calendar size={36} />}
                title="Sin reservas registradas"
                description="Cuando reserves tu primera mentoría verás su resumen aquí."
              />
            )}
          </div>
        </Card>

        <Card className="border-border/60 bg-surface/90 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50/80">
              <Bell size={20} className="text-primary-600" aria-hidden />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">Estado de alertas</h2>
              <p className="mt-1 text-sm text-muted">Lectura rápida de tu centro de notificaciones.</p>
            </div>
          </div>

          <div className="surface-tint rounded-[1.5rem] p-5">
            <p className="text-sm font-semibold text-text">
              {profileData.unreadCount > 0
                ? `Tienes ${profileData.unreadCount} notificación${profileData.unreadCount !== 1 ? 'es' : ''} sin revisar.`
                : 'No tienes alertas pendientes.'}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Usa el panel de notificaciones para revisar recordatorios, cambios de estado y confirmaciones de sesiones.
            </p>
          </div>
        </Card>
          </div>
        </>
      </AsyncContent>
    </div>
  )
}
