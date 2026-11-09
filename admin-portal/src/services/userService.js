import { api } from './api';

const BASE = '/admin/users';

/** Platform user administration — /v1/admin/users/*. */
export const userService = {
  async list(params = {}) {
    const { search = '', status = 'ALL', city = 'ALL', language = 'ALL', page = 1, pageSize = 10 } = params;
    // Backend returns UserListResult { items, total, page, pageSize } — same shape.
    return api.get(BASE, {
      params: { search, status, city, language, page, pageSize }
    });
  },

  async getById(id) {
    return api.get(`${BASE}/${id}`);
  },

  async suspend(id) {
    return api.patch(`${BASE}/${id}/suspend`);
  },

  async activate(id) {
    return api.patch(`${BASE}/${id}/activate`);
  },

  async verify(id) {
    return api.patch(`${BASE}/${id}/verify`);
  },

  async deactivate(id) {
    return api.patch(`${BASE}/${id}/deactivate`);
  },

  async getActivity(userId) {
    return api.get(`${BASE}/${userId}/activity`);
  },

  async getFilterOptions() {
    // { cities: string[], languages: string[], statuses: string[] }
    return api.get(`${BASE}/filter-options`);
  }
};
