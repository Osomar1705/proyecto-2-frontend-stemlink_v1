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
    <div className="fade-in-section flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-alt/45 px-6 py-12 text-center" role="status" aria-live="polite">
      {icon && (
        <div className="surface-interactive mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-muted shadow-sm [&>svg]:h-6 [&>svg]:w-6 [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:scale-105">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-base font-semibold text-text">{title}</h3>
      {description && <p className="mb-5 max-w-sm text-sm leading-6 text-muted">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
