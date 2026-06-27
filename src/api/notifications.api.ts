import client from './client'
import type { NotificationResponse, Page } from '../types'

export const notificationsApi = {
  list: (params: { page?: number; size?: number }, signal?: AbortSignal) =>
    client.get<Page<NotificationResponse>>('/api/notifications', { params, signal }),

  markRead: (id: number) =>
    client.patch(`/api/notifications/${id}/read`),
}
