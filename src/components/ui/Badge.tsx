interface Props {
  label: string
  color?: 'indigo' | 'green' | 'yellow' | 'red' | 'gray'
}

const colors = {
  indigo: 'bg-indigo-100 text-indigo-700',
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
  gray:   'bg-gray-100 text-gray-600',
}

export function Badge({ label, color = 'indigo' }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  )
}
