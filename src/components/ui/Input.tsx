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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold tracking-[-0.01em] text-text">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
        {...props}
        className={`field-shell rounded-2xl px-4 py-3 text-sm text-text outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted/70 focus:border-primary-400 focus:bg-surface focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-surface-alt/70 ${error ? 'border-primary-600 ring-4 ring-primary-500/10' : ''} ${className}`}
      />
      {helperText && !error && <span id={`${inputId}-help`} className="text-xs text-muted">{helperText}</span>}
      {error && <span id={`${inputId}-error`} className="text-xs text-primary-700">{error}</span>}
    </div>
  )
})
Input.displayName = 'Input'
