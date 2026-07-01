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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => getStoredAuth())
  const [token, setToken] = useState<string | null>(() => user?.token ?? null)

  const login = async (data: LoginRequest) => {
    const res = await authApi.login(data)
    const auth = res.data
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
