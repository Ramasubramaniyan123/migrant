import type { AdminRole } from '@/types/admin.types'

/** Route constants for the admin portal. */
export const ADMIN_ROUTES = {
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  dashboard: '/dashboard',

  users: '/users',
  userDetails: (id: string) => `/users/${id}`,
  userActivity: (id: string) => `/users/${id}/activity`,
  suspendedUsers: '/users/suspended',

  communities: '/communities',
  communityDetails: (id: string) => `/communities/${id}`,
  createCommunity: '/communities/new',
  editCommunity: (id: string) => `/communities/${id}/edit`,
  communityMembers: (id: string) => `/communities/${id}/members`,

  languages: '/languages',
  createLanguage: '/languages/new',
  editLanguage: (id: string) => `/languages/${id}/edit`,

  locations: '/locations',
  cities: '/locations/cities',
  localities: '/locations/localities',

  moderation: '/moderation',
  reports: '/moderation/reports',
  reportDetails: (id: string) => `/moderation/reports/${id}`,
  postModeration: '/moderation/posts',
  userModeration: '/moderation/users',
  blockedContent: '/moderation/blocked',
  moderationHistory: '/moderation/history',

  posts: '/posts',
  postDetails: (id: string) => `/posts/${id}`,
  flaggedPosts: '/posts/flagged',

  connections: '/connections',
  connectionAnalytics: '/connections/analytics',

  events: '/events',
  createEvent: '/events/new',
  editEvent: (id: string) => `/events/${id}/edit`,
  eventParticipants: (id: string) => `/events/${id}/participants`,

  analytics: '/analytics',
  userGrowth: '/analytics/user-growth',
  engagement: '/analytics/engagement',
  languageDistribution: '/analytics/languages',
  geographicDistribution: '/analytics/geography',
  retention: '/analytics/retention',

  administrators: '/administrators',
  createAdmin: '/administrators/new',
  adminDetails: (id: string) => `/administrators/${id}`,
  rolesPermissions: '/administrators/roles',

  auditLogs: '/audit-logs',
  adminActivity: '/audit-logs/activity',

  notifications: '/notifications',
  sendNotification: '/notifications/send',
  notificationHistory: '/notifications/history',

  settings: '/settings',
  platformSettings: '/settings/platform',
  securitySettings: '/settings/security',
  maintenance: '/settings/maintenance',
} as const

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  SUPPORT: 'Support',
  ANALYST: 'Analyst',
}

export const ITEMS_PER_PAGE = 10
