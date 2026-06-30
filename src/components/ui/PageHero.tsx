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
    <section className={`surface-card fade-in-section relative overflow-hidden rounded-[2rem] ${className}`}>
      <div className="relative p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(99,102,241,0.08),transparent_40%,rgba(20,184,166,0.06)),radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_20rem)]" aria-hidden="true" />
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary-100/60 blur-3xl" aria-hidden="true" />

        <div className={`relative flex flex-col gap-6 ${aside ? 'lg:flex-row lg:items-end lg:justify-between' : ''}`}>
          <div className="max-w-3xl">
            {badge}
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-text sm:text-4xl lg:text-[2.65rem]">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">{description}</p>
            {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          </div>

          {aside && <div className="lg:max-w-sm">{aside}</div>}
        </div>
      </div>

      {footer && (
        <div className="border-t border-border/70 bg-surface-alt/55 p-5 sm:p-6">
          {footer}
        </div>
      )}
    </section>
  )
}
