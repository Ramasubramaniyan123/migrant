import type { UserSummary } from './user.types'

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED'

export type MatchReason = 'HOMETOWN' | 'LANGUAGE' | 'LOCATION' | 'INTERESTS'

export interface Connection {
  id: number
  requesterId: number
  receiverId: number
  status: ConnectionStatus
  matchScore: number
  matchedBy: MatchReason
  createdAt: string
  updatedAt: string
}

/** A user enriched with discovery-specific scoring, ready for the UI. */
export interface DiscoveredUser extends UserSummary {
  matchScore: number
  matchReason: MatchReason
}

export interface DiscoveryFilters {
  query?: string
  languageId?: number
  hometownCity?: string
  hometownCountry?: string
  interests?: string[]
  maxDistanceKm?: number
  sortBy?: 'distance' | 'match' | 'recent'
}
