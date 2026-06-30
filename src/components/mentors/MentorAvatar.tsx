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
    <div className={`relative inline-flex rounded-full bg-primary-100 p-[3px] ${className}`}>
      <div className={`flex items-center justify-center rounded-full bg-primary-600 font-bold text-surface ring-4 ring-surface ${sizes[size]}`}>
        {getInitials(name)}
      </div>
    </div>
  )
}
