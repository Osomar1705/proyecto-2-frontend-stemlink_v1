import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface Props {
  children: ReactNode
}

export function PublicRoute({ children }: Props) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = location.state?.from?.pathname
    const fallback = user?.role === 'MENTOR' ? '/mentor/profile' : '/dashboard'
    return <Navigate to={from || fallback} replace />
  }

  return <>{children}</>
}
