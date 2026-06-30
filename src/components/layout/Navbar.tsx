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
    <nav className="sticky top-0 z-40 border-b border-border/70 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-primary-700">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-surface shadow-[0_12px_30px_rgba(79,70,229,0.25)]">
            <GraduationCap size={20} />
          </span>
          <span>STEM Link</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/mentors" className="text-sm font-medium text-muted transition-colors hover:text-primary-700">
            Mentores
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="rounded-xl p-2 text-muted transition-colors hover:bg-surface-alt hover:text-primary-700">
                <Bell size={20} />
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:border-primary-200 hover:text-primary-700">
                <User size={16} />
                {user?.name}
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="!px-3">
                <LogOut size={16} />
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/login')}>Ingresar</Button>
              <Button onClick={() => navigate('/register')}>Registrarse</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
