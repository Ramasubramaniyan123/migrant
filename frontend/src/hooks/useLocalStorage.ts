import { useCallback, useEffect, useState } from 'react'

/** Persists a piece of state in `localStorage`, falling back to the initial value. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable (private mode) — state still works in memory.
    }
  }, [key, value])

  const remove = useCallback(() => {
    window.localStorage.removeItem(key)
    setValue(initialValue)
  }, [initialValue, key])

  return [value, setValue, remove] as const
}
