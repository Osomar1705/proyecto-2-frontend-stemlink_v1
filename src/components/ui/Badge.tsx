interface Props {
  label: string
  color?: 'indigo' | 'green' | 'yellow' | 'red' | 'gray'
}

const colors = {
  indigo: 'bg-primary-50 text-primary-700',
  green:  'bg-accent-50 text-accent-600',
  yellow: 'bg-primary-100 text-primary-700',
  red:    'bg-surface-alt text-muted',
  gray:   'bg-surface-alt text-muted',
}

export function Badge({ label, color = 'indigo' }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  )
}
