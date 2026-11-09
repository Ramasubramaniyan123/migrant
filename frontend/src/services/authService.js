import { STORAGE_KEYS } from '@/utils/constants';
import { ApiError, clearSessionStorage, getAccessToken, request, setTokens } from './api';
import { minimalUser, userService } from './userService';

/** Demo password accepted for every seeded account (legacy hint only). */
export const DEMO_PASSWORD = 'password123';

function persistSession({ user, accessToken, refreshToken }) {
  if (!user) {
    clearSessionStorage();
    return;
  }
  localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
  if (accessToken) localStorage.setItem(STORAGE_KEYS.authToken, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.authRefresh, refreshToken);
}

function readSession() {
  const raw = localStorage.getItem(STORAGE_KEYS.authUser);
  const token = getAccessToken();
  const refreshToken = localStorage.getItem(STORAGE_KEYS.authRefresh);
  if (!raw || !token) return null;
  try {
    return {
      user: JSON.parse(raw),
      token,
      refreshToken
    };
  } catch {
    return null;
  }
}

/**
 * Builds the frontend session after login/register.
 * Fetches the full profile; when the account is not yet verified the API
 * rejects every call with 401/403, so a minimal user is kept instead and
 * `verificationRequired` is flagged for the UI.
 */
async function buildSession(auth) {
  setTokens(auth);
  let user;
  let verificationRequired = false;
  try {
    user = await userService.getCurrentUser();
  } catch (cause) {
    const status = cause instanceof ApiError ? cause.status : 0;
    const denied = status === 401 || status === 403;
    user = minimalUser(auth, { verified: denied ? false : null });
    verificationRequired = denied;
  }
  persistSession({ user, accessToken: auth.accessToken, refreshToken: auth.refreshToken });
  return {
    user,
    token: auth.accessToken,
    refreshToken: auth.refreshToken,
    verificationRequired
  };
}

export const authService = {
  async login({ email, password }) {
    const auth = await request('/v1/auth/login', {
      method: 'POST',
      body: { email: email.trim(), password }
    });
    return buildSession(auth);
  },

  async register({ email, password }) {
    const auth = await request('/v1/auth/register', {
      method: 'POST',
      body: { email: email.trim(), password, confirmPassword: password }
    });
    return buildSession(auth);
  },

  async forgotPassword(email) {
    return request('/v1/auth/forgot-password', {
      method: 'POST',
      body: { email: email.trim() }
    });
  },

  async verifyEmail(token) {
    return request(`/v1/auth/verify-email?token=${encodeURIComponent(token)}`);
  },

  async resendVerification(email) {
    return request(`/v1/auth/resend-verification?email=${encodeURIComponent(email.trim())}`, {
      method: 'POST'
    });
  },

  async resetPassword(token, newPassword) {
    return request('/v1/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword }
    });
  },

  async logout() {
    try {
      await request('/v1/auth/logout', { method: 'POST' });
    } catch {
      // Logout is best-effort — the local session is cleared regardless.
    }
    persistSession(null);
  },

  getCurrentSession() {
    return readSession();
  },

  /**
   * Re-fetches the current user from the API. Used on app mount to refresh
   * a stored session (e.g. after email verification) — throws on failure.
   */
  async fetchCurrentUser() {
    const user = await userService.getCurrentUser();
    const session = readSession();
    persistSession({
      user,
      accessToken: session?.token,
      refreshToken: session?.refreshToken
    });
    return user;
  },

  /** Used by onboarding / profile edits to keep the stored session fresh. */
  updateStoredUser(user) {
    const session = readSession();
    persistSession({
      user,
      accessToken: session?.token,
      refreshToken: session?.refreshToken
    });
  }
};
