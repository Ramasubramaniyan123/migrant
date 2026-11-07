import { MOCK_USERS, MOCK_USER_ACTIVITY } from '@/data/mockUsers';
import { clone } from '@/utils/helpers';
import { mockRequest, MockStore } from './api';
const store = new MockStore('admin_portal_users', () => clone(MOCK_USERS));
export const userService = {
  async list(params = {}) {
    return mockRequest(() => {
      const {
        search = '',
        status = 'ALL',
        city = 'ALL',
        language = 'ALL'
      } = params;
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 10;
      let items = store.all();
      const q = search.trim().toLowerCase();
      if (q) {
        items = items.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.hometown.toLowerCase().includes(q));
      }
      if (status !== 'ALL') items = items.filter(u => u.status === status);
      if (city !== 'ALL') items = items.filter(u => u.currentCity === city);
      if (language !== 'ALL') items = items.filter(u => u.motherTongue === language);
      const total = items.length;
      const start = (page - 1) * pageSize;
      return {
        items: items.slice(start, start + pageSize),
        total,
        page,
        pageSize
      };
    }, 400);
  },
  async getById(id) {
    return mockRequest(() => clone(store.find(id)), 250);
  },
  async suspend(id) {
    return mockRequest(() => store.update(id, {
      status: 'SUSPENDED'
    }), 350);
  },
  async activate(id) {
    return mockRequest(() => store.update(id, {
      status: 'ACTIVE'
    }), 350);
  },
  async verify(id) {
    return mockRequest(() => store.update(id, {
      isVerified: true
    }), 350);
  },
  async deactivate(id) {
    return mockRequest(() => store.update(id, {
      status: 'DEACTIVATED'
    }), 350);
  },
  async getActivity(userId) {
    return mockRequest(() => clone(MOCK_USER_ACTIVITY.filter(a => a.userId === userId)), 300);
  },
  async getFilterOptions() {
    return mockRequest(() => {
      const users = store.all();
      return {
        cities: Array.from(new Set(users.map(u => u.currentCity))).sort(),
        languages: Array.from(new Set(users.map(u => u.motherTongue))).sort(),
        statuses: ['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DEACTIVATED']
      };
    }, 200);
  }
};
