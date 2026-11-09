import { adminApiClient } from './api/apiClient';

const adminService = {
  // Dashboard
  getDashboardOverview: async () => {
    const response = await adminApiClient.get('/admin/dashboard/overview');
    return response.data;
  },

  getDashboardStatistics: async () => {
    const response = await adminApiClient.get('/admin/dashboard/statistics');
    return response.data;
  },

  // Analytics
  getUserAnalytics: async () => {
    const response = await adminApiClient.get('/admin/analytics/users');
    return response.data;
  },

  getLanguageDistribution: async () => {
    const response = await adminApiClient.get('/admin/analytics/languages');
    return response.data;
  },

  getLocationDistribution: async () => {
    const response = await adminApiClient.get('/admin/analytics/locations');
    return response.data;
  },

  getEngagementMetrics: async () => {
    const response = await adminApiClient.get('/admin/analytics/engagement');
    return response.data;
  },

  // User Management
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.city) params.append('city', filters.city);
    if (filters.language) params.append('language', filters.language);
    params.append('page', filters.page || 0);
    params.append('pageSize', filters.pageSize || 20);

    const response = await adminApiClient.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getUserDetails: async (userId) => {
    const response = await adminApiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  getUserActivity: async (userId) => {
    const response = await adminApiClient.get(`/admin/users/${userId}/activity`);
    return response.data;
  },

  suspendUser: async (userId) => {
    const response = await adminApiClient.patch(`/admin/users/${userId}/suspend`);
    return response.data;
  },

  activateUser: async (userId) => {
    const response = await adminApiClient.patch(`/admin/users/${userId}/activate`);
    return response.data;
  },

  verifyUser: async (userId) => {
    const response = await adminApiClient.patch(`/admin/users/${userId}/verify`);
    return response.data;
  },

  deactivateUser: async (userId) => {
    const response = await adminApiClient.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  getUserFilterOptions: async () => {
    const response = await adminApiClient.get('/admin/users/filter-options');
    return response.data;
  },

  // Community Management
  getCommunities: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.city) params.append('city', filters.city);
    if (filters.status) params.append('status', filters.status);
    params.append('page', filters.page || 0);
    params.append('pageSize', filters.pageSize || 20);

    const response = await adminApiClient.get(`/admin/communities?${params.toString()}`);
    return response.data;
  },

  getCommunityDetails: async (id) => {
    const response = await adminApiClient.get(`/admin/communities/${id}`);
    return response.data;
  },

  createCommunity: async (data) => {
    const response = await adminApiClient.post('/admin/communities', data);
    return response.data;
  },

  updateCommunity: async (id, data) => {
    const response = await adminApiClient.put(`/admin/communities/${id}`, data);
    return response.data;
  },

  setCommunityActive: async (id, isActive) => {
    const response = await adminApiClient.patch(`/admin/communities/${id}/active?isActive=${isActive}`);
    return response.data;
  },

  deleteCommunity: async (id) => {
    const response = await adminApiClient.delete(`/admin/communities/${id}`);
    return response.data;
  },

  getCommunityMembers: async (id) => {
    const response = await adminApiClient.get(`/admin/communities/${id}/members`);
    return response.data;
  },

  getCommunityStats: async () => {
    const response = await adminApiClient.get('/admin/communities/stats');
    return response.data;
  },

  // Moderation
  getReports: async (status = '', category = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);

    const response = await adminApiClient.get(`/admin/moderation/reports?${params.toString()}`);
    return response.data;
  },

  getReportDetails: async (id) => {
    const response = await adminApiClient.get(`/admin/moderation/reports/${id}`);
    return response.data;
  },

  resolveReport: async (id, resolution) => {
    const response = await adminApiClient.patch(`/admin/moderation/reports/${id}/resolve`, { resolution });
    return response.data;
  },

  dismissReport: async (id, reason) => {
    const response = await adminApiClient.patch(`/admin/moderation/reports/${id}/dismiss`, { reason });
    return response.data;
  },

  getModerationHistory: async () => {
    const response = await adminApiClient.get('/admin/moderation/history');
    return response.data;
  },

  // Posts
  getPosts: async (communityId = null) => {
    const params = communityId ? `?communityId=${communityId}` : '';
    const response = await adminApiClient.get(`/admin/posts${params}`);
    return response.data;
  },

  getPost: async (id) => {
    const response = await adminApiClient.get(`/admin/posts/${id}`);
    return response.data;
  },

  getFlaggedPosts: async () => {
    const response = await adminApiClient.get('/admin/posts/flagged');
    return response.data;
  },

  removePost: async (id) => {
    const response = await adminApiClient.delete(`/admin/posts/${id}`);
    return response.data;
  },

  // Events
  getEvents: async () => {
    const response = await adminApiClient.get('/admin/events');
    return response.data;
  },

  getEvent: async (id) => {
    const response = await adminApiClient.get(`/admin/events/${id}`);
    return response.data;
  },

  createEvent: async (data) => {
    const response = await adminApiClient.post('/admin/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await adminApiClient.put(`/admin/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await adminApiClient.delete(`/admin/events/${id}`);
    return response.data;
  },

  getEventParticipants: async (id) => {
    const response = await adminApiClient.get(`/admin/events/${id}/participants`);
    return response.data;
  },

  // Connections
  getConnections: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await adminApiClient.get(`/admin/connections?${params.toString()}`);
    return response.data;
  },

  getConnectionAnalytics: async () => {
    const response = await adminApiClient.get('/admin/connections/analytics');
    return response.data;
  },

  // Languages
  getLanguages: async () => {
    const response = await adminApiClient.get('/admin/languages');
    return response.data;
  },

  createLanguage: async (name, nativeName, code) => {
    const response = await adminApiClient.post('/admin/languages', { name, nativeName, code });
    return response.data;
  },

  updateLanguage: async (id, name, nativeName, code, isActive) => {
    const response = await adminApiClient.put(`/admin/languages/${id}`, { name, nativeName, code, isActive });
    return response.data;
  },

  setLanguageActive: async (id, isActive) => {
    const response = await adminApiClient.patch(`/admin/languages/${id}/active?isActive=${isActive}`);
    return response.data;
  },

  getLanguageStats: async () => {
    const response = await adminApiClient.get('/admin/languages/stats');
    return response.data;
  },

  // Locations
  getCities: async () => {
    const response = await adminApiClient.get('/admin/locations/cities');
    return response.data;
  },

  getLocalities: async (cityId = null) => {
    const params = cityId ? `?cityId=${cityId}` : '';
    const response = await adminApiClient.get(`/admin/locations/localities${params}`);
    return response.data;
  },

  createLocality: async (name, cityId) => {
    const response = await adminApiClient.post('/admin/locations/localities', { name, cityId });
    return response.data;
  },

  updateLocality: async (id, name) => {
    const response = await adminApiClient.patch(`/admin/locations/localities/${id}`, { name });
    return response.data;
  },

  getLocationStats: async () => {
    const response = await adminApiClient.get('/admin/locations/stats');
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await adminApiClient.get('/admin/notifications');
    return response.data;
  },

  broadcastNotification: async (title, body, type, audience) => {
    const response = await adminApiClient.post('/admin/notifications/broadcast', { title, body, type, audience });
    return response.data;
  },

  getNotificationHistory: async () => {
    const response = await adminApiClient.get('/admin/notifications/history');
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await adminApiClient.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await adminApiClient.put('/admin/settings', settings);
    return response.data;
  },

  // Administrators
  getAdministrators: async () => {
    const response = await adminApiClient.get('/admin/administrators');
    return response.data;
  },

  createAdministrator: async (name, email, role) => {
    const response = await adminApiClient.post('/admin/administrators', { name, email, role });
    return response.data;
  },

  updateAdminRole: async (id, role) => {
    const response = await adminApiClient.patch(`/admin/administrators/${id}/role`, { role });
    return response.data;
  },

  updateAdminStatus: async (id, status) => {
    const response = await adminApiClient.patch(`/admin/administrators/${id}/status`, { status });
    return response.data;
  },

  // Audit Logs
  getAuditLogs: async () => {
    const response = await adminApiClient.get('/admin/audit-logs');
    return response.data;
  },
};

export default adminService;
