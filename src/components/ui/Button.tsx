import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent' | 'outline'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary:   'bg-primary-600 text-surface shadow-[0_1px_2px_rgba(15,23,42,0.08),0_6px_14px_rgba(79,70,229,0.16)] hover:bg-primary-700 hover:shadow-[0_2px_4px_rgba(15,23,42,0.08),0_8px_18px_rgba(79,70,229,0.2)]',
  secondary: 'border border-border bg-surface text-text shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-primary-200 hover:bg-surface-alt',
  danger:    'bg-primary-700 text-surface shadow-sm hover:bg-primary-900',
  ghost:     'text-muted hover:bg-surface-alt hover:text-text',
  accent:    'bg-accent-600 text-surface shadow-[0_1px_2px_rgba(15,23,42,0.08),0_6px_14px_rgba(20,184,166,0.14)] hover:bg-accent-500',
  outline:   'border border-surface/70 bg-transparent text-surface hover:bg-surface/10',
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, type = 'button', ...props }: Props) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-[transform,background-color,border-color,box-shadow,color] duration-200 hover:-translate-y-px active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:translate-x-0.5 ${variants[variant]} ${className}`}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  )
}
