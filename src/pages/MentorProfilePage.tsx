import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { mentorsApi } from '../api/mentors.api'
import type { TechnicalSkillDTO, AvailabilityBlockDTO } from '../types'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { parseApiError } from '../utils/errors'
import { Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  bio: z.string().min(10, 'La bio debe tener al menos 10 caracteres'),
  videoCallUrl: z.string().url('URL inválida').or(z.literal('')),
  linkedinUrl: z.string().url('URL inválida').or(z.literal('')),
})
type FormData = z.infer<typeof schema>

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
const DAY_ES: Record<string, string> = { MONDAY:'Lunes', TUESDAY:'Martes', WEDNESDAY:'Miércoles', THURSDAY:'Jueves', FRIDAY:'Viernes', SATURDAY:'Sábado', SUNDAY:'Domingo' }

export default function MentorProfilePage() {
  const [skills, setSkills] = useState<TechnicalSkillDTO[]>([])
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])
  const [availability, setAvailability] = useState<AvailabilityBlockDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [newAvail, setNewAvail] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00' })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const load = async () => {
    try {
      const authRes = await import('../api/auth.api').then(m => m.authApi.me())
      const mentorId = authRes.data.id
      const [tagsRes, pRes, aRes] = await Promise.all([
        mentorsApi.getTags(),
        mentorsApi.getById(mentorId),
        mentorsApi.getAvailability(mentorId),
      ])
      setSkills(tagsRes.data)
      setSelectedSkills(pRes.data.skills?.map(s => s.id) || [])
      setAvailability(aRes.data)
      reset({ bio: pRes.data.bio || '', videoCallUrl: pRes.data.videoCallUrl || '', linkedinUrl: pRes.data.linkedinUrl || '' })
    } catch (e) {
      toast.error(parseApiError(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data: FormData) => {
    try {
      await mentorsApi.updateProfile(data)
      await mentorsApi.updateTags(selectedSkills)
      toast.success('Perfil actualizado')
      load()
    } catch (e) { toast.error(parseApiError(e)) }
  }

  const addAvailability = async () => {
    try {
      const res = await mentorsApi.addAvailability(newAvail)
      setAvailability(prev => [...prev, res.data])
      toast.success('Disponibilidad agregada')
    } catch (e) { toast.error(parseApiError(e)) }
  }

  const deleteAvailability = async (id: number) => {
    try {
      await mentorsApi.deleteAvailability(id)
      setAvailability(prev => prev.filter(a => a.id !== id))
      toast.success('Disponibilidad eliminada')
    } catch (e) { toast.error(parseApiError(e)) }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Mi perfil de mentor</h1>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Información básica</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea rows={4} {...register('bio')} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Cuéntales a los estudiantes sobre ti..." />
            {errors.bio && <span className="text-xs text-red-500">{errors.bio.message}</span>}
          </div>
          <Input label="URL de videollamada" placeholder="https://meet.google.com/..." error={errors.videoCallUrl?.message} {...register('videoCallUrl')} />
          <Input label="LinkedIn" placeholder="https://linkedin.com/in/..." error={errors.linkedinUrl?.message} {...register('linkedinUrl')} />

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Habilidades</label>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <button type="button" key={s.id} onClick={() => setSelectedSkills(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${selectedSkills.includes(s.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:border-indigo-400'}`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={isSubmitting}>Guardar cambios</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Disponibilidad semanal</h2>
        <div className="space-y-2 mb-4">
          {availability.length === 0 ? <p className="text-sm text-gray-400">Sin bloques de disponibilidad</p> : availability.map(a => (
            <div key={a.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{DAY_ES[a.dayOfWeek]} · {a.startTime} – {a.endTime}</span>
              <button onClick={() => deleteAvailability(a.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Día</label>
            <select value={newAvail.dayOfWeek} onChange={e => setNewAvail(p => ({ ...p, dayOfWeek: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              {DAYS.map(d => <option key={d} value={d}>{DAY_ES[d]}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Inicio</label>
            <input type="time" value={newAvail.startTime} onChange={e => setNewAvail(p => ({ ...p, startTime: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Fin</label>
            <input type="time" value={newAvail.endTime} onChange={e => setNewAvail(p => ({ ...p, endTime: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <Button onClick={addAvailability} className="flex items-center gap-1"><Plus size={14} /> Agregar</Button>
        </div>
      </Card>
    </div>
  )
}
