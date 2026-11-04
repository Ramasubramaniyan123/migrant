import { STORAGE_KEY, SEED_VERSION } from '@/data/constants'
import { createSeedState } from '@/data/seed'
import type { AppState } from '@/types'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedState()
    const parsed = JSON.parse(raw) as AppState
    if (parsed.seedVersion !== SEED_VERSION || !Array.isArray(parsed.users)) {
      return createSeedState()
    }
    return parsed
  } catch {
    return createSeedState()
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY)
  return createSeedState()
}
