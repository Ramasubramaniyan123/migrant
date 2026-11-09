import { api } from './api';

const BASE = '/admin/settings';

/**
 * Platform settings — /v1/admin/settings (GET/PUT key-value map, ADMIN+).
 */
export const settingsService = {
  async getSettings() {
    return api.get(BASE);
  },

  async updateSettings(patch) {
    return api.put(BASE, patch);
  }
};
