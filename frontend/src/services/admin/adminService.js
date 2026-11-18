import adminApi from '../api/adminClient'
import { unwrap, normalizePage } from '../api/apiClient'

const qs = (params = {}) => {
  const p = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, v)
  })
  return p.toString()
}

export const adminAuthService = {
  login: async ({ email, password }) =>
    unwrap(await adminApi.post('/v1/admin/auth/login', { email, password })),
  logout: async () => unwrap(await adminApi.post('/v1/admin/auth/logout')),
  forgotPassword: async (email) =>
    unwrap(await adminApi.post('/v1/admin/auth/forgot-password', { email })),
  resetPassword: async (payload) =>
    unwrap(await adminApi.post('/v1/admin/auth/reset-password', payload)),
}

export const adminDashboardService = {
  overview: async () => unwrap(await adminApi.get('/v1/admin/dashboard/overview')),
  statistics: async () => unwrap(await adminApi.get('/v1/admin/dashboard/statistics')),
}

export const adminUserService = {
  list: async (params = {}) => {
    const data = unwrap(await adminApi.get(`/v1/admin/users?${qs(params)}`))
    return normalizePage(data)
  },
  get: async (id) => unwrap(await adminApi.get(`/v1/admin/users/${id}`)),
  activity: async (id) => unwrap(await adminApi.get(`/v1/admin/users/${id}/activity`)),
  suspend: async (id) => unwrap(await adminApi.patch(`/v1/admin/users/${id}/suspend`)),
  activate: async (id) => unwrap(await adminApi.patch(`/v1/admin/users/${id}/activate`)),
  verify: async (id) => unwrap(await adminApi.patch(`/v1/admin/users/${id}/verify`)),
  deactivate: async (id) => unwrap(await adminApi.patch(`/v1/admin/users/${id}/deactivate`)),
  filterOptions: async () => unwrap(await adminApi.get('/v1/admin/users/filter-options')),
}

export const adminCommunityService = {
  list: async (params = {}) => {
    const data = unwrap(await adminApi.get(`/v1/admin/communities?${qs(params)}`))
    return normalizePage(data)
  },
  get: async (id) => unwrap(await adminApi.get(`/v1/admin/communities/${id}`)),
  create: async (payload) => unwrap(await adminApi.post('/v1/admin/communities', payload)),
  update: async (id, payload) => unwrap(await adminApi.put(`/v1/admin/communities/${id}`, payload)),
  setActive: async (id, isActive) =>
    unwrap(await adminApi.patch(`/v1/admin/communities/${id}/active`, null, { params: { isActive } })),
  remove: async (id) => unwrap(await adminApi.delete(`/v1/admin/communities/${id}`)),
  members: async (id) => unwrap(await adminApi.get(`/v1/admin/communities/${id}/members`)),
  stats: async () => unwrap(await adminApi.get('/v1/admin/communities/stats')),
}

export const adminPostService = {
  list: async (communityId) =>
    unwrap(await adminApi.get('/v1/admin/posts', { params: { communityId } })),
  get: async (id) => unwrap(await adminApi.get(`/v1/admin/posts/${id}`)),
  flagged: async () => unwrap(await adminApi.get('/v1/admin/posts/flagged')),
  remove: async (id) => unwrap(await adminApi.delete(`/v1/admin/posts/${id}`)),
}

export const adminModerationService = {
  reports: async ({ status = 'ALL', category = 'ALL' } = {}) =>
    unwrap(await adminApi.get('/v1/admin/moderation/reports', { params: { status, category } })),
  report: async (id) => unwrap(await adminApi.get(`/v1/admin/moderation/reports/${id}`)),
  resolve: async (id, payload) =>
    unwrap(await adminApi.patch(`/v1/admin/moderation/reports/${id}/resolve`, payload)),
  dismiss: async (id, payload) =>
    unwrap(await adminApi.patch(`/v1/admin/moderation/reports/${id}/dismiss`, payload)),
  history: async () => unwrap(await adminApi.get('/v1/admin/moderation/history')),
}

export const adminEventService = {
  list: async () => unwrap(await adminApi.get('/v1/admin/events')),
  get: async (id) => unwrap(await adminApi.get(`/v1/admin/events/${id}`)),
  create: async (payload) => unwrap(await adminApi.post('/v1/admin/events', payload)),
  update: async (id, payload) => unwrap(await adminApi.put(`/v1/admin/events/${id}`, payload)),
  remove: async (id) => unwrap(await adminApi.delete(`/v1/admin/events/${id}`)),
  participants: async (id) => unwrap(await adminApi.get(`/v1/admin/events/${id}/participants`)),
}

export const adminReportService = adminModerationService

export const adminNotificationService = {
  list: async () => unwrap(await adminApi.get('/v1/admin/notifications')),
  broadcast: async (payload) =>
    unwrap(await adminApi.post('/v1/admin/notifications/broadcast', payload)),
  history: async () => unwrap(await adminApi.get('/v1/admin/notifications/history')),
}

export const adminLanguageService = {
  list: async () => unwrap(await adminApi.get('/v1/admin/languages')),
  create: async (payload) => unwrap(await adminApi.post('/v1/admin/languages', payload)),
  update: async (id, payload) => unwrap(await adminApi.put(`/v1/admin/languages/${id}`, payload)),
  setActive: async (id, isActive) =>
    unwrap(await adminApi.patch(`/v1/admin/languages/${id}/active`, null, { params: { isActive } })),
  stats: async () => unwrap(await adminApi.get('/v1/admin/languages/stats')),
}

export const adminLocationService = {
  cities: async () => unwrap(await adminApi.get('/v1/admin/locations/cities')),
  localities: async (cityId) =>
    unwrap(await adminApi.get('/v1/admin/locations/localities', { params: { cityId } })),
  createLocality: async (payload) =>
    unwrap(await adminApi.post('/v1/admin/locations/localities', payload)),
  updateLocality: async (id, payload) =>
    unwrap(await adminApi.patch(`/v1/admin/locations/localities/${id}`, payload)),
  stats: async () => unwrap(await adminApi.get('/v1/admin/locations/stats')),
}

export const adminConnectionService = {
  list: async ({ page = 0, size = 20 } = {}) => {
    const data = unwrap(await adminApi.get('/v1/admin/connections', { params: { page, size } }))
    return normalizePage(data)
  },
  analytics: async () => unwrap(await adminApi.get('/v1/admin/connections/analytics')),
}

export const adminAuditService = {
  // Returns a plain List<AuditLog> — no paging support on the backend.
  list: async () => unwrap(await adminApi.get('/v1/admin/audit-logs')),
}

export const adminAnalyticsService = {
  users: async () => unwrap(await adminApi.get('/v1/admin/analytics/users')),
  languages: async () => unwrap(await adminApi.get('/v1/admin/analytics/languages')),
  locations: async () => unwrap(await adminApi.get('/v1/admin/analytics/locations')),
  engagement: async () => unwrap(await adminApi.get('/v1/admin/analytics/engagement')),
}

export const adminSettingsService = {
  get: async () => unwrap(await adminApi.get('/v1/admin/settings')),
  update: async (payload) => unwrap(await adminApi.put('/v1/admin/settings', payload)),
}

export const adminManagementService = {
  list: async () => unwrap(await adminApi.get('/v1/admin/administrators')),
  create: async (payload) => unwrap(await adminApi.post('/v1/admin/administrators', payload)),
  setRole: async (id, role) =>
    unwrap(await adminApi.patch(`/v1/admin/administrators/${id}/role`, { role })),
  setStatus: async (id, status) =>
    unwrap(await adminApi.patch(`/v1/admin/administrators/${id}/status`, { status })),
}
