import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { GraduationCap, Bell, LogOut, User } from 'lucide-react'

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="nav-shell sticky top-0 z-40 border-b border-border bg-surface/90 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2 text-base font-bold tracking-tight text-primary-700 transition-colors duration-200 hover:text-primary-600 sm:gap-3 sm:text-xl">
          <span className="surface-interactive flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-surface shadow-[0_4px_12px_rgba(79,70,229,0.18)] sm:h-10 sm:w-10">
            <GraduationCap size={20} aria-hidden />
          </span>
          <span className="hidden whitespace-nowrap min-[360px]:inline">STEM Link</span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link to="/mentors" className="inline-flex items-center text-sm font-medium text-muted transition-[color,transform] duration-200 hover:-translate-y-px hover:text-primary-700 sm:inline-flex">
            Mentores
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" aria-label="Ver notificaciones" className="surface-interactive rounded-xl p-2 text-muted hover:bg-surface-alt hover:text-primary-700">
                <Bell size={20} className="icon-micro" aria-hidden />
              </Link>
              <Link to="/dashboard" className="surface-interactive flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-text hover:border-primary-200 hover:bg-surface-alt hover:text-primary-700">
                <User size={16} className="icon-micro" aria-hidden />
                {user?.name}
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="!px-3" aria-label="Cerrar sesión">
                <LogOut size={16} className="icon-micro" aria-hidden />
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/login')} className="px-3 sm:px-4">Ingresar</Button>
              <Button onClick={() => navigate('/register')} className="px-3 sm:px-4">Registrarse</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
