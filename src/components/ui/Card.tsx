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
      className={`fade-in-section rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_8px_24px_rgba(15,23,42,0.04)] ${onClick ? 'surface-interactive cursor-pointer hover:border-primary-200 hover:shadow-[0_2px_4px_rgba(15,23,42,0.04),0_14px_32px_rgba(15,23,42,0.07)] focus:outline-none focus:ring-2 focus:ring-primary-500/30' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
