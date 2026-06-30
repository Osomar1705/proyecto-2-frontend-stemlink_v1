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
    <section className={`overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm ${className}`}>
      <div className="relative p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-100/60 blur-3xl" />

        <div className={`relative flex flex-col gap-5 ${aside ? 'lg:flex-row lg:items-end lg:justify-between' : ''}`}>
          <div className="max-w-3xl">
            {badge}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p>
            {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          </div>

          {aside && <div className="lg:max-w-sm">{aside}</div>}
        </div>
      </div>

      {footer && (
        <div className="border-t border-border bg-surface-alt/60 p-6 sm:p-8">
          {footer}
        </div>
      )}
    </section>
  )
}
