import { STORAGE_KEYS } from '@/utils/constants';
import { ApiError, mockResponse } from './api';
import { findUserByEmail, insertUser, allUsers } from './userService';
/** Demo password accepted for every seeded account. */
export const DEMO_PASSWORD = 'password123';
function createEmptyUser(id, fullName, email) {
  const [firstName, ...rest] = fullName.trim().split(' ');
  return {
    id,
    email: email.trim().toLowerCase(),
    role: 'USER',
    isActive: true,
    isVerified: false,
    createdAt: new Date().toISOString(),
    profile: {
      firstName,
      lastName: rest.join(' '),
      interests: [],
      languages: [],
      privacy: {
        showHometown: true,
        showExactLocation: false,
        allowConnectionRequests: true,
        showOnlineStatus: true
      },
      onboardingCompleted: false
    }
  };
}
function persistSession(session) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.authUser);
    localStorage.removeItem(STORAGE_KEYS.authToken);
    return;
  }
  localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(session.user));
  localStorage.setItem(STORAGE_KEYS.authToken, session.token);
}
function readSession() {
  const raw = localStorage.getItem(STORAGE_KEYS.authUser);
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  if (!raw || !token) return null;
  try {
    return {
      user: JSON.parse(raw),
      token
    };
  } catch {
    return null;
  }
}
export const authService = {
  async login({
    email,
    password
  }) {
    if (password.length < 8) {
      throw new ApiError('Password must be at least 8 characters', 400);
    }
    const user = findUserByEmail(email);
    if (!user) {
      throw new ApiError('No account found for that email address', 404);
    }
    if (password !== DEMO_PASSWORD) {
      throw new ApiError('Incorrect password', 401);
    }
    const session = {
      user,
      token: `mock-token-${user.id}`
    };
    persistSession(session);
    return mockResponse(session);
  },
  async register({
    fullName,
    email,
    password
  }) {
    if (password.length < 8) {
      throw new ApiError('Password must be at least 8 characters', 400);
    }
    if (findUserByEmail(email)) {
      throw new ApiError('An account with that email already exists', 409);
    }
    const nextId = allUsers().reduce((max, user) => Math.max(max, user.id), 0) + 1;
    const user = insertUser(createEmptyUser(nextId, fullName, email));
    const session = {
      user,
      token: `mock-token-${user.id}`
    };
    persistSession(session);
    return mockResponse(session);
  },
  async forgotPassword(email) {
    if (!email.trim()) throw new ApiError('Email is required', 400);
    return mockResponse({
      sent: true
    }, 600);
  },
  async logout() {
    persistSession(null);
    return mockResponse(undefined, 80);
  },
  getCurrentSession() {
    return readSession();
  },
  /** Used by onboarding / profile edits to keep the stored session fresh. */
  updateStoredUser(user) {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    persistSession({
      user,
      token: token ?? `mock-token-${user.id}`
    });
  }
};
