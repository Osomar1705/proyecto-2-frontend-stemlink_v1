import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  totalElements: number
  size: number
  onPageChange: (p: number) => void
  onSizeChange?: (s: number) => void
}

export function Pagination({ page, totalPages, totalElements, size, onPageChange, onSizeChange }: Props) {
  const from = totalElements === 0 ? 0 : page * size + 1
  const to = Math.min((page + 1) * size, totalElements)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      <span className="text-sm text-gray-500">
        Mostrando {from}–{to} de {totalElements} resultados
      </span>
      <div className="flex items-center gap-2">
        {onSizeChange && (
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[10, 25, 50].map((s) => (
              <option key={s} value={s}>{s} por página</option>
            ))}
          </select>
        )}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 text-sm rounded-lg transition-colors ${p === page ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
            >
              {p + 1}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
