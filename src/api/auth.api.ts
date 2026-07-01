import client from './client'
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../types'

export const authApi = {
  register: (data: RegisterRequest) =>
    client.post<UserResponse>('/api/auth/register', data),

  login: (data: LoginRequest) =>
    client.post<AuthResponse>('/api/auth/login', data),

  me: (signal?: AbortSignal) =>
    client.get<UserResponse>('/api/users/me', { signal }),

  updatePhoto: (photoUrl: string | null) =>
    client.patch<UserResponse>('/api/users/me/photo', { photoUrl }),
}
