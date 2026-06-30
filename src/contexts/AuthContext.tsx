import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'
import { authApi } from '../api/auth.api'

interface AuthState {
  token: string | null
  user: AuthResponse | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthState | null>(null)

function isAuthResponse(value: unknown): value is AuthResponse {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<AuthResponse>
  return (
    typeof candidate.token === 'string' &&
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    (candidate.role === 'STUDENT' || candidate.role === 'MENTOR')
  )
}

function getStoredAuth(): AuthResponse | null {
  const stored = sessionStorage.getItem('user')
  if (!stored) return null

  try {
    const parsed = JSON.parse(stored)
    if (isAuthResponse(parsed)) return parsed
  } catch {
    // Invalid persisted auth should not break the app on first render.
  }

  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => getStoredAuth())
  const [token, setToken] = useState<string | null>(() => user?.token ?? null)

  const login = async (data: LoginRequest) => {
    const res = await authApi.login(data)
    const auth = res.data
    sessionStorage.setItem('token', auth.token)
    sessionStorage.setItem('user', JSON.stringify(auth))
    setToken(auth.token)
    setUser(auth)
  }

  const register = async (data: RegisterRequest) => {
    await authApi.register(data)
    await login({ email: data.email, password: data.password })
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
