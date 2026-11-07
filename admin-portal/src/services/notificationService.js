import { MOCK_NOTIFICATIONS } from '@/data/mockNotifications';
import { clone } from '@/utils/helpers';
import { mockRequest, MockStore } from './api';
const store = new MockStore('admin_portal_notifications', () => clone(MOCK_NOTIFICATIONS));
function audienceSize(audience) {
  switch (audience) {
    case 'ALL':
      return 4745;
    case 'ACTIVE_USERS':
      return 3980;
    case 'NEW_USERS':
      return 312;
    case 'COMMUNITY_MEMBERS':
      return 2104;
  }
}
export const notificationService = {
  async list() {
    return mockRequest(() => clone(store.all()).sort((a, b) => b.sentAt.localeCompare(a.sentAt)), 300);
  },
  async broadcast(payload, sentBy) {
    return mockRequest(() => {
      return store.create({
        ...payload,
        sentBy,
        sentAt: new Date().toISOString(),
        recipientCount: audienceSize(payload.audience),
        status: 'SENT'
      });
    }, 500);
  },
  async getStats() {
    return mockRequest(() => {
      const all = store.all();
      return {
        totalSent: all.filter(n => n.status === 'SENT').length,
        totalRecipients: all.reduce((s, n) => s + n.recipientCount, 0),
        drafts: all.filter(n => n.status === 'DRAFT').length
      };
    }, 250);
  }
};
