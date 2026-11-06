export interface ConnectionEdge {
  id: string
  requesterId: string
  requesterName: string
  addresseeId: string
  addresseeName: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED'
  createdAt: string
  acceptedAt?: string
}

export interface ConnectionStats {
  total: number
  pending: number
  accepted: number
  acceptanceRate: number
  avgRequestsPerUser: number
  connectionsByCity: { city: string; count: number }[]
  connectionsByLanguage: { language: string; count: number }[]
  weeklyTrend: { week: string; sent: number; accepted: number }[]
}
