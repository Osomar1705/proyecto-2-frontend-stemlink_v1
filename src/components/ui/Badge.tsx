interface Props {
  label: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
}

const colors = {
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-accent-50 text-accent-600',
  warning: 'bg-primary-100 text-primary-700',
  danger:  'bg-surface-alt text-muted',
  neutral: 'bg-surface-alt text-muted',
}

export function Badge({ label, color = 'primary' }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  )
}
