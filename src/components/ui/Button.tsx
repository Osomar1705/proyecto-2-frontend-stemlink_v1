import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent' | 'outline'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary:   'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-white border border-border hover:bg-surface-alt text-text',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  ghost:     'hover:bg-surface-alt text-muted',
  accent:    'bg-accent-500 hover:bg-accent-600 text-white',
  outline:   'border-2 border-white bg-transparent hover:bg-white/10 text-white',
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}
