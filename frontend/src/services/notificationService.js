import { request } from './api';

function toNotification(dto, userId) {
  return {
    id: Number(dto.id),
    userId: Number(userId),
    type: dto.type,
    title: dto.title ?? '',
    content: dto.content ?? '',
    relatedId: dto.relatedId ?? undefined,
    isRead: Boolean(dto.read),
    createdAt: dto.createdAt
  };
}

async function fetchPage(path) {
  const page = await request(path);
  return page?.content ?? [];
}

export const notificationService = {
  async getForUser(userId) {
    const rows = await fetchPage('/v1/notifications?size=100');
    return rows
      .map(dto => toNotification(dto, userId))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  },

  async markRead(id) {
    await request(`/v1/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllRead(userId) {
    await request('/v1/notifications/read-all', { method: 'PUT' });
    return notificationService.getForUser(userId);
  },

  /** No bulk-delete endpoint — clears each notification individually. */
  async clear(userId) {
    const rows = await notificationService.getForUser(userId);
    await Promise.all(rows.map(row => request(`/v1/notifications/${row.id}`, { method: 'DELETE' })));
  }
};
