import { api } from './api';

const BASE = '/admin/locations';

/** Location administration — /v1/admin/locations/*. */
export const locationService = {
  async listCities() {
    return api.get(`${BASE}/cities`);
  },

  async listLocalities(cityId) {
    return api.get(`${BASE}/localities`, {
      params: cityId ? { cityId } : undefined
    });
  },

  async createLocality(payload) {
    return api.post(`${BASE}/localities`, {
      name: payload.name,
      cityId: payload.cityId
    });
  },

  async updateLocality(id, patch) {
    return api.patch(`${BASE}/localities/${id}`, {
      name: patch.name
    });
  },

  async getStats() {
    // { totalCities, totalLocalities, usersInTrackedLocations }
    return api.get(`${BASE}/stats`);
  }
};
