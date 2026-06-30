import client from './client'
import type { BookingRequest, BookingResponse, Page } from '../types'

export const bookingsApi = {
  list: (params: { page?: number; size?: number; status?: string }, signal?: AbortSignal) =>
    client.get<Page<BookingResponse>>('/api/bookings', { params, signal }),

  create: (data: BookingRequest) =>
    client.post<BookingResponse>('/api/bookings', data),

  updateStatus: (id: number, status: string) =>
    client.patch<BookingResponse>(`/api/bookings/${id}/status`, { status }),
}
