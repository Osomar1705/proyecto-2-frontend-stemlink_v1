import client from './client'
import type { BookingRequest, BookingResponse } from '../types'

export const bookingsApi = {
  create: (data: BookingRequest) =>
    client.post<BookingResponse>('/api/sessions', data),

  updateStatus: (id: number, status: string) =>
    client.patch<BookingResponse>(`/api/sessions/${id}/status`, { status }),
}
