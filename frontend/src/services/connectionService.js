import { request } from './api';

/**
 * Connection store backed by `/v1/connections`.
 *
 * `statusBetween` / `connectedUserIds` are synchronous helpers used during
 * render, so every list call also refreshes a module-level cache that the
 * sync helpers read. Mutations update the cache optimistically.
 */
let cache = [];

function toConnection(dto) {
  return {
    id: Number(dto.id),
    requesterId: Number(dto.requesterId),
    receiverId: Number(dto.receiverId),
    requesterName: dto.requesterName,
    receiverName: dto.receiverName,
    status: dto.status,
    matchScore: dto.matchScore !== null && dto.matchScore !== undefined ? Number(dto.matchScore) : 0,
    matchedBy: dto.matchedBy ?? 'LOCATION',
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt
  };
}

function remember(connections) {
  const mapped = connections.map(toConnection);
  const byId = new Map(cache.map(row => [row.id, row]));
  mapped.forEach(row => byId.set(row.id, row));
  cache = [...byId.values()];
  return mapped;
}

async function fetchPage(path) {
  const page = await request(path);
  return (page?.content ?? []).map(toConnection);
}

/** All connections visible to the current user: pending (both directions) + accepted. */
async function fetchAll() {
  const [pending, accepted] = await Promise.all([
    fetchPage('/v1/connections?status=PENDING&size=100'),
    fetchPage('/v1/connections?status=ACCEPTED&size=100')
  ]);
  const merged = new Map();
  [...pending, ...accepted].forEach(row => merged.set(row.id, row));
  cache = [...merged.values()];
  return cache;
}

export const connectionService = {
  async getForUser(userId) {
    return fetchAll();
  },

  async getReceivedRequests(userId) {
    const rows = await fetchPage('/v1/connections/pending?size=100');
    remember(rows);
    return rows;
  },

  async getSentRequests(userId) {
    const rows = await fetchPage('/v1/connections/sent?size=100');
    remember(rows);
    return rows;
  },

  async getAccepted(userId) {
    const rows = await fetchPage('/v1/connections?status=ACCEPTED&size=100');
    remember(rows);
    return rows;
  },

  async sendRequest(requesterId, receiverId, matchScore, matchedBy) {
    const created = toConnection(
      await request('/v1/connections/request', {
        method: 'POST',
        body: { receiverId: Number(receiverId) }
      })
    );
    // The API does not accept matchScore/matchedBy — keep them for display.
    created.matchScore = matchScore ?? created.matchScore;
    created.matchedBy = matchedBy ?? created.matchedBy;
    remember([created]);
    return created;
  },

  async updateStatus(connectionId, status) {
    const verb = status === 'ACCEPTED' ? 'accept' : status === 'REJECTED' ? 'reject' : null;
    if (!verb) throw new Error(`Unsupported connection status: ${status}`);
    const updated = toConnection(
      await request(`/v1/connections/${connectionId}/${verb}`, { method: 'POST' })
    );
    remember([updated]);
    return updated;
  },

  async acceptRequest(connectionId) {
    return this.updateStatus(connectionId, 'ACCEPTED');
  },

  async rejectRequest(connectionId) {
    return this.updateStatus(connectionId, 'REJECTED');
  },

  async cancelRequest(connectionId) {
    await request(`/v1/connections/${connectionId}/cancel`, { method: 'DELETE' });
    cache = cache.filter(row => row.id !== Number(connectionId));
  },

  async removeConnection(connectionId) {
    await request(`/v1/connections/${connectionId}`, { method: 'DELETE' });
    cache = cache.filter(row => row.id !== Number(connectionId));
  },

  /** Synchronous helper used by the connection context for badge states. */
  statusBetween(userA, userB) {
    const a = Number(userA);
    const b = Number(userB);
    return cache.find(
      connection =>
        (connection.requesterId === a && connection.receiverId === b) ||
        (connection.requesterId === b && connection.receiverId === a)
    );
  },

  connectedUserIds(userId) {
    const id = Number(userId);
    return cache
      .filter(
        connection =>
          connection.status === 'ACCEPTED' &&
          (connection.requesterId === id || connection.receiverId === id)
      )
      .map(connection => (connection.requesterId === id ? connection.receiverId : connection.requesterId));
  }
};
