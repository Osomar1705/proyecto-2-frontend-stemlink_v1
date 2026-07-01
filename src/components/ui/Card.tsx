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
      className={`surface-card fade-in-section rounded-[1.65rem] p-5 ${onClick ? 'surface-interactive cursor-pointer transition-all duration-300 ease-in-out hover:border-primary-200 hover:shadow-[0_4px_10px_rgba(15,23,42,0.04),0_24px_48px_rgba(79,70,229,0.08)] focus:outline-none focus:ring-4 focus:ring-primary-500/15' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
