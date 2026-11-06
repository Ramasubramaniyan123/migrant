export type NotificationType =
  | 'CONNECTION_REQUEST'
  | 'MESSAGE'
  | 'COMMUNITY_INVITE'
  | 'POST_LIKE'
  | 'COMMENT'

export interface AppNotification {
  id: number
  userId: number
  type: NotificationType
  title: string
  content: string
  relatedId?: number | null
  isRead: boolean
  createdAt: string
}
