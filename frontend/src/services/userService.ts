import usersSeed from '@/data/users.json'
import languagesSeed from '@/data/languages.json'
import type { User, UserProfile, UserSummary } from '@/types/user.types'
import type { Language } from '@/types/language.types'
import { clone } from '@/utils/helpers'
import { calculateDistanceKm, type Coordinates } from '@/utils/distanceCalculator'
import { mockResponse } from './api'

/**
 * In-memory store seeded from `src/data/users.json`.
 * Mutations live for the browser session only — no backend required.
 */
const store: { users: User[] } = {
  users: clone(usersSeed) as unknown as User[],
}

export const languages: Language[] = languagesSeed as unknown as Language[]

export function languageById(id: number | null | undefined): Language | undefined {
  if (id === null || id === undefined) return undefined
  return languages.find((language) => language.id === id)
}

/* ------------------------------------------------------------------ *
 * Store accessors used by other mock services (auth, connections...). *
 * ------------------------------------------------------------------ */

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase()
  return store.users.find((user) => user.email.toLowerCase() === normalized)
}

export function findUserById(id: number): User | undefined {
  return store.users.find((user) => user.id === id)
}

export function insertUser(user: User): User {
  store.users.push(user)
  return user
}

export function patchUserProfile(id: number, patch: Partial<UserProfile>): User | undefined {
  const user = findUserById(id)
  if (!user) return undefined
  user.profile = { ...user.profile, ...patch }
  return user
}

export function allUsers(): User[] {
  return store.users
}

/* ------------------------------------------------------------------ *
 * Mapping helpers                                                     *
 * ------------------------------------------------------------------ */

export function fullName(user: User): string {
  return `${user.profile.firstName} ${user.profile.lastName}`.trim()
}

export function languageNamesOf(user: User): string[] {
  return user.profile.languages
    .map((entry) => languageById(entry.languageId)?.name)
    .filter((name): name is string => Boolean(name))
}

export interface SummaryOptions {
  from?: Coordinates
  matchScore?: number
}

/** Flattens a `User` into the compact shape used by cards and lists. */
export function toUserSummary(user: User, options: SummaryOptions = {}): UserSummary {
  const { profile } = user
  const distanceKm =
    options.from && profile.latitude !== undefined && profile.longitude !== undefined
      ? calculateDistanceKm(options.from, {
          latitude: profile.latitude,
          longitude: profile.longitude,
        })
      : undefined

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
    languageIds: profile.languages.map((entry) => entry.languageId),
    distanceKm,
    matchScore: options.matchScore,
  }
}

/* ------------------------------------------------------------------ *
 * Mock REST API                                                       *
 * ------------------------------------------------------------------ */

export const userService = {
  async getUsers(): Promise<User[]> {
    return mockResponse(store.users)
  },

  async getUserById(id: number): Promise<User> {
    const user = findUserById(id)
    if (!user) throw new Error(`User ${id} not found`)
    return mockResponse(user)
  },

  async getSummaries(from?: Coordinates): Promise<UserSummary[]> {
    return mockResponse(store.users.map((user) => toUserSummary(user, { from })))
  },

  async updateProfile(id: number, patch: Partial<UserProfile>): Promise<User> {
    const user = patchUserProfile(id, patch)
    if (!user) throw new Error(`User ${id} not found`)
    return mockResponse(user)
  },

  async completeOnboarding(id: number, patch: Partial<UserProfile>): Promise<User> {
    const user = patchUserProfile(id, { ...patch, onboardingCompleted: true })
    if (!user) throw new Error(`User ${id} not found`)
    return mockResponse(user)
  },
}
