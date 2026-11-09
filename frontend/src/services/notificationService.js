import apiClient from './api/apiClient';

const notificationService = {
  // Get all notifications
  getNotifications: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/notifications?${params.toString()}`);
    return response.data;
  },

  // Get unread notifications
  getUnreadNotifications: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/notifications/unread?${params.toString()}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread/count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

export default notificationService;
