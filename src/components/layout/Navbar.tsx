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
    <nav className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
          <GraduationCap size={24} />
          STEM Link
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/mentors" className="text-sm text-muted hover:text-primary-600 transition-colors">
            Mentores
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="text-muted hover:text-primary-600 transition-colors">
                <Bell size={20} />
              </Link>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-text hover:text-primary-600 transition-colors">
                <User size={16} />
                {user?.name}
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="!px-2">
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
