import { distanceKm } from '@/lib/distance'
import type { AppState, User } from '@/types'

export function discoverableUsers(state: AppState, current: User) {
  return state.users.filter((user) => {
    if (user.id === current.id) return false
    if (user.status !== 'active') return false
    if (!user.onboardingComplete) return false
    if (user.privacy.pauseDiscovery) return false
    if (user.privacy.profileVisibility === 'hidden') return false
    const blocked = state.blocked.some(
      (item) =>
        (item.blockerId === current.id && item.blockedId === user.id) ||
        (item.blockerId === user.id && item.blockedId === current.id),
    )
    if (blocked) return false
    if (user.privacy.profileVisibility === 'connections') {
      const connected = state.connections.some(
        (item) =>
          item.status === 'accepted' &&
          ((item.fromUserId === current.id && item.toUserId === user.id) ||
            (item.toUserId === current.id && item.fromUserId === user.id)),
      )
      if (!connected) return false
    }
    return true
  })
}

export function sharedInterests(a: User, b: User) {
  return a.interests.filter((item) => b.interests.includes(item))
}

export function withDistance(users: User[], current: User) {
  return users
    .map((user) => ({ user, distance: distanceKm(current, user) }))
    .sort((a, b) => a.distance - b.distance)
}

export function hometownRank(user: User, current: User) {
  if (user.hometown === current.hometown) return 0
  if (user.district === current.district) return 1
  if (user.homeState === current.homeState) return 2
  return 3
}
