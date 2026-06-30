import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { mentorsApi } from '../api/mentors.api'
import type { MentorProfileResponse, TechnicalSkillDTO, Page } from '../types'
import { AsyncContent } from '../components/ui/AsyncContent'
import { Card } from '../components/ui/Card'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { Pagination } from '../components/ui/Pagination'
import { MentorCardSkeleton } from '../components/ui/Skeleton'
import { PageHero } from '../components/ui/PageHero'
import { useAsyncResource } from '../hooks/useAsyncResource'
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
    const res = await mentorsApi.list({
      name: debouncedSearch || undefined,
      skillIds: selectedSkills.length ? selectedSkills : undefined,
      page,
      size,
    }, signal)

    const next = new URLSearchParams(searchParams)
    if (debouncedSearch) next.set('search', debouncedSearch)
    else next.delete('search')
    setSearchParams(next, { replace: true })

    return res.data
  }, [debouncedSearch, selectedSkills, page, size, searchParams, setSearchParams])

  const { data, loading, error, reload } = useAsyncResource<Page<MentorProfileResponse> | null>({
    initialData: null,
    load: fetchMentors,
    deps: [fetchMentors],
    onError: (message) => toast.error(message),
  })

  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
    setPage(0)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedSkills([])
    setPage(0)
  }

  const mentorCount = data?.totalElements ?? 0
  const hasFilters = Boolean(search.trim() || selectedSkills.length)
  const activeSkills = skills.filter(skill => selectedSkills.includes(skill.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/dashboard' }, { label: 'Mentores' }]} />

      <div className="mb-8">
        <PageHero
          badge={(
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-sm font-medium text-muted">
              <Users size={16} className="text-primary-600" aria-hidden />
              Red de mentores STEM
            </div>
          )}
          title="Encuentra tu mentor ideal"
          description="Explora perfiles reales, filtra por habilidades y encuentra a la persona adecuada para tu siguiente reto técnico."
          aside={(
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
          )}
          footer={(
            <div className="px-0 py-0">
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
                    aria-pressed={active}
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
          )}
        />
      </div>

      <AsyncContent
        loading={loading}
        error={error}
        isEmpty={(data?.content.length ?? 0) === 0}
        loadingFallback={(
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <MentorCardSkeleton key={i} />)}
          </div>
        )}
        errorIcon={<Users size={48} />}
        errorTitle="No pudimos cargar los mentores"
        onRetry={reload}
        emptyIcon={<Users size={48} />}
        emptyTitle="No se encontraron mentores"
        emptyDescription="Prueba con otros filtros o cambia el término de búsqueda."
        emptyAction={hasFilters ? { label: 'Limpiar filtros', onClick: clearFilters } : undefined}
      >
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
      </AsyncContent>
    </div>
  )
}
