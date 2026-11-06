export interface Post {
  id: string
  authorId: string
  authorName: string
  communityId: string
  communityName: string
  content: string
  imageUrl?: string
  likeCount: number
  commentCount: number
  isFlagged: boolean
  createdAt: string
}

export interface PostComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}
