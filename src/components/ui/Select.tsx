import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  label: string
  value: string | number
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, helperText, className = '', id, options, ...props }, ref) => {
    const selectId = id || props.name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold tracking-[-0.01em] text-text">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-help` : undefined}
          {...props}
          className={`field-shell rounded-2xl px-4 py-3 text-sm text-text outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-primary-400 focus:bg-surface focus:ring-4 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-surface-alt/70 ${error ? 'border-primary-600 ring-4 ring-primary-500/10' : ''} ${className}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && <span id={`${selectId}-help`} className="text-xs text-muted">{helperText}</span>}
        {error && <span id={`${selectId}-error`} className="text-xs text-primary-700">{error}</span>}
      </div>
    )
  },
)

Select.displayName = 'Select'
