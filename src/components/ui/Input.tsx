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
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
        {...props}
        className={`px-3 py-2 border rounded-lg text-sm outline-none transition-colors focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-surface-alt disabled:cursor-not-allowed ${error ? 'border-red-500' : 'border-border'} ${className}`}
      />
      {helperText && !error && <span id={`${inputId}-help`} className="text-xs text-muted">{helperText}</span>}
      {error && <span id={`${inputId}-error`} className="text-xs text-red-500">{error}</span>}
    </div>
  )
})
Input.displayName = 'Input'
