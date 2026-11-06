export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const USE_MOCK_DATA = (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') === 'true'

export const APP_NAME = 'Migrant Community Platform'

export const STORAGE_KEYS = {
  authUser: 'mcp.auth.user',
  authToken: 'mcp.auth.token',
  onboarding: 'mcp.onboarding',
  language: 'mcp.ui.language',
  theme: 'mcp.ui.theme',
} as const

export const ROUTES = {
  landing: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  discover: '/discover',
  hometown: '/hometown',
  communities: '/communities',
  communityDetails: (id: number | string) => `/communities/${id}`,
  connections: '/connections',
  messages: '/messages',
  profile: '/profile',
  editProfile: '/profile/edit',
  userProfile: (id: number | string) => `/profile/${id}`,
  notifications: '/notifications',
  settings: '/settings',
  admin: '/admin',
  adminUsers: '/admin/users',
  adminReports: '/admin/reports',
  adminCommunities: '/admin/communities',
} as const

export const PROFICIENCY_LABELS: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  NATIVE: 'Native',
}

export const MATCH_REASON_LABELS: Record<string, string> = {
  HOMETOWN: 'Same hometown',
  LANGUAGE: 'Shared language',
  LOCATION: 'Nearby',
  INTERESTS: 'Shared interests',
}

export const NOTIFICATION_LABELS: Record<string, string> = {
  CONNECTION_REQUEST: 'Connection request',
  MESSAGE: 'New message',
  COMMUNITY_INVITE: 'Community invite',
  POST_LIKE: 'Post liked',
  COMMENT: 'New comment',
}

export const INTEREST_OPTIONS = [
  'Cooking',
  'Music',
  'Cricket',
  'Football',
  'Travel',
  'Fitness',
  'Movies',
  'Reading',
  'Photography',
  'Tech',
  'Language exchange',
  'Volunteering',
  'Study groups',
  'Job hunting',
  'Parenting',
]
