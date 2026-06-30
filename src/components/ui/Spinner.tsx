export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex items-center justify-center p-4" role="status" aria-label="Cargando contenido">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-100 border-t-primary-600`} aria-hidden="true" />
    </div>
  )
}
