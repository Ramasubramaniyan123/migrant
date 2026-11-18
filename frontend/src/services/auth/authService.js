import api from '../api/axiosInstance'
import { unwrap } from '../api/apiClient'

export const authService = {
  login: async ({ email, password }) =>
    unwrap(await api.post('/v1/auth/login', { email, password })),

  register: async ({ email, password, confirmPassword }) =>
    unwrap(await api.post('/v1/auth/register', { email, password, confirmPassword })),

  logout: async () => unwrap(await api.post('/v1/auth/logout')),

  refresh: async (refreshToken) =>
    unwrap(await api.post('/v1/auth/refresh', { refreshToken })),

  me: async () => unwrap(await api.get('/v1/auth/me')),

  verifyEmail: async (token) =>
    unwrap(await api.get('/v1/auth/verify-email', { params: { token } })),

  resendVerification: async (email) =>
    unwrap(await api.post('/v1/auth/resend-verification', null, { params: { email } })),

  forgotPassword: async (email) =>
    unwrap(await api.post('/v1/auth/forgot-password', { email })),

  resetPassword: async ({ token, newPassword }) =>
    unwrap(await api.post('/v1/auth/reset-password', { token, newPassword })),

  googleLogin: async (idToken) =>
    unwrap(await api.post('/v1/oauth/google', { idToken })),
}
