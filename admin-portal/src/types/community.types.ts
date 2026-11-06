export type CommunityType = 'LANGUAGE' | 'HOMETOWN' | 'INTEREST' | 'WORKPLACE'

export interface Community {
  id: string
  name: string
  description: string
  type: CommunityType
  language?: string
  hometown?: string
  city: string
  memberCount: number
  postCount: number
  isActive: boolean
  createdBy: string
  createdAt: string
}

export interface CommunityMember {
  id: string
  communityId: string
  userId: string
  userName: string
  role: 'OWNER' | 'MODERATOR' | 'MEMBER'
  joinedAt: string
}
