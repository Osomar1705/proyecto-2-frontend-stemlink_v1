import { Select } from './Select'
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
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border/80 bg-surface-alt/70 p-2">
        {onSizeChange && (
          <Select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            aria-label="Seleccionar cantidad por página"
            options={[10, 25, 50, 100].map((s) => ({ value: s, label: `${s} por página` }))}
            className="min-w-[9.5rem] rounded-xl px-3 py-2"
          />
        )}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Ir a la página anterior"
          className="rounded-xl border border-border bg-surface p-2 transition-colors hover:border-primary-200 hover:bg-primary-50 disabled:opacity-40"
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
              className={`h-9 w-9 rounded-xl text-sm font-semibold transition-colors ${p === page ? 'bg-primary-600 text-surface shadow-sm' : 'border border-border bg-surface hover:border-primary-200 hover:bg-primary-50'}`}
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
          className="rounded-xl border border-border bg-surface p-2 transition-colors hover:border-primary-200 hover:bg-primary-50 disabled:opacity-40"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </div>
  )
}
