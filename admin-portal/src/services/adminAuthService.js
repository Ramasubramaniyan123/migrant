import { MOCK_ADMINS } from '@/data/mockAdmins';
import { clone } from '@/utils/helpers';
import { mockRequest, MockStore } from './api';
const store = new MockStore('admin_portal_admins', () => clone(MOCK_ADMINS));
/** Demo credentials: any admin email + password "admin123". */
export const adminAuthService = {
  async login(payload) {
    return mockRequest(() => {
      const admin = store.findMany(a => a.email.toLowerCase() === payload.email.trim().toLowerCase())[0];
      if (!admin) {
        throw new Error('No administrator account found for this email');
      }
      if (admin.status === 'SUSPENDED') {
        throw new Error('This administrator account has been suspended');
      }
      if (payload.password !== 'admin123') {
        throw new Error('Incorrect password');
      }
      store.update(admin.id, {
        lastLoginAt: new Date().toISOString()
      });
      const token = `demo-token-${admin.id}-${Date.now()}`;
      return {
        admin,
        token
      };
    }, 500);
  },
  async logout() {
    await mockRequest(() => undefined, 150);
  },
  async requestPasswordReset(email) {
    await mockRequest(() => {
      const exists = store.findMany(a => a.email.toLowerCase() === email.trim().toLowerCase()).length > 0;
      if (!exists) {
        // Do not reveal whether the email exists
        return;
      }
      return;
    }, 400);
  },
  async resetPassword(token, newPassword) {
    await mockRequest(() => {
      if (!token || token.length < 10) {
        throw new Error('Invalid or expired reset token');
      }
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
    }, 400);
  },
  async listAdmins() {
    return mockRequest(() => store.all());
  },
  async createAdmin(payload) {
    return mockRequest(() => {
      const exists = store.findMany(a => a.email.toLowerCase() === payload.email.toLowerCase())[0];
      if (exists) throw new Error('An administrator with this email already exists');
      return store.create({
        name: payload.name,
        email: payload.email,
        role: payload.role,
        status: 'INVITED',
        createdAt: new Date().toISOString()
      });
    }, 400);
  },
  async updateAdminRole(id, role) {
    return mockRequest(() => store.update(id, {
      role
    }), 300);
  },
  async updateAdminStatus(id, status) {
    return mockRequest(() => store.update(id, {
      status
    }), 300);
  }
};
