import type { ReactNode } from 'react'

interface PageHeroProps {
  badge?: ReactNode
  title: string
  description: string
  actions?: ReactNode
  aside?: ReactNode
  footer?: ReactNode
  className?: string
}

export function PageHero({
  badge,
  title,
  description,
  actions,
  aside,
  footer,
  className = '',
}: PageHeroProps) {
  return (
    <section className={`fade-in-section relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.03),0_12px_36px_rgba(15,23,42,0.05)] ${className}`}>
      <div className="relative p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(99,102,241,0.045),transparent_42%,rgba(20,184,166,0.035))]" aria-hidden="true" />

        <div className={`relative flex flex-col gap-6 ${aside ? 'lg:flex-row lg:items-end lg:justify-between' : ''}`}>
          <div className="max-w-3xl">
            {badge}
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.025em] text-text sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p>
            {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          </div>

          {aside && <div className="lg:max-w-sm">{aside}</div>}
        </div>
      </div>

      {footer && (
        <div className="border-t border-border bg-surface-alt/55 p-5 sm:p-6">
          {footer}
        </div>
      )}
    </section>
  )
}
