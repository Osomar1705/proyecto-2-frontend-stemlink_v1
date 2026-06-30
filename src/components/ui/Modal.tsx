import { useEffect, useId } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  const titleId = useId()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="relative z-10 w-full max-w-md rounded-xl bg-surface p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h3 id={titleId} className="text-lg font-semibold text-text">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="ml-auto rounded-lg p-1 transition-colors hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <X size={20} className="text-muted" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
