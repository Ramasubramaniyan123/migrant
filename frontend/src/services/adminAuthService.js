import { adminApiClient } from './api/apiClient';

const adminAuthService = {
  // Admin login
  login: async (email, password) => {
    const response = await adminApiClient.post('/admin/auth/login', { email, password });
    if (response.data) {
      const { token, admin } = response.data;
      localStorage.setItem('adminAccessToken', token);
      localStorage.setItem('admin', JSON.stringify(admin));
    }
    return response.data;
  },

  // Admin logout
  logout: async () => {
    try {
      await adminApiClient.post('/admin/auth/logout');
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('admin');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await adminApiClient.post('/admin/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await adminApiClient.post('/admin/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminAccessToken');
    return !!token;
  },

  // Get stored admin data
  getAdmin: () => {
    const adminStr = localStorage.getItem('admin');
    return adminStr ? JSON.parse(adminStr) : null;
  },

  // Check if admin has specific role
  hasRole: (role) => {
    const admin = adminAuthService.getAdmin();
    if (!admin || !admin.role) return false;
    
    const roleHierarchy = {
      'SUPER_ADMIN': 5,
      'ADMIN': 4,
      'MODERATOR': 3,
      'ANALYST': 2,
      'SUPPORT': 1,
    };

    return roleHierarchy[admin.role] >= roleHierarchy[role];
  },
};

export default adminAuthService;
