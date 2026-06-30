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
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <span className="text-sm text-muted">
        Mostrando {from}–{to} de {totalElements} resultados
      </span>
      <div className="flex items-center gap-2">
        {onSizeChange && (
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm outline-none transition-shadow focus:ring-4 focus:ring-primary-500/10"
          >
            {[10, 25, 50].map((s) => (
              <option key={s} value={s}>{s} por página</option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Ir a la página anterior"
          className="rounded-lg border border-border p-1.5 transition-colors hover:border-primary-200 hover:bg-surface-alt disabled:opacity-40"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i
          return (
            <button
              type="button"
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Ir a la página ${p + 1}`}
              aria-current={p === page ? 'page' : undefined}
              className={`h-8 w-8 rounded-lg text-sm transition-colors ${p === page ? 'bg-primary-600 text-surface shadow-sm' : 'border border-border hover:border-primary-200 hover:bg-surface-alt'}`}
            >
              {p + 1}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Ir a la página siguiente"
          className="rounded-lg border border-border p-1.5 transition-colors hover:border-primary-200 hover:bg-surface-alt disabled:opacity-40"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </div>
  )
}
