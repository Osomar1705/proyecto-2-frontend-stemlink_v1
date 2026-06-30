import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 && <ChevronRight size={14} aria-hidden className="text-border" />}

              {item.to && !isCurrent ? (
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1 rounded-md transition-colors hover:text-primary-600"
                >
                  {index === 0 && <Home size={14} aria-hidden />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className={isCurrent ? 'font-medium text-text' : 'inline-flex items-center gap-1'}
                >
                  {index === 0 && !item.to && <Home size={14} aria-hidden />}
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
