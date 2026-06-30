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
    <Card className="border-border/70 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-text">{value}</p>
          <p className="mt-1.5 text-sm leading-6 text-muted">{helper}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-border ${tone}`}>
          <Icon size={20} aria-hidden />
        </div>
      </div>
    </Card>
  )
}
