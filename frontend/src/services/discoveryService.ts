import type { DiscoveredUser, DiscoveryFilters, MatchReason } from '@/types/connection.types'
import type { User } from '@/types/user.types'
import { calculateDistanceKm, type Coordinates } from '@/utils/distanceCalculator'
import { mockResponse } from './api'
import { allUsers, toUserSummary } from './userService'

export interface DiscoverResult {
  users: DiscoveredUser[]
  total: number
}

function coordinatesOf(user: User): Coordinates | undefined {
  const { latitude, longitude } = user.profile
  if (latitude === undefined || longitude === undefined) return undefined
  return { latitude, longitude }
}

function distanceBetween(current: User, candidate: User): number | undefined {
  const from = coordinatesOf(current)
  const to = coordinatesOf(candidate)
  if (!from || !to) return undefined
  return calculateDistanceKm(from, to)
}

function sharesHometown(current: User, candidate: User): boolean {
  return Boolean(
    current.profile.hometownCity &&
      current.profile.hometownCity === candidate.profile.hometownCity,
  )
}

function sharedLanguageIds(current: User, candidate: User): number[] {
  const own = new Set(current.profile.languages.map((entry) => entry.languageId))
  return candidate.profile.languages
    .map((entry) => entry.languageId)
    .filter((id) => own.has(id))
}

function sharedInterests(current: User, candidate: User): string[] {
  const own = new Set(current.profile.interests.map((interest) => interest.toLowerCase()))
  return candidate.profile.interests.filter((interest) => own.has(interest.toLowerCase()))
}

/** Weighted 0-100 score based on hometown, shared languages, distance and interests. */
export function computeMatchScore(
  current: User,
  candidate: User,
  distanceKm: number | undefined,
): number {
  let score = 0

  if (sharesHometown(current, candidate)) score += 30
  else if (
    current.profile.hometownCountry &&
    current.profile.hometownCountry === candidate.profile.hometownCountry
  ) {
    score += 12
  }

  score += Math.min(sharedLanguageIds(current, candidate).length * 12, 25)

  if (distanceKm !== undefined) {
    if (distanceKm < 10) score += 25
    else if (distanceKm < 50) score += 15
    else if (distanceKm < 200) score += 5
  }

  score += Math.min(sharedInterests(current, candidate).length * 7, 20)

  return Math.min(score, 100)
}

/** Picks the strongest reason two users matched, shown as a badge on cards. */
export function primaryMatchReason(current: User, candidate: User): MatchReason {
  if (sharesHometown(current, candidate)) return 'HOMETOWN'
  if (sharedLanguageIds(current, candidate).length > 0) return 'LANGUAGE'
  if (sharedInterests(current, candidate).length > 0) return 'INTERESTS'
  return 'LOCATION'
}

function buildDiscoveredUser(current: User, candidate: User): DiscoveredUser {
  const distanceKm = distanceBetween(current, candidate)
  const summary = toUserSummary(candidate, {
    from: coordinatesOf(current),
    matchScore: computeMatchScore(current, candidate, distanceKm),
  })

  return {
    ...summary,
    matchScore: summary.matchScore ?? 0,
    matchReason: primaryMatchReason(current, candidate),
  }
}

export const discoveryService = {
  async discoverPeople(current: User, filters: DiscoveryFilters = {}): Promise<DiscoverResult> {
    const query = filters.query?.trim().toLowerCase() ?? ''

    const results = allUsers()
      .filter((candidate) => candidate.id !== current.id)
      .map((candidate) => buildDiscoveredUser(current, candidate))
      .filter((candidate) => {
        if (filters.languageId && !candidate.languageIds.includes(filters.languageId)) return false
        if (filters.hometownCity && candidate.hometownCity !== filters.hometownCity) return false
        if (filters.hometownCountry && candidate.hometownCountry !== filters.hometownCountry) {
          return false
        }
        if (
          filters.maxDistanceKm !== undefined &&
          candidate.distanceKm !== undefined &&
          candidate.distanceKm > filters.maxDistanceKm
        ) {
          return false
        }
        if (filters.interests?.length) {
          const own = new Set(candidate.interests.map((interest) => interest.toLowerCase()))
          if (!filters.interests.some((interest) => own.has(interest.toLowerCase()))) return false
        }
        if (query) {
          const haystack = [
            candidate.fullName,
            candidate.hometownCity ?? '',
            candidate.currentCity ?? '',
            candidate.bio ?? '',
            ...candidate.interests,
            ...candidate.languageNames,
          ]
            .join(' ')
            .toLowerCase()
          if (!haystack.includes(query)) return false
        }
        return true
      })
      .sort((a, b) => {
        const sortBy = filters.sortBy ?? 'match'
        if (sortBy === 'distance') {
          return (a.distanceKm ?? Number.MAX_VALUE) - (b.distanceKm ?? Number.MAX_VALUE)
        }
        if (sortBy === 'recent') return b.id - a.id
        return b.matchScore - a.matchScore
      })

    return mockResponse({ users: results, total: results.length })
  },

  async getNearbyPeople(current: User, radiusKm = 25): Promise<DiscoveredUser[]> {
    const results = allUsers()
      .filter((candidate) => candidate.id !== current.id)
      .map((candidate) => buildDiscoveredUser(current, candidate))
      .filter((candidate) => candidate.distanceKm !== undefined && candidate.distanceKm <= radiusKm)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))

    return mockResponse(results)
  },
}
