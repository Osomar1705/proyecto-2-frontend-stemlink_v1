import type { AuthResponse } from '../types'

function hasWindow() {
  return typeof window !== 'undefined'
}

export function isAuthResponse(value: unknown): value is AuthResponse {
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

export function getStoredAuth(): AuthResponse | null {
  if (!hasWindow()) return null

  const stored = sessionStorage.getItem('user')
  if (!stored) return null

  try {
    const parsed = JSON.parse(stored)
    if (isAuthResponse(parsed)) return parsed
  } catch {
    // Invalid persisted auth should not break the app on first render.
  }

  clearAuth()
  return null
}

export function getStoredToken() {
  return getStoredAuth()?.token ?? (hasWindow() ? sessionStorage.getItem('token') : null)
}

export function storeAuth(auth: AuthResponse) {
  if (!hasWindow()) return

  sessionStorage.setItem('token', auth.token)
  sessionStorage.setItem('user', JSON.stringify(auth))
}

export function updateStoredAuth(patch: Partial<AuthResponse>) {
  const current = getStoredAuth()
  if (!current) return null

  const next = {
    ...current,
    ...patch,
  } as AuthResponse

  storeAuth(next)
  return next
}

export function clearAuth() {
  if (!hasWindow()) return

  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
}
