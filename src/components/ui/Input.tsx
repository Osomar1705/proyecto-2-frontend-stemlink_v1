import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, helperText, className = '', id, ...props }, ref) => {
  const inputId = id || props.name

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-text">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
        {...props}
        className={`rounded-2xl border border-border/70 bg-surface/90 px-4 py-3 text-sm text-text shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-surface-alt ${error ? 'border-primary-600 ring-1 ring-primary-500/20' : ''} ${className}`}
      />
      {helperText && !error && <span id={`${inputId}-help`} className="text-xs text-muted">{helperText}</span>}
      {error && <span id={`${inputId}-error`} className="text-xs text-primary-700">{error}</span>}
    </div>
  )
})
Input.displayName = 'Input'
