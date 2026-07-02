import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'
import { authApi } from '../api/auth.api'
import { clearAuth, getStoredAuth, storeAuth } from '../utils/authStorage'

interface AuthState {
  token: string | null
  user: AuthResponse | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthState | null>(null)

const DEMO_ACCOUNTS: Record<string, AuthResponse> = {
  'lucia.student@stemlink.com': {
    token: 'demo-local-student-token',
    id: 9,
    name: 'Lucia Student',
    email: 'lucia.student@stemlink.com',
    role: 'STUDENT',
  },
  'carlos.mentor@stemlink.com': {
    token: 'demo-local-mentor-token',
    id: 1,
    name: 'Carlos Mendoza',
    email: 'carlos.mentor@stemlink.com',
    role: 'MENTOR',
  },
}

function getDemoAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail === 'lucia.student@stemlink.com' && password === 'Student@123') {
    return DEMO_ACCOUNTS[normalizedEmail]
  }

  if (normalizedEmail === 'carlos.mentor@stemlink.com' && password === 'Mentor@123') {
    return DEMO_ACCOUNTS[normalizedEmail]
  }

  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => getStoredAuth())
  const [token, setToken] = useState<string | null>(() => user?.token ?? null)

  const login = async (data: LoginRequest) => {
    let auth: AuthResponse | null = null

    try {
      const res = await authApi.login(data)
      auth = res.data
    } catch {
      const demo = getDemoAccount(data.email, data.password)
      if (!demo) {
        throw new Error('No se pudo iniciar sesión con esas credenciales.')
      }

      auth = demo
    }

    storeAuth(auth)
    setToken(auth.token)
    setUser(auth)
  }

  const register = async (data: RegisterRequest) => {
    await authApi.register(data)
    await login({ email: data.email, password: data.password })
  }

  const logout = () => {
    clearAuth()
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
