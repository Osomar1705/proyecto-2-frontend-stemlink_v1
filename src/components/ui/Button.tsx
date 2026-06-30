import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent' | 'outline'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary:   'bg-primary-600 hover:bg-primary-700 text-surface',
  secondary: 'bg-surface border border-border hover:bg-surface-alt text-text',
  danger:    'bg-primary-700 hover:bg-primary-900 text-surface',
  ghost:     'hover:bg-surface-alt text-muted',
  accent:    'bg-accent-500 hover:bg-accent-600 text-surface',
  outline:   'border-2 border-surface bg-transparent hover:bg-surface/10 text-surface',
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, type = 'button', ...props }: Props) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}
