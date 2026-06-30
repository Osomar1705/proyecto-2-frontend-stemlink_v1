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
    <Card className="border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold text-text">{value}</p>
          <p className="mt-2 text-sm text-muted">{helper}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
          <Icon size={22} aria-hidden />
        </div>
      </div>
    </Card>
  )
}
