export interface AnalyticsPoint {
  label: string
  value: number
}

export interface TimeSeriesPoint {
  date: string
  users: number
  activeUsers: number
  posts: number
  connections: number
}

export interface LanguageDistribution {
  language: string
  users: number
  percentage: number
}

export interface CityDistribution {
  city: string
  users: number
  percentage: number
}

export interface EngagementMetrics {
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  avgPostsPerUser: number
  avgConnectionsPerUser: number
  retentionDay7: number
  retentionDay30: number
}

export interface DashboardStatistics {
  totalUsers: number
  activeUsers: number
  newRegistrationsToday: number
  newRegistrationsThisWeek: number
  totalCommunities: number
  activeCommunities: number
  totalConnections: number
  pendingReports: number
  pendingModeration: number
  totalPosts: number
  totalMessages: number
}

export interface DashboardOverview {
  statistics: DashboardStatistics
  userGrowth: TimeSeriesPoint[]
  languageDistribution: LanguageDistribution[]
  cityDistribution: CityDistribution[]
  recentActivity: ActivityItem[]
  pendingReports: Report[]
}

export interface ActivityItem {
  id: string
  type: 'USER_JOINED' | 'COMMUNITY_CREATED' | 'POST_CREATED' | 'REPORT_FILED' | 'ADMIN_ACTION'
  description: string
  actorName?: string
  createdAt: string
}
