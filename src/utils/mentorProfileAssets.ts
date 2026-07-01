export interface MentorProfileEnhancements {
  linkedinUrl: string
  instagramUrl: string
  photoUrl: string | null
}

const STORAGE_PREFIX = 'stemlink:mentor-profile-assets:v1:'

const EMPTY_ENHANCEMENTS: MentorProfileEnhancements = {
  linkedinUrl: '',
  instagramUrl: '',
  photoUrl: null,
}

export const PROFILE_ASSETS_EVENT = 'stemlink:profile-assets-updated'

function getStorageKey(mentorKey: number | string) {
  return `${STORAGE_PREFIX}${String(mentorKey).trim().toLowerCase()}`
}

export function getMentorProfileEnhancements(mentorKey: number | string): MentorProfileEnhancements {
  if (typeof window === 'undefined') return EMPTY_ENHANCEMENTS

  try {
    const storedValue = window.localStorage.getItem(getStorageKey(mentorKey))
    if (!storedValue) return EMPTY_ENHANCEMENTS

    const parsed = JSON.parse(storedValue) as Partial<MentorProfileEnhancements>
    return {
      linkedinUrl: typeof parsed.linkedinUrl === 'string' ? parsed.linkedinUrl : '',
      instagramUrl: typeof parsed.instagramUrl === 'string' ? parsed.instagramUrl : '',
      photoUrl: typeof parsed.photoUrl === 'string' ? parsed.photoUrl : null,
    }
  } catch {
    return EMPTY_ENHANCEMENTS
  }
}

export function saveMentorProfileEnhancements(
  mentorKey: number | string,
  updates: Partial<MentorProfileEnhancements>,
) {
  if (typeof window === 'undefined') return

  const current = getMentorProfileEnhancements(mentorKey)
  const nextValue = {
    ...current,
    ...updates,
  }

  window.localStorage.setItem(getStorageKey(mentorKey), JSON.stringify(nextValue))
  window.dispatchEvent(new CustomEvent(PROFILE_ASSETS_EVENT, { detail: { key: mentorKey } }))
}

export function clearMentorPhoto(mentorKey: number | string) {
  saveMentorProfileEnhancements(mentorKey, { photoUrl: null })
}

export function getMentorPhoto(mentorKey: number | string) {
  return getMentorProfileEnhancements(mentorKey).photoUrl
}

export function getMentorInstagram(mentorKey: number | string) {
  return getMentorProfileEnhancements(mentorKey).instagramUrl
}

export function getUserProfileEnhancements(userKey: number | string) {
  return getMentorProfileEnhancements(`user:${userKey}`)
}

export function saveUserProfileEnhancements(
  userKey: number | string,
  updates: Partial<MentorProfileEnhancements>,
) {
  saveMentorProfileEnhancements(`user:${userKey}`, updates)
}

export function clearUserPhoto(userKey: number | string) {
  clearMentorPhoto(`user:${userKey}`)
}

export function getUserPhoto(userKey: number | string) {
  return getMentorPhoto(`user:${userKey}`)
}
