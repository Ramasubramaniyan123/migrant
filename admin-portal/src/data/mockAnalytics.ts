import type { TimeSeriesPoint, LanguageDistribution, CityDistribution, EngagementMetrics, ActivityItem } from '@/types/analytics.types'

const isoDaysAgo = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export const MOCK_USER_GROWTH: TimeSeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const day = 30 - i
  const date = isoDaysAgo(day)
  // Deterministic-ish growth curve with weekly noise
  const base = Math.round(1800 + day * 22)
  const users = base + ((i * 37) % 90)
  const activeUsers = Math.round(users * (0.68 + ((i * 13) % 20) / 100))
  return {
    date,
    users,
    activeUsers,
    posts: 40 + ((i * 17) % 60),
    connections: 25 + ((i * 11) % 45),
  }
})

export const MOCK_LANGUAGE_DISTRIBUTION: LanguageDistribution[] = [
  { language: 'Hindi', users: 1240, percentage: 26.1 },
  { language: 'Tamil', users: 612, percentage: 12.9 },
  { language: 'Malayalam', users: 488, percentage: 10.3 },
  { language: 'Marathi', users: 402, percentage: 8.5 },
  { language: 'Telugu', users: 356, percentage: 7.5 },
  { language: 'Kannada', users: 298, percentage: 6.3 },
  { language: 'Bengali', users: 274, percentage: 5.8 },
  { language: 'Urdu', users: 230, percentage: 4.8 },
  { language: 'Gujarati', users: 186, percentage: 3.9 },
  { language: 'Others', users: 665, percentage: 14.0 },
]

export const MOCK_CITY_DISTRIBUTION: CityDistribution[] = [
  { city: 'Gurugram', users: 843, percentage: 17.8 },
  { city: 'Bengaluru', users: 762, percentage: 16.1 },
  { city: 'Mumbai', users: 654, percentage: 13.8 },
  { city: 'Delhi', users: 598, percentage: 12.6 },
  { city: 'Hyderabad', users: 421, percentage: 8.9 },
  { city: 'Pune', users: 389, percentage: 8.2 },
  { city: 'Chennai', users: 356, percentage: 7.5 },
  { city: 'Noida', users: 287, percentage: 6.1 },
  { city: 'Others', users: 410, percentage: 8.6 },
]

export const MOCK_ENGAGEMENT: EngagementMetrics = {
  dailyActiveUsers: 1820,
  weeklyActiveUsers: 3240,
  monthlyActiveUsers: 3980,
  avgPostsPerUser: 2.4,
  avgConnectionsPerUser: 5.1,
  retentionDay7: 62.4,
  retentionDay30: 41.8,
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'act-a1', type: 'REPORT_FILED', description: 'Report filed on post by Rohit Yadav', createdAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: 'act-a2', type: 'USER_JOINED', description: 'New user registered: Suresh Reddy', actorName: 'Suresh Reddy', createdAt: new Date(Date.now() - 7200_000).toISOString() },
  { id: 'act-a3', type: 'POST_CREATED', description: 'New post in "Tamil Nadu Migrants – Gurugram"', actorName: 'Arun Krishnan', createdAt: new Date(Date.now() - 10800_000).toISOString() },
  { id: 'act-a4', type: 'COMMUNITY_CREATED', description: 'Community created: "Bengali Students & Professionals"', actorName: 'Lakshmi Narayan', createdAt: new Date(Date.now() - 86400_000 * 2).toISOString() },
  { id: 'act-a5', type: 'ADMIN_ACTION', description: 'Sneha Iyer dismissed report rep-007', createdAt: new Date(Date.now() - 86400_000 * 3).toISOString() },
]
