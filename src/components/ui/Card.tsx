import type { KeyboardEvent, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: Props) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick || event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-surface border border-border rounded-xl p-5 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
