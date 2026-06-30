interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'size-12 text-sm',
  md: 'size-16 text-base',
  lg: 'size-24 text-2xl',
  xl: 'size-32 text-4xl',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'ST'
}

export function MentorAvatar({ name, size = 'md', className = '' }: Props) {
  return (
    <div className={`relative inline-flex rounded-full bg-[linear-gradient(135deg,rgba(99,102,241,0.55),rgba(20,184,166,0.42))] p-[3px] shadow-[0_10px_24px_rgba(79,70,229,0.18)] ${className}`}>
      <div className={`flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.95),rgba(79,70,229,1)_70%)] font-bold text-surface ring-4 ring-surface ${sizes[size]}`}>
        {getInitials(name)}
      </div>
    </div>
  )
}
