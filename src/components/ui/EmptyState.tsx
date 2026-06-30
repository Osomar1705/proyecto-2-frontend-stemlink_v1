import type { ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  icon?: ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-surface/70 px-6 py-16 text-center shadow-sm" role="status" aria-live="polite">
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/70 bg-surface-alt text-muted shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-text">{title}</h3>
      {description && <p className="mb-5 max-w-sm text-sm leading-6 text-muted">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
