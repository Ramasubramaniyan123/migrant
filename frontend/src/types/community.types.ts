export type CommunityRole = 'MEMBER' | 'MODERATOR' | 'ADMIN'

export interface Community {
  id: number
  name: string
  description: string
  languageId: number | null
  locationCountry?: string
  locationCity?: string
  isPublic: boolean
  memberCount: number
  createdBy: number
  createdAt: string
}

export interface CommunityMember {
  id: number
  communityId: number
  userId: number
  role: CommunityRole
  joinedAt: string
}

export interface Post {
  id: number
  communityId: number
  userId: number
  content: string
  imageUrl?: string | null
  likeCount: number
  commentCount: number
  createdAt: string
}

export interface Comment {
  id: number
  postId: number
  userId: number
  parentCommentId?: number | null
  content: string
  createdAt: string
}
