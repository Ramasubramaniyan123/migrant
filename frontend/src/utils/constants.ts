export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  APP: '/app',
  DISCOVER: '/discover',
  HOMETOWN: '/hometown',
  COMMUNITIES: '/communities',
  COMMUNITY_DETAILS: '/communities/:id',
  CONNECTIONS: '/connections',
  MESSAGES: '/messages',
  CONVERSATION: '/messages/:id',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  USER_PROFILE: '/profile/:id',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  ADMIN: '/admin',
} as const;

export const CONNECTION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  BLOCKED: 'blocked',
} as const;

export const LANGUAGE_PROFICIENCY = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  NATIVE: 'native',
} as const;

export const NOTIFICATION_TYPES = {
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPTED: 'connection_accepted',
  CONNECTION_REJECTED: 'connection_rejected',
  NEW_MESSAGE: 'new_message',
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  COMMUNITY_INVITE: 'community_invite',
  SYSTEM: 'system',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
} as const;
