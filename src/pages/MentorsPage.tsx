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
import { Select } from '../components/ui/Select'
import { useAsyncResource } from '../hooks/useAsyncResource'
import { usePagination } from '../hooks/usePagination'
import { useDebounce } from '../hooks/useDebounce'
import { ArrowUpDown, Search, Users, Sparkles, SlidersHorizontal, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { MentorCard } from '../components/mentors/MentorCard'

export default function MentorsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { page, size, setPage, setSize } = usePagination(10)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [skills, setSkills] = useState<TechnicalSkillDTO[]>([])
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])
  const sort = searchParams.get('sort') === 'id,asc' ? 'id,asc' : 'id,desc'

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    const nextSearch = searchParams.get('search') || ''
    setSearch((current) => current === nextSearch ? current : nextSearch)
  }, [searchParams])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    const currentSearch = searchParams.get('search') || ''

    if (debouncedSearch) next.set('search', debouncedSearch)
    else next.delete('search')

    if (currentSearch !== debouncedSearch) {
      setSearchParams(next, { replace: true })
    }
  }, [debouncedSearch, searchParams, setSearchParams])

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
      sort,
    }, signal)

    return res.data
  }, [debouncedSearch, selectedSkills, page, size, sort])

  const { data, loading, error, reload } = useAsyncResource<Page<MentorProfileResponse> | null>({
    initialData: null,
    load: fetchMentors,
    onError: (message) => toast.error(message),
  })
  const isInitialLoading = loading && !data

  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
    setPage(0)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedSkills([])
    setPage(0)
  }

  const changeSort = (value: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('sort', value)
    next.set('page', '0')
    setSearchParams(next)
  }

  const mentorCount = data?.totalElements ?? 0
  const hasFilters = Boolean(search.trim() || selectedSkills.length)
  const activeSkills = skills.filter(skill => selectedSkills.includes(skill.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Mentores' }]} />

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
            <div className="flex flex-wrap gap-3 lg:min-w-[25rem]">
              <div className="panel-shell min-w-[7rem] flex-1 rounded-2xl px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Resultados</p>
                <p className="mt-1 text-lg font-bold text-text">{mentorCount}</p>
              </div>
              <div className="panel-shell min-w-[7rem] flex-1 rounded-2xl px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Filtros</p>
                <p className="mt-1 text-lg font-bold text-text">{selectedSkills.length}</p>
              </div>
              <div className="panel-shell min-w-[7rem] flex-1 rounded-2xl px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Página</p>
                <p className="mt-1 text-lg font-bold text-text">{page + 1}</p>
              </div>
            </div>
          )}
          footer={(
            <div className="space-y-4 rounded-[1.4rem] border border-border bg-surface p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="relative">
                <Search size={20} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(0) }}
                  placeholder="Buscar mentores por nombre..."
                  aria-label="Buscar mentores por nombre"
                  className="field-shell w-full rounded-xl py-3.5 pl-10 pr-4 text-sm text-text outline-none transition-all duration-300 ease-in-out placeholder:text-muted/75 hover:border-primary-200 hover:bg-surface focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-sm text-muted">
                  <SlidersHorizontal size={16} className="text-primary-600" aria-hidden />
                  {selectedSkills.length ? `${selectedSkills.length} filtro(s) activos` : 'Sin filtros activos'}
                </span>

                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-text ring-1 ring-border/60 transition-all duration-300 ease-in-out hover:text-primary-700 hover:shadow-[0_8px_18px_rgba(79,70,229,0.08)]"
                  >
                    <X size={12} aria-hidden />
                    Limpiar
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-text">
                    <Sparkles size={14} className="text-accent-500" aria-hidden />
                    Todas las habilidades
                  </span>
                )}
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => {
                    const active = selectedSkills.includes(skill.id)
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        aria-pressed={active}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-all duration-300 ease-in-out ${active ? 'bg-primary-600 text-surface ring-primary-600 shadow-[0_10px_22px_rgba(79,70,229,0.12)]' : 'bg-surface text-muted ring-border/60 hover:-translate-y-0.5 hover:text-text hover:ring-primary-400 hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)]'}`}
                      >
                        {skill.name}
                      </button>
                    )
                  })}
                </div>
              )}

              {hasFilters && (
                <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                  {debouncedSearch && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-medium text-text ring-1 ring-border/60">
                      Búsqueda: {debouncedSearch}
                    </span>
                  )}
                  {activeSkills.map(skill => (
                    <span key={skill.id} className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-medium text-text ring-1 ring-border/60">
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
        loading={isInitialLoading}
        error={error}
        isEmpty={(data?.content.length ?? 0) === 0}
        loadingFallback={(
          <div className="stagger-list grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text">Mentores disponibles</h2>
              <p className="mt-1 text-sm text-muted">
                Selecciona un perfil para revisar disponibilidad, habilidades y opciones de reserva.
              </p>
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:min-w-[13rem]">
              <ArrowUpDown size={16} className="shrink-0 text-primary-600" aria-hidden />
              <Select
                aria-label="Ordenar mentores"
                value={sort}
                onChange={(event) => changeSort(event.target.value)}
                options={[
                  { value: 'id,desc', label: 'Más recientes' },
                  { value: 'id,asc', label: 'Más antiguos' },
                ]}
                className="w-full rounded-xl px-3 py-2.5"
              />
            </div>
          </div>

          <div className="stagger-list mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
