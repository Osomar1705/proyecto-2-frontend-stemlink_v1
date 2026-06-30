import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, helperText, className = '', id, rows = 4, ...props }, ref) => {
    const textAreaId = id || props.name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textAreaId} className="text-sm font-semibold tracking-[-0.01em] text-text">
            {label}
          </label>
        )}
        <textarea
          id={textAreaId}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${textAreaId}-error` : helperText ? `${textAreaId}-help` : undefined}
          {...props}
          className={`field-shell resize-none rounded-2xl px-4 py-3 text-sm text-text outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted/70 focus:border-primary-400 focus:bg-surface focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-surface-alt/70 ${error ? 'border-primary-600 ring-4 ring-primary-500/10' : ''} ${className}`}
        />
        {helperText && !error && <span id={`${textAreaId}-help`} className="text-xs text-muted">{helperText}</span>}
        {error && <span id={`${textAreaId}-error`} className="text-xs text-primary-700">{error}</span>}
      </div>
    )
  },
)

TextArea.displayName = 'TextArea'
