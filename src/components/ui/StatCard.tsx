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
    <Card className="border-border p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-text">{value}</p>
          <p className="mt-1.5 text-sm leading-6 text-muted">{helper}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-border ${tone}`}>
          <Icon size={20} aria-hidden />
        </div>
      </div>
    </Card>
  )
}
