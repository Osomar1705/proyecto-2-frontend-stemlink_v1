interface Props {
  label: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}

const colors = {
  primary: 'border border-primary-100 bg-primary-50 text-primary-700',
  success: 'border border-accent-100 bg-accent-50 text-accent-700',
  warning: 'border border-primary-100 bg-primary-100 text-primary-700',
  danger:  'border border-border bg-surface-alt text-muted',
  neutral: 'border border-border bg-surface-alt text-muted',
}

export function Badge({ label, color = 'primary' }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  )
}
