import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { mentorsApi } from '../api/mentors.api'
import type { MentorProfileResponse, TechnicalSkillDTO, Page } from '../types'
import { Card } from '../components/ui/Card'
import { Pagination } from '../components/ui/Pagination'
import { MentorCardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { usePagination } from '../hooks/usePagination'
import { useDebounce } from '../hooks/useDebounce'
import { parseApiError } from '../utils/errors'
import { Search, Users, Sparkles, SlidersHorizontal, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { MentorCard } from '../components/mentors/MentorCard'

export default function MentorsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { page, size, setPage, setSize } = usePagination(10)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [skills, setSkills] = useState<TechnicalSkillDTO[]>([])
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])
  const [data, setData] = useState<Page<MentorProfileResponse> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    setSearch(searchParams.get('search') || '')
  }, [searchParams])

  useEffect(() => {
    const controller = new AbortController()
    mentorsApi.getTags(controller.signal)
      .then(r => setSkills(r.data))
      .catch((e: unknown) => {
        const err = e as { name?: string }
        if (err.name !== 'CanceledError') toast.error('No se pudieron cargar las habilidades')
      })
    return () => controller.abort()
  }, [])

  const fetchMentors = useCallback(async (signal: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      const res = await mentorsApi.list({
        name: debouncedSearch || undefined,
        skillIds: selectedSkills.length ? selectedSkills : undefined,
        page,
        size,
      }, signal)
      setData(res.data)

      const next = new URLSearchParams(searchParams)
      if (debouncedSearch) next.set('search', debouncedSearch)
      else next.delete('search')
      setSearchParams(next, { replace: true })
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
  }, [debouncedSearch, selectedSkills, page, size, searchParams, setSearchParams])

  useEffect(() => {
    const controller = new AbortController()
    fetchMentors(controller.signal)
    return () => controller.abort()
  }, [fetchMentors, retryKey])

  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
    setPage(0)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedSkills([])
    setPage(0)
  }

  const retryMentors = () => setRetryKey(prev => prev + 1)
  const mentorCount = data?.totalElements ?? 0
  const hasFilters = Boolean(search.trim() || selectedSkills.length)
  const activeSkills = skills.filter(skill => selectedSkills.includes(skill.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm">
        <div className="relative p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary-100/70 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-100/60 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
                <Users size={16} className="text-primary-600" aria-hidden />
                Red de mentores STEM
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
                Encuentra tu mentor ideal
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Explora perfiles reales, filtra por habilidades y encuentra a la persona adecuada para tu siguiente reto técnico.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[25rem]">
              <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Resultados</p>
                <p className="mt-1 text-lg font-bold text-text">{mentorCount}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Filtros</p>
                <p className="mt-1 text-lg font-bold text-text">{selectedSkills.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Página</p>
                <p className="mt-1 text-lg font-bold text-text">{page + 1}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-surface-alt/60 px-6 py-5 sm:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)]">
            <div className="relative">
              <Search size={20} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0) }}
                placeholder="Buscar mentores por nombre..."
                aria-label="Buscar mentores por nombre"
                className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary-600" aria-hidden />
                {selectedSkills.length ? `${selectedSkills.length} filtro(s) activos` : 'Sin filtros activos'}
              </span>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-text transition-colors hover:border-primary-400 hover:text-primary-700"
                >
                  <X size={12} aria-hidden />
                  Limpiar
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-text">
                  <Sparkles size={14} className="text-accent-500" aria-hidden />
                  Todas las habilidades
                </span>
              )}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map(skill => {
                const active = selectedSkills.includes(skill.id)
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${active ? 'border-primary-600 bg-primary-600 text-surface shadow-sm' : 'border-border bg-surface text-muted hover:border-primary-400 hover:text-text'}`}
                  >
                    {skill.name}
                  </button>
                )
              })}
            </div>
          )}

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {debouncedSearch && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text">
                  Búsqueda: {debouncedSearch}
                </span>
              )}
              {activeSkills.map(skill => (
                <span key={skill.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text">
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <MentorCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <EmptyState
            icon={<Users size={48} />}
            title="No pudimos cargar los mentores"
            description={error}
            action={{ label: 'Reintentar', onClick: retryMentors }}
          />
        </div>
      ) : data?.content.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <EmptyState
            icon={<Users size={48} />}
            title="No se encontraron mentores"
            description="Prueba con otros filtros o cambia el término de búsqueda."
            action={hasFilters ? { label: 'Limpiar filtros', onClick: clearFilters } : undefined}
          />
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text">Mentores disponibles</h2>
              <p className="mt-1 text-sm text-muted">
                Selecciona un perfil para revisar disponibilidad, habilidades y opciones de reserva.
              </p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {data?.content.map(mentor => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onOpenProfile={() => navigate(`/mentors/${mentor.id}`)}
              />
            ))}
          </div>

          {data && (
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
          )}
        </>
      )}
    </div>
  )
}
