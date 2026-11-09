import { api } from './api';

const BASE = '/admin/languages';

/** Language administration — /v1/admin/languages/*. */
export const languageService = {
  async list() {
    return api.get(BASE);
  },

  async create(payload) {
    return api.post(BASE, {
      name: payload.name,
      nativeName: payload.nativeName,
      code: payload.code
    });
  },

  async update(id, patch) {
    return api.put(`${BASE}/${id}`, {
      name: patch.name,
      nativeName: patch.nativeName,
      code: patch.code,
      isActive: patch.isActive
    });
  },

  async setActive(id, isActive) {
    return api.patch(`${BASE}/${id}/active`, null, {
      params: { isActive }
    });
  },

  async getStats() {
    // { total, active, totalUsers }
    return api.get(`${BASE}/stats`);
  }
};
