import { MOCK_CITIES, MOCK_LOCALITIES } from '@/data/mockLocations';
import { clone } from '@/utils/helpers';
import { mockRequest, MockStore } from './api';
const cityStore = new MockStore('admin_portal_cities', () => clone(MOCK_CITIES));
const localityStore = new MockStore('admin_portal_localities', () => clone(MOCK_LOCALITIES));
export const locationService = {
  async listCities() {
    return mockRequest(() => cityStore.all(), 250);
  },
  async listLocalities(cityId) {
    return mockRequest(() => cityId ? localityStore.findMany(l => l.cityId === cityId) : localityStore.all(), 250);
  },
  async createLocality(payload) {
    return mockRequest(() => {
      const city = cityStore.find(payload.cityId);
      if (!city) throw new Error('City not found');
      const created = localityStore.create({
        name: payload.name.trim(),
        cityId: city.id,
        cityName: city.name,
        userCount: 0
      });
      cityStore.update(city.id, {
        localityCount: city.localityCount + 1
      });
      return created;
    }, 400);
  },
  async updateLocality(id, patch) {
    return mockRequest(() => localityStore.update(id, patch), 300);
  },
  async getStats() {
    return mockRequest(() => {
      const cities = cityStore.all();
      const localities = localityStore.all();
      return {
        totalCities: cities.length,
        totalLocalities: localities.length,
        usersInTrackedLocations: cities.reduce((s, c) => s + c.userCount, 0)
      };
    }, 250);
  }
};
