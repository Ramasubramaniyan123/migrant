export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'DEACTIVATED'

export interface PlatformUser {
  id: string
  fullName: string
  email: string
  phone?: string
  avatarUrl?: string
  status: UserStatus
  isVerified: boolean
  hometown: string
  hometownState: string
  currentCity: string
  currentLocality: string
  motherTongue: string
  languages: string[]
  occupation?: string
  joinedAt: string
  lastActiveAt: string
}

export interface UserActivityEntry {
  id: string
  userId: string
  type: 'LOGIN' | 'POST' | 'COMMENT' | 'CONNECTION' | 'MESSAGE' | 'PROFILE_UPDATE' | 'COMMUNITY_JOIN'
  description: string
  createdAt: string
}
