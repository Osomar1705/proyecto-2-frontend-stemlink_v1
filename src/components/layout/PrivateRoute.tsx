import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  role?: 'STUDENT' | 'MENTOR'
}

export function PrivateRoute({ children, role }: Props) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
