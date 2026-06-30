interface Props {
  label: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}

const colors = {
  primary: 'border border-primary-100 bg-primary-50 text-primary-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
  success: 'border border-accent-200 bg-accent-50 text-accent-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
  warning: 'border border-primary-200 bg-primary-100 text-primary-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
  danger: 'border border-slate-200 bg-slate-100 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
  neutral: 'border border-border bg-surface-alt text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]',
}

export function Badge({ label, color = 'primary' }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-[0.01em] ${colors[color]}`}>
      {label}
    </span>
  )
}
