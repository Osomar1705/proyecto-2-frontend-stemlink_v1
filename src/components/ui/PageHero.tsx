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
    <section className={`relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm ${className}`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500" />
      <div className="relative p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-100/60 blur-3xl" />

        <div className={`relative flex flex-col gap-6 ${aside ? 'lg:flex-row lg:items-end lg:justify-between' : ''}`}>
          <div className="max-w-3xl">
            {badge}
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-text sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p>
            {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          </div>

          {aside && <div className="lg:max-w-sm">{aside}</div>}
        </div>
      </div>

      {footer && (
        <div className="border-t border-border/70 bg-surface-alt/60 p-6 sm:p-8">
          {footer}
        </div>
      )}
    </section>
  )
}
