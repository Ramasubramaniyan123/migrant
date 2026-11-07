import usersSeed from '@/data/users.json';
import languagesSeed from '@/data/languages.json';
import { clone } from '@/utils/helpers';
import { calculateDistanceKm } from '@/utils/distanceCalculator';
import { mockResponse } from './api';

/**
 * In-memory store seeded from `src/data/users.json`.
 * Mutations live for the browser session only — no backend required.
 */
const store = {
  users: clone(usersSeed)
};
export const languages = languagesSeed;
export function languageById(id) {
  if (id === null || id === undefined) return undefined;
  return languages.find(language => language.id === id);
}

/* ------------------------------------------------------------------ *
 * Store accessors used by other mock services (auth, connections...). *
 * ------------------------------------------------------------------ */

export function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return store.users.find(user => user.email.toLowerCase() === normalized);
}
export function findUserById(id) {
  return store.users.find(user => user.id === id);
}
export function insertUser(user) {
  store.users.push(user);
  return user;
}
export function patchUserProfile(id, patch) {
  const user = findUserById(id);
  if (!user) return undefined;
  user.profile = {
    ...user.profile,
    ...patch
  };
  return user;
}
export function allUsers() {
  return store.users;
}

/* ------------------------------------------------------------------ *
 * Mapping helpers                                                     *
 * ------------------------------------------------------------------ */

export function fullName(user) {
  return `${user.profile.firstName} ${user.profile.lastName}`.trim();
}
export function languageNamesOf(user) {
  return user.profile.languages.map(entry => languageById(entry.languageId)?.name).filter(name => Boolean(name));
}
/** Flattens a `User` into the compact shape used by cards and lists. */
export function toUserSummary(user, options = {}) {
  const {
    profile
  } = user;
  const distanceKm = options.from && profile.latitude !== undefined && profile.longitude !== undefined ? calculateDistanceKm(options.from, {
    latitude: profile.latitude,
    longitude: profile.longitude
  }) : undefined;
  return {
    id: user.id,
    fullName: fullName(user),
    avatarUrl: profile.avatarUrl,
    hometownCity: profile.privacy.showHometown ? profile.hometownCity : undefined,
    hometownCountry: profile.hometownCountry,
    currentCity: profile.currentCity,
    bio: profile.bio,
    interests: profile.interests,
    languageNames: languageNamesOf(user),
    languageIds: profile.languages.map(entry => entry.languageId),
    distanceKm,
    matchScore: options.matchScore
  };
}

/* ------------------------------------------------------------------ *
 * Mock REST API                                                       *
 * ------------------------------------------------------------------ */

export const userService = {
  async getUsers() {
    return mockResponse(store.users);
  },
  async getUserById(id) {
    const user = findUserById(id);
    if (!user) throw new Error(`User ${id} not found`);
    return mockResponse(user);
  },
  async getSummaries(from) {
    return mockResponse(store.users.map(user => toUserSummary(user, {
      from
    })));
  },
  async updateProfile(id, patch) {
    const user = patchUserProfile(id, patch);
    if (!user) throw new Error(`User ${id} not found`);
    return mockResponse(user);
  },
  async completeOnboarding(id, patch) {
    const user = patchUserProfile(id, {
      ...patch,
      onboardingCompleted: true
    });
    if (!user) throw new Error(`User ${id} not found`);
    return mockResponse(user);
  }
};
