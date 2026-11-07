import notificationsSeed from '@/data/notifications.json';
import { clone } from '@/utils/helpers';
import { mockResponse } from './api';
let notifications = clone(notificationsSeed);
export const notificationService = {
  async getForUser(userId) {
    const rows = notifications.filter(notification => notification.userId === userId).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return mockResponse(rows);
  },
  async markRead(id) {
    const notification = notifications.find(row => row.id === id);
    if (notification) notification.isRead = true;
    return mockResponse(notification, 60);
  },
  async markAllRead(userId) {
    notifications = notifications.map(notification => notification.userId === userId ? {
      ...notification,
      isRead: true
    } : notification);
    return mockResponse(notifications.filter(row => row.userId === userId), 80);
  },
  async clear(userId) {
    notifications = notifications.filter(notification => notification.userId !== userId);
    return mockResponse(undefined, 80);
  }
};
