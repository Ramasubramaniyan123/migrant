import { api } from './api';

const BASE = '/admin/events';

function toPayload(payload) {
  // The backend CommunityEvent record ignores communityName/city (city is
  // derived from the community) and computes nothing else server-side.
  return {
    title: payload.title,
    description: payload.description,
    communityId: payload.communityId,
    location: payload.location,
    startsAt: payload.startsAt,
    endsAt: payload.endsAt,
    capacity: payload.capacity,
    status: payload.status,
    organizerId: payload.organizerId
  };
}

function deriveStatus(payload) {
  if (payload.status) return payload.status;
  if (!payload.startsAt) return undefined;
  return new Date(payload.startsAt) < new Date() ? 'ONGOING' : 'UPCOMING';
}

/** Community event administration — /v1/admin/events/*. */
export const eventService = {
  async list(params = {}) {
    const { status = 'ALL', city = 'ALL', search = '' } = params;
    // Backend returns the full unpaginated list; filtering stays client-side.
    const events = await api.get(BASE);
    const q = search.trim().toLowerCase();
    return events
      .filter(e => (status === 'ALL' || e.status === status)
        && (city === 'ALL' || e.city === city)
        && (!q || (e.title ?? '').toLowerCase().includes(q)
          || (e.communityName ?? '').toLowerCase().includes(q)))
      .sort((a, b) => (a.startsAt ?? '').localeCompare(b.startsAt ?? ''));
  },

  async getById(id) {
    return api.get(`${BASE}/${id}`);
  },

  async create(payload) {
    return api.post(BASE, toPayload({ ...payload, status: deriveStatus(payload) }));
  },

  async update(id, patch) {
    return api.put(`${BASE}/${id}`, toPayload(patch));
  },

  async cancel(id) {
    // No dedicated cancel endpoint — update the status via PUT.
    return api.put(`${BASE}/${id}`, { status: 'CANCELLED' });
  },

  async listParticipants(eventId) {
    return api.get(`${BASE}/${eventId}/participants`);
  },

  async getStats() {
    // No stats endpoint — aggregate the real event list client-side.
    const events = await api.get(BASE);
    return {
      total: events.length,
      upcoming: events.filter(e => e.status === 'UPCOMING').length,
      ongoing: events.filter(e => e.status === 'ONGOING').length,
      totalParticipants: events.reduce((s, e) => s + (e.participantCount ?? 0), 0)
    };
  }
};
