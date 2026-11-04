import type { User } from '@/types'

export const LOCALITY_OFFSETS: Record<string, { x: number; y: number }> = {
  'Cyber City': { x: 0, y: 0 },
  'DLF Phase 2': { x: 0.35, y: 0.18 },
  'DLF Phase 1': { x: 1.05, y: 0.42 },
  'MG Road': { x: 1.4, y: 0.75 },
  'IFFCO Chowk': { x: 1.7, y: 0.95 },
  'Huda City Centre': { x: 2.15, y: 1.35 },
  'Sector 29': { x: 1.55, y: 1.9 },
  'Sector 14': { x: 2.7, y: 1.15 },
  'Golf Course Road': { x: 2.9, y: 2.1 },
  'Sohna Road': { x: 4.4, y: 2.95 },
  'Udyog Vihar': { x: 0.55, y: -0.7 },
  'Palam Vihar': { x: 4.9, y: -1.4 },
  'South City': { x: 3.4, y: 2.7 },
  'Sector 56': { x: 3.9, y: 1.7 },
  'Sector 45': { x: 3.1, y: 0.95 },
}

function jitter(id: string) {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 1000
  return ((hash % 40) - 20) / 100
}

export function userOffset(user: Pick<User, 'id' | 'locality'>) {
  const base = LOCALITY_OFFSETS[user.locality] ?? { x: 2, y: 2 }
  return { x: base.x + jitter(user.id), y: base.y + jitter(user.id.split('').reverse().join('')) }
}

export function distanceKm(a: Pick<User, 'id' | 'locality'>, b: Pick<User, 'id' | 'locality'>) {
  const from = userOffset(a)
  const to = userOffset(b)
  const dx = from.x - to.x
  const dy = from.y - to.y
  const value = Math.sqrt(dx * dx + dy * dy)
  return Math.max(0.08, Math.round(value * 100) / 100)
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m away`
  return `${km.toFixed(1)} km away`
}
