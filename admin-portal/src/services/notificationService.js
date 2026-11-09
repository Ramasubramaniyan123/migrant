import { api } from './api';

const BASE = '/admin/notifications';

/** Platform notifications — /v1/admin/notifications/*. */
export const notificationService = {
  async list() {
    // Backend returns all broadcasts sorted by sentAt desc.
    return api.get(BASE);
  },

  async broadcast(payload, sentBy) {
    // `sentBy` is informational only; the backend records the broadcast.
    return api.post(`${BASE}/broadcast`, {
      title: payload.title,
      body: payload.body,
      type: payload.type,
      audience: payload.audience
    });
  },

  async getStats() {
    // No stats endpoint — aggregate the real notification list.
    const all = await api.get(BASE);
    return {
      totalSent: all.filter(n => n.status === 'SENT').length,
      totalRecipients: all.reduce((s, n) => s + (n.recipientCount ?? 0), 0),
      drafts: all.filter(n => n.status === 'DRAFT').length
    };
  }
};
