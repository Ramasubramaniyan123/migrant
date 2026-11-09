import { api } from './api';

const BASE = '/admin/communities';

/** Community administration — /v1/admin/communities/*. */
export const communityService = {
  async list(params = {}) {
    const { search = '', type = 'ALL', city = 'ALL', status = 'ALL', page = 1, pageSize = 10 } = params;
    // Backend returns CommunityListResult { items, total, page, pageSize }.
    return api.get(BASE, {
      params: { search, type, city, status, page, pageSize }
    });
  },

  async getById(id) {
    return api.get(`${BASE}/${id}`);
  },

  async create(payload) {
    return api.post(BASE, payload);
  },

  async update(id, patch) {
    const updated = await api.put(`${BASE}/${id}`, patch);
    // The backend only maps `isActive: true` on update; deactivation requires
    // the dedicated endpoint, so keep the flag in sync explicitly.
    if (patch && typeof patch.isActive === 'boolean') {
      return api.patch(`${BASE}/${id}/active`, null, {
        params: { isActive: patch.isActive }
      }).catch(() => updated);
    }
    return updated;
  },

  async setActive(id, isActive) {
    return api.patch(`${BASE}/${id}/active`, null, {
      params: { isActive }
    });
  },

  async delete(id) {
    await api.delete(`${BASE}/${id}`);
  },

  async listMembers(communityId) {
    return api.get(`${BASE}/${communityId}/members`);
  },

  async getStats() {
    // { total, active, totalMembers, byType }
    return api.get(`${BASE}/stats`);
  }
};
