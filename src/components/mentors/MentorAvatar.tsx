interface Props {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const portraitSizes = {
  sm: 'size-12',
  md: 'size-16',
  lg: 'size-24',
  xl: 'size-32',
}

const portraits = [
  '/mentor-avatars/portrait-a.svg',
  '/mentor-avatars/portrait-b.svg',
  '/mentor-avatars/portrait-c.svg',
  '/mentor-avatars/portrait-d.svg',
]

const portraitOverrides: Record<string, string> = {
  hades: '/mentor-avatars/portrait-c.svg',
}

function getPortrait(name: string) {
  const normalized = name.trim().toLowerCase()
  if (portraitOverrides[normalized]) return portraitOverrides[normalized]

  const hash = normalized.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return portraits[hash % portraits.length]
}

export function MentorAvatar({ name, src, size = 'md', className = '' }: Props) {
  const portrait = src || getPortrait(name)

  return (
    <div className={`relative inline-flex rounded-full bg-[linear-gradient(135deg,rgba(99,102,241,0.55),rgba(20,184,166,0.42))] p-[3px] shadow-[0_10px_24px_rgba(79,70,229,0.18)] ${className}`}>
      <div className={`overflow-hidden rounded-full ring-4 ring-surface ${portraitSizes[size]}`}>
        <img
          src={portrait}
          alt={`Foto de perfil de ${name}`}
          className="h-full w-full rounded-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  )
}
