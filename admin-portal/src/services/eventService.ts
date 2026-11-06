import type { CommunityEvent, EventParticipant, EventStatus } from '@/types/event.types'
import { MOCK_EVENTS, MOCK_EVENT_PARTICIPANTS } from '@/data/mockEvents'
import { clone } from '@/utils/helpers'
import { mockRequest, MockStore } from './api'

const store = new MockStore<CommunityEvent>('admin_portal_events', () => clone(MOCK_EVENTS))
const participantStore = new MockStore<EventParticipant>(
  'admin_portal_event_participants',
  () => clone(MOCK_EVENT_PARTICIPANTS),
)

export type EventPayload = Omit<CommunityEvent, 'id' | 'participantCount' | 'createdAt' | 'status'>

export const eventService = {
  async list(params: { status?: EventStatus | 'ALL'; city?: string; search?: string } = {}) {
    return mockRequest(() => {
      const { status = 'ALL', city = 'ALL', search = '' } = params
      let items = store.all()
      if (status !== 'ALL') items = items.filter((e) => e.status === status)
      if (city !== 'ALL') items = items.filter((e) => e.city === city)
      const q = search.trim().toLowerCase()
      if (q) items = items.filter((e) => e.title.toLowerCase().includes(q) || e.communityName.toLowerCase().includes(q))
      items.sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      return clone(items)
    }, 350)
  },

  async getById(id: string) {
    return mockRequest(() => clone(store.find(id)), 250)
  },

  async create(payload: EventPayload): Promise<CommunityEvent> {
    return mockRequest(() => {
      const now = new Date()
      const startsAt = new Date(payload.startsAt)
      const status: EventStatus =
        startsAt < now ? 'ONGOING' : 'UPCOMING'
      return store.create({
        ...payload,
        status,
        participantCount: 0,
        createdAt: new Date().toISOString(),
      })
    }, 400)
  },

  async update(id: string, patch: Partial<EventPayload>) {
    return mockRequest(() => store.update(id, patch), 350)
  },

  async cancel(id: string) {
    return mockRequest(() => store.update(id, { status: 'CANCELLED' as EventStatus }), 350)
  },

  async listParticipants(eventId: string) {
    return mockRequest(() => clone(participantStore.findMany((p) => p.eventId === eventId)), 300)
  },

  async getStats() {
    return mockRequest(() => {
      const all = store.all()
      return {
        total: all.length,
        upcoming: all.filter((e) => e.status === 'UPCOMING').length,
        ongoing: all.filter((e) => e.status === 'ONGOING').length,
        totalParticipants: all.reduce((s, e) => s + e.participantCount, 0),
      }
    }, 250)
  },
}
