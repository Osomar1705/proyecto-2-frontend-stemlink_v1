import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface StatCardProps {
  title: string
  value: string | number
  helper: string
  icon: LucideIcon
  tone: string
}

export function StatCard({ title, value, helper, icon: Icon, tone }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/70 p-6">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary-100/50 blur-3xl" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-text">{value}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{helper}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 shadow-sm ${tone}`}>
          <Icon size={22} aria-hidden />
        </div>
      </div>
    </Card>
  )
}
