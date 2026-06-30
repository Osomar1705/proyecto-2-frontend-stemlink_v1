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
      className={`rounded-2xl border border-border/70 bg-surface/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.10)] focus:outline-none focus:ring-2 focus:ring-primary-500/40' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
