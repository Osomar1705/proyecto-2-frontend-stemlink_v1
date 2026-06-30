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
    <div className="flex flex-col items-center justify-center py-16 text-center" role="status" aria-live="polite">
      {icon && <div className="text-muted mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      {description && <p className="text-sm text-muted mb-4 max-w-xs">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}
