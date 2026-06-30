import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent' | 'outline'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary:   'bg-gradient-to-r from-primary-600 to-primary-500 text-surface shadow-[0_10px_24px_rgba(79,70,229,0.24)] hover:shadow-[0_14px_28px_rgba(79,70,229,0.28)]',
  secondary: 'border border-border bg-surface/90 text-text hover:border-primary-200 hover:bg-surface-alt/90',
  danger:    'bg-gradient-to-r from-primary-700 to-primary-800 text-surface shadow-[0_10px_24px_rgba(67,56,202,0.20)]',
  ghost:     'text-muted hover:bg-surface-alt hover:text-text',
  accent:    'bg-gradient-to-r from-accent-500 to-accent-600 text-surface shadow-[0_10px_24px_rgba(20,184,166,0.20)]',
  outline:   'border border-surface/70 bg-transparent text-surface hover:bg-surface/10',
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, type = 'button', ...props }: Props) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  )
}
