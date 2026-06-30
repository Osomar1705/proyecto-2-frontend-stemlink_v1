export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex items-center justify-center p-4" role="status" aria-label="Cargando contenido">
      <div className={`spinner-orbit ${sizes[size]}`} aria-hidden="true">
        <span />
      </div>
    </div>
  )
}
