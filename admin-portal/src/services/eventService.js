import { MOCK_EVENTS, MOCK_EVENT_PARTICIPANTS } from '@/data/mockEvents';
import { clone } from '@/utils/helpers';
import { mockRequest, MockStore } from './api';
const store = new MockStore('admin_portal_events', () => clone(MOCK_EVENTS));
const participantStore = new MockStore('admin_portal_event_participants', () => clone(MOCK_EVENT_PARTICIPANTS));
export const eventService = {
  async list(params = {}) {
    return mockRequest(() => {
      const {
        status = 'ALL',
        city = 'ALL',
        search = ''
      } = params;
      let items = store.all();
      if (status !== 'ALL') items = items.filter(e => e.status === status);
      if (city !== 'ALL') items = items.filter(e => e.city === city);
      const q = search.trim().toLowerCase();
      if (q) items = items.filter(e => e.title.toLowerCase().includes(q) || e.communityName.toLowerCase().includes(q));
      items.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
      return clone(items);
    }, 350);
  },
  async getById(id) {
    return mockRequest(() => clone(store.find(id)), 250);
  },
  async create(payload) {
    return mockRequest(() => {
      const now = new Date();
      const startsAt = new Date(payload.startsAt);
      const status = startsAt < now ? 'ONGOING' : 'UPCOMING';
      return store.create({
        ...payload,
        status,
        participantCount: 0,
        createdAt: new Date().toISOString()
      });
    }, 400);
  },
  async update(id, patch) {
    return mockRequest(() => store.update(id, patch), 350);
  },
  async cancel(id) {
    return mockRequest(() => store.update(id, {
      status: 'CANCELLED'
    }), 350);
  },
  async listParticipants(eventId) {
    return mockRequest(() => clone(participantStore.findMany(p => p.eventId === eventId)), 300);
  },
  async getStats() {
    return mockRequest(() => {
      const all = store.all();
      return {
        total: all.length,
        upcoming: all.filter(e => e.status === 'UPCOMING').length,
        ongoing: all.filter(e => e.status === 'ONGOING').length,
        totalParticipants: all.reduce((s, e) => s + e.participantCount, 0)
      };
    }, 250);
  }
};
