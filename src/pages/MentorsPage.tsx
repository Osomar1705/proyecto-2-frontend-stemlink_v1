import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { mentorsApi } from '../api/mentors.api'
import type { MentorProfileResponse, TechnicalSkillDTO, Page } from '../types'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Pagination } from '../components/ui/Pagination'
import { MentorCardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { usePagination } from '../hooks/usePagination'
import { useDebounce } from '../hooks/useDebounce'
import { parseApiError } from '../utils/errors'
import { Search, Users, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MentorsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { page, size, setPage, setSize } = usePagination(10)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [skills, setSkills] = useState<TechnicalSkillDTO[]>([])
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])
  const [data, setData] = useState<Page<MentorProfileResponse> | null>(null)
  const [loading, setLoading] = useState(true)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    const controller = new AbortController()
    mentorsApi.getTags(controller.signal)
      .then(r => setSkills(r.data))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const fetchMentors = useCallback(async (signal: AbortSignal) => {
    setLoading(true)
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
      if (err.name !== 'CanceledError') toast.error(parseApiError(e))
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedSkills, page, size])

  useEffect(() => {
    const controller = new AbortController()
    fetchMentors(controller.signal)
    return () => controller.abort()
  }, [fetchMentors])

  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
    setPage(0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Explorar Mentores</h1>
        <p className="text-muted mt-1">Encuentra el mentor STEM perfecto para ti</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <button
              key={s.id}
              onClick={() => toggleSkill(s.id)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${selectedSkills.includes(s.id) ? 'bg-primary-600 text-surface border-primary-600' : 'border-border text-text hover:border-primary-400'}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <MentorCardSkeleton key={i} />)}
        </div>
      ) : data?.content.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="No se encontraron mentores" description="Intenta con otros filtros o términos de búsqueda." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.content.map(mentor => (
              <Card key={mentor.id} onClick={() => navigate(`/mentors/${mentor.id}`)} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-text">{mentor.name}</h3>
                    {mentor.linkedinUrl && (
                      <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-xs text-primary-500 flex items-center gap-1 mt-0.5 hover:underline">
                        <ExternalLink size={12} /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted line-clamp-2">{mentor.bio || 'Sin descripción'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.skills?.slice(0, 3).map(sk => <Badge key={sk.id} label={sk.name} />)}
                  {mentor.skills?.length > 3 && <Badge label={`+${mentor.skills.length - 3}`} color="gray" />}
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
