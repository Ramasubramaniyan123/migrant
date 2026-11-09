import { api, ApiError } from './api';

const ADMIN_PATH = '/admin';

/**
 * Admin authentication & administrator management.
 * Backed by /v1/admin/auth/* and /v1/admin/administrators (SUPER_ADMIN only
 * for management endpoints — the server enforces the role).
 */
export const adminAuthService = {
  async login(payload) {
    // Returns { admin, token } — the raw AdminLoginResponse body.
    const result = await api.post(`${ADMIN_PATH}/auth/login`, {
      email: payload.email,
      password: payload.password
    });
    return { admin: result.admin, token: result.token };
  },

  async logout() {
    // Best-effort server-side token revocation; session cleanup happens in
    // the auth context regardless of the outcome.
    try {
      await api.post(`${ADMIN_PATH}/auth/logout`);
    } catch {
      // Token may already be expired/revoked — ignore.
    }
  },

  async requestPasswordReset(email) {
    // Always resolves silently — the backend never reveals whether the email exists.
    await api.post(`${ADMIN_PATH}/auth/forgot-password`, { email });
  },

  async resetPassword(token, newPassword) {
    if (!token) throw new ApiError('Reset token is required', 400);
    if (typeof newPassword !== 'string' || newPassword.length < 12) {
      throw new ApiError('Password must be at least 12 characters', 400);
    }
    await api.post(`${ADMIN_PATH}/auth/reset-password`, { token, newPassword });
  },

  async listAdmins() {
    return api.get(`${ADMIN_PATH}/administrators`);
  },

  async createAdmin(payload) {
    return api.post(`${ADMIN_PATH}/administrators`, {
      name: payload.name,
      email: payload.email,
      role: payload.role
    });
  },

  async updateAdminRole(id, role) {
    return api.patch(`${ADMIN_PATH}/administrators/${id}/role`, { role });
  },

  async updateAdminStatus(id, status) {
    return api.patch(`${ADMIN_PATH}/administrators/${id}/status`, { status });
  }
};
