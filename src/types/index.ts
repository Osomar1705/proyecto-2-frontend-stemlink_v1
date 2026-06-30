export interface AuthResponse {
  token: string
  id: number
  name: string
  email: string
  role: 'STUDENT' | 'MENTOR'
}

export interface UserResponse {
  id: number
  name: string
  email: string
  role: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TechnicalSkillDTO {
  id: number
  name: string
  description: string
}

export interface MentorProfileResponse {
  id: number
  name: string
  bio: string
  videoCallUrl: string
  linkedinUrl: string
  skills: TechnicalSkillDTO[]
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface AvailabilityBlockDTO {
  id: number
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface BookingRequest {
  mentorProfileId: number
  date: string
  availabilityBlockId?: number
  startTime?: string
  endTime?: string
  topic: string
}

export interface BookingResponse {
  id: number
  date: string
  startTime: string
  endTime: string
  topic: string
  status: string
  studentName: string
  studentEmail: string
  mentorName: string
  mentorEmail: string
}

export interface MentorshipSessionResponse {
  id: number
  topic: string
  status: string
  date: string
  startTime: string
  endTime: string
  mentorName: string
  studentName: string
}

export interface NotificationResponse {
  id: number
  message: string
  read: boolean
  createdAt: string
}

export interface SessionFeedbackDTO {
  stars: number
  mentorComments: string
  impactRecord: string
}

export interface MentorProfileRequest {
  bio: string
  videoCallUrl: string
  linkedinUrl: string
}

export interface ApiError {
  status: number
  error: string
  message?: string
  fields?: Record<string, string>
}
