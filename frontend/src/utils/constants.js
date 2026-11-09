export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
export const APP_NAME = 'Migrant Community Platform';
export const STORAGE_KEYS = {
  authUser: 'mcp.auth.user',
  authToken: 'mcp.auth.token',
  authRefresh: 'mcp.auth.refresh',
  onboarding: 'mcp.onboarding',
  language: 'mcp.ui.language',
  theme: 'mcp.ui.theme'
};
export const ROUTES = {
  landing: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  discover: '/discover',
  hometown: '/hometown',
  communities: '/communities',
  communityDetails: id => `/communities/${id}`,
  connections: '/connections',
  messages: '/messages',
  profile: '/profile',
  editProfile: '/profile/edit',
  userProfile: id => `/profile/${id}`,
  notifications: '/notifications',
  settings: '/settings',
  admin: '/admin',
  adminUsers: '/admin/users',
  adminReports: '/admin/reports',
  adminCommunities: '/admin/communities'
};
export const PROFICIENCY_LABELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  NATIVE: 'Native'
};
export const MATCH_REASON_LABELS = {
  HOMETOWN: 'Same hometown',
  LANGUAGE: 'Shared language',
  LOCATION: 'Nearby',
  INTERESTS: 'Shared interests'
};
export const NOTIFICATION_LABELS = {
  CONNECTION_REQUEST: 'Connection request',
  CONNECTION_ACCEPTED: 'Connection accepted',
  MESSAGE: 'New message',
  COMMUNITY_INVITE: 'Community invite',
  POST: 'New post',
  POST_LIKE: 'Post liked',
  COMMENT: 'New comment',
  REACTION: 'New reaction',
  EVENT: 'Event update',
  SYSTEM: 'System'
};
export const INTEREST_OPTIONS = ['Cooking', 'Music', 'Cricket', 'Football', 'Travel', 'Fitness', 'Movies', 'Reading', 'Photography', 'Tech', 'Language exchange', 'Volunteering', 'Study groups', 'Job hunting', 'Parenting'];
