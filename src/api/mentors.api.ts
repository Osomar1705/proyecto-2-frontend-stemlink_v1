import client from './client'
import type { MentorProfileResponse, MentorProfileRequest, Page, TechnicalSkillDTO, AvailabilityBlockDTO } from '../types'

export const mentorsApi = {
  list: (params: { name?: string; skillIds?: number[]; page?: number; size?: number }, signal?: AbortSignal) =>
    client.get<Page<MentorProfileResponse>>('/api/mentors', { params, signal }),

  getById: (id: number, signal?: AbortSignal) =>
    client.get<MentorProfileResponse>(`/api/mentors/${id}`, { signal }),

  updateProfile: (data: MentorProfileRequest) =>
    client.patch<MentorProfileResponse>('/api/users/me/profile', data),

  updateTags: (skillIds: number[]) =>
    client.post<MentorProfileResponse>('/api/users/me/tags', skillIds),

  getAvailability: (id: number, signal?: AbortSignal) =>
    client.get<AvailabilityBlockDTO[]>(`/api/mentors/${id}/availability`, { signal }),

  addAvailability: (data: Omit<AvailabilityBlockDTO, 'id'>) =>
    client.post<AvailabilityBlockDTO>('/api/mentors/me/availability', data),

  deleteAvailability: (id: number) =>
    client.delete(`/api/mentors/me/availability/${id}`),

  getTags: (signal?: AbortSignal) =>
    client.get<TechnicalSkillDTO[]>('/api/tags', { signal }),
}
