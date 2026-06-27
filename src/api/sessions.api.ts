import client from './client'
import type { MentorshipSessionResponse, SessionFeedbackDTO } from '../types'

export const sessionsApi = {
  list: (status?: string, signal?: AbortSignal) =>
    client.get<MentorshipSessionResponse[]>('/api/sessions', { params: { status }, signal }),

  submitFeedback: (sessionId: number, data: SessionFeedbackDTO) =>
    client.post(`/api/sessions/${sessionId}/feedback`, data),
}
