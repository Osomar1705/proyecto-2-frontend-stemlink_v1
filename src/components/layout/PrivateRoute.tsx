import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  role?: 'STUDENT' | 'MENTOR'
}

export function PrivateRoute({ children, role }: Props) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
