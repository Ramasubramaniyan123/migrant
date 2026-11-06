export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'

export interface CommunityEvent {
  id: string
  title: string
  description: string
  communityId: string
  communityName: string
  location: string
  city: string
  startsAt: string
  endsAt: string
  capacity?: number
  participantCount: number
  status: EventStatus
  organizerId: string
  organizerName: string
  imageUrl?: string
  createdAt: string
}

export interface EventParticipant {
  id: string
  eventId: string
  userId: string
  userName: string
  status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED'
  registeredAt: string
}
