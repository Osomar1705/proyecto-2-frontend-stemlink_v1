import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { GraduationCap, Bell, LogOut, User } from 'lucide-react'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const [isDark, setIsDark] = useState<boolean>(() => typeof window !== 'undefined' && document.documentElement.classList.contains('dark'))

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('theme')
    if (stored) {
      document.documentElement.classList.toggle('dark', stored === 'dark')
      setIsDark(stored === 'dark')
    } else {
      // match system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
      setIsDark(prefersDark)
    }
  }, [])

  function toggleTheme() {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    try { window.localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
    setIsDark(next)
  }

  return (
    <nav className="nav-shell sticky top-0 z-40 border-b border-border/70 bg-surface/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="group flex shrink-0 items-center gap-2 text-base font-bold tracking-tight text-primary-700 transition-all duration-300 ease-in-out hover:text-primary-600 sm:gap-3 sm:text-xl">
          <span className="surface-interactive flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-surface shadow-[0_8px_20px_rgba(79,70,229,0.2)] sm:h-11 sm:w-11">
            <GraduationCap size={20} aria-hidden />
          </span>
          <span className="hidden whitespace-nowrap min-[420px]:inline">
            STEM <span className="text-text">Link</span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme" className="!px-2">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <Link to="/mentors" className="hidden min-[420px]:inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold text-muted transition-all duration-300 ease-in-out hover:-translate-y-px hover:bg-surface hover:text-primary-700">
            Mentores
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" aria-label="Ver notificaciones" className="surface-interactive rounded-2xl border border-transparent p-2 text-muted hover:border-border hover:bg-surface hover:text-primary-700">
                <Bell size={20} className="icon-micro" aria-hidden />
              </Link>
              <Link to="/dashboard" className="surface-interactive flex items-center gap-2 rounded-2xl border border-border/80 bg-surface/95 px-3 py-2 text-sm font-semibold text-text hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700 hover:shadow-[0_10px_24px_rgba(79,70,229,0.08)]">
                <User size={16} className="icon-micro" aria-hidden />
                <span className="hidden sm:inline">{user?.name}</span>
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
