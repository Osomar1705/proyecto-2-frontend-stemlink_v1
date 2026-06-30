import type { ReactNode } from 'react'
import { EmptyState } from './EmptyState'
import { Spinner } from './Spinner'

interface AsyncContentProps {
  loading: boolean
  error?: string
  isEmpty?: boolean
  loadingFallback?: ReactNode
  errorIcon?: ReactNode
  errorTitle?: string
  onRetry?: () => void
  emptyIcon?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: { label: string; onClick: () => void }
  children: ReactNode
}

export function AsyncContent({
  loading,
  error,
  isEmpty,
  loadingFallback,
  errorIcon,
  errorTitle = 'No pudimos cargar esta sección',
  onRetry,
  emptyIcon,
  emptyTitle = 'No hay resultados',
  emptyDescription,
  emptyAction,
  children,
}: AsyncContentProps) {
  if (loading) {
    return (
      <>
        {loadingFallback || (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}
      </>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <EmptyState
          icon={errorIcon}
          title={errorTitle}
          description={error}
          action={onRetry ? { label: 'Reintentar', onClick: onRetry } : undefined}
        />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </div>
    )
  }

  return <>{children}</>
}
