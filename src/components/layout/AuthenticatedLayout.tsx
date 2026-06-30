import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useMatches, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  LogOut,
  Search,
  UserRound,
  Zap,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

type NavItem = {
  to: string
  label: string
  icon: typeof Home
}

const roleLabel = {
  STUDENT: 'Estudiante',
  MENTOR: 'Mentor',
} as const

export function AuthenticatedLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (location.pathname === '/mentors') {
      setSearch(searchParams.get('search') || '')
    }
  }, [location.pathname, searchParams])

  const navItems = useMemo<NavItem[]>(() => {
    const profilePath = user?.role === 'MENTOR' ? '/mentor/profile' : '/profile'

    return [
      { to: '/dashboard', label: 'Inicio', icon: Home },
      { to: '/mentors', label: 'Mentores', icon: Search },
      { to: '/sessions', label: 'Sesiones', icon: Calendar },
      { to: '/notifications', label: 'Notificaciones', icon: Bell },
      { to: profilePath, label: 'Mi perfil', icon: UserRound },
    ]
  }, [user?.role])

  const currentSection = useMemo(() => {
    const matchedTitle = [...matches]
      .reverse()
      .find((match) => {
        const handle = match.handle as { title?: string } | undefined
        return typeof handle?.title === 'string'
      })

    return (matchedTitle?.handle as { title?: string } | undefined)?.title || 'Panel'
  }, [matches])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = search.trim()
    navigate(next ? `/mentors?search=${encodeURIComponent(next)}` : '/mentors')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell min-h-screen">
      <aside className="hidden border-r border-border/70 bg-surface/82 backdrop-blur-xl lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="border-b border-border/70 px-6 py-6">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-surface shadow-[0_8px_20px_rgba(79,70,229,0.2)]">
              <Zap size={22} aria-hidden />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-text">
                STEM <span className="text-primary-600">Link</span>
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Workspace de mentoría</p>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'border-primary-100 bg-primary-50/90 text-primary-700 shadow-[0_8px_22px_rgba(79,70,229,0.08)]'
                    : 'border-transparent text-muted hover:border-border/80 hover:bg-surface hover:text-text'
                }`
              }
            >
              <Icon size={18} aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border/70 p-4">
          <div className="surface-tint mb-3 rounded-[1.35rem] border border-border/70 p-4">
            <p className="text-sm font-semibold text-text">{user?.name}</p>
            <p className="mt-1 text-xs text-muted">{user ? roleLabel[user.role] : 'Usuario'}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <LogOut size={18} aria-hidden />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/74 backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 lg:hidden">
              <NavLink to="/dashboard" className="flex items-center gap-2 text-text">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-surface shadow-[0_8px_20px_rgba(79,70,229,0.18)]">
                  <GraduationCap size={20} aria-hidden />
                </div>
                <div>
                  <p className="text-base font-bold tracking-tight">STEM Link</p>
                  <p className="text-xs text-muted">{currentSection}</p>
                </div>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border border-border/70 bg-surface/90 px-3 py-2 text-sm font-semibold text-text transition-colors hover:bg-primary-50/60"
              >
                Salir
              </button>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Área autenticada</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-text">{currentSection}</h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <form onSubmit={handleSearch} className="relative min-w-0 flex-1 sm:min-w-[20rem]">
                  <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar mentores..."
                    className="field-shell w-full rounded-2xl py-3 pl-10 pr-4 text-sm text-text outline-none transition-[border-color,box-shadow] placeholder:text-muted/75 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  />
                </form>

                <div className="hidden items-center gap-2 rounded-2xl border border-border/80 bg-surface/95 px-4 py-3 text-sm text-muted sm:flex">
                  <BookOpen size={16} className="text-primary-600" aria-hidden />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <nav className="no-scrollbar flex gap-2 overflow-x-auto overscroll-x-contain pb-1 lg:hidden">
              {navItems.map(({ to, label }) => (
                <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'border-primary-600 bg-primary-600 text-surface shadow-sm'
                        : 'border-border bg-surface/95 text-muted hover:border-primary-200 hover:text-text'
                    }`
                }
              >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="route-stage">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
