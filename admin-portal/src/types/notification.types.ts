export type PlatformNotificationType = 'ANNOUNCEMENT' | 'MAINTENANCE' | 'POLICY' | 'EVENT'
export type BroadcastAudience = 'ALL' | 'ACTIVE_USERS' | 'NEW_USERS' | 'COMMUNITY_MEMBERS'

export interface PlatformNotification {
  id: string
  title: string
  body: string
  type: PlatformNotificationType
  audience: BroadcastAudience
  sentBy: string
  sentAt: string
  recipientCount: number
  status: 'DRAFT' | 'SENT' | 'SCHEDULED'
}
