export interface Coordinates {
  latitude: number
  longitude: number
}

const EARTH_RADIUS_KM = 6371

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/** Great-circle distance between two coordinates, in kilometres. */
export function calculateDistanceKm(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude)
  const dLng = toRadians(to.longitude - from.longitude)
  const lat1 = toRadians(from.latitude)
  const lat2 = toRadians(to.latitude)

  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

/**
 * Rounds a coordinate so the exact position is never exposed.
 * Roughly ~1 km of deliberate fuzziness.
 */
export function fuzzCoordinates(coords: Coordinates): Coordinates {
  return {
    latitude: Number(coords.latitude.toFixed(2)),
    longitude: Number(coords.longitude.toFixed(2)),
  }
}

/** Maps a 0-100 match score to a Tailwind-friendly bucket. */
export function matchScoreBucket(score: number): 'high' | 'medium' | 'low' {
  if (score >= 75) return 'high'
  if (score >= 45) return 'medium'
  return 'low'
}
