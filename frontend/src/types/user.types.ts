export type UserRole = 'USER' | 'ADMIN'

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE'

export interface UserLanguage {
  languageId: number
  proficiency: ProficiencyLevel
  isPrimary: boolean
}

export interface PrivacySettings {
  showHometown: boolean
  showExactLocation: boolean
  allowConnectionRequests: boolean
  showOnlineStatus: boolean
}

export interface UserProfile {
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: Gender
  bio?: string
  avatarUrl?: string
  hometownCountry?: string
  hometownCity?: string
  currentCountry?: string
  currentCity?: string
  latitude?: number
  longitude?: number
  locationAccuracyKm?: number
  interests: string[]
  languages: UserLanguage[]
  privacy: PrivacySettings
  onboardingCompleted: boolean
}

export interface User {
  id: number
  email: string
  role: UserRole
  isActive: boolean
  isVerified: boolean
  createdAt: string
  profile: UserProfile
}

/** Shape collected by the multi-step onboarding wizard, before it becomes a `UserProfile`. */
export interface OnboardingFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: Gender | ''
  bio: string
  languageIds: number[]
  primaryLanguageId?: number
  hometownCountry: string
  hometownCity: string
  currentCountry: string
  currentCity: string
  latitude?: number
  longitude?: number
  shareExactLocation: boolean
  interests: string[]
}

/** Lightweight user shape used across cards, lists and chat. */
export interface UserSummary {
  id: number
  fullName: string
  avatarUrl?: string
  hometownCity?: string
  hometownCountry?: string
  currentCity?: string
  bio?: string
  interests: string[]
  languageNames: string[]
  languageIds: number[]
  distanceKm?: number
  matchScore?: number
}
