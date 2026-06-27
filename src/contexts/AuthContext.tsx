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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('token'))
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const stored = sessionStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

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
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
