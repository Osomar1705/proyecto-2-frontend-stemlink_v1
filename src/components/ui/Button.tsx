import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent' | 'outline'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary: 'border border-primary-600 bg-primary-600 text-surface shadow-[0_8px_20px_rgba(79,70,229,0.22)] hover:border-primary-700 hover:bg-primary-700 hover:shadow-[0_12px_28px_rgba(79,70,229,0.26)]',
  secondary: 'border border-border/90 bg-surface/95 text-text shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700',
  danger: 'border border-primary-700 bg-primary-700 text-surface shadow-[0_10px_24px_rgba(49,46,129,0.18)] hover:bg-primary-900',
  ghost: 'border border-transparent bg-transparent text-muted shadow-none hover:border-border/80 hover:bg-surface hover:text-text',
  accent: 'border border-accent-600 bg-accent-600 text-surface shadow-[0_8px_20px_rgba(13,148,136,0.2)] hover:border-accent-700 hover:bg-accent-700',
  outline: 'border border-surface/30 bg-surface/10 text-surface backdrop-blur-sm hover:bg-surface/18',
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, type = 'button', ...props }: Props) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={`surface-interactive group inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:translate-x-0.5 ${variants[variant]} ${className}`}
    >
      {loading && <span className="spinner-orbit h-4 w-4"><span /></span>}
      {children}
    </button>
  )
}
