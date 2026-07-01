import { useEffect, useId, useRef } from 'react'
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
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return

    lastFocusedElementRef.current = document.activeElement as HTMLElement | null

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstFocusable = focusableElements?.[0]
    firstFocusable?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )

        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement

        if (event.shiftKey && active === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      lastFocusedElementRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div className="flex min-h-full items-start justify-center p-4 sm:items-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_64px_rgba(15,23,42,0.18)] max-h-[calc(100dvh-2rem)]"
        >
          <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
            {title && <h3 id={titleId} className="text-lg font-semibold text-text">{title}</h3>}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="ml-auto rounded-xl p-2 transition-colors hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <X size={20} className="text-muted" aria-hidden />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-6 py-5 touch-pan-y">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
