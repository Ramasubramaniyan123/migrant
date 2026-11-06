import { useCallback, useEffect, useState } from 'react'
import type { DiscoveredUser, DiscoveryFilters } from '@/types/connection.types'
import { discoveryService } from '@/services/discoveryService'
import { useAuthContext } from '@/context/AuthContext'

const EMPTY_FILTERS: DiscoveryFilters = {
  sortBy: 'match',
}

/** Filter state + result loading for the Discover and Hometown Match screens. */
export function useDiscovery(initialFilters: DiscoveryFilters = EMPTY_FILTERS) {
  const { user } = useAuthContext()
  const [filters, setFilters] = useState<DiscoveryFilters>(initialFilters)
  const [results, setResults] = useState<DiscoveredUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (nextFilters: DiscoveryFilters) => {
      if (!user) return
      setIsLoading(true)
      setError(null)
      try {
        const { users } = await discoveryService.discoverPeople(user, nextFilters)
        setResults(users)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Unable to load people')
      } finally {
        setIsLoading(false)
      }
    },
    [user],
  )

  useEffect(() => {
    void run(filters)
  }, [filters, run])

  const updateFilter = useCallback(<K extends keyof DiscoveryFilters>(
    key: K,
    value: DiscoveryFilters[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => setFilters(initialFilters), [initialFilters])

  return {
    filters,
    results,
    isLoading,
    error,
    updateFilter,
    setFilters,
    resetFilters,
    reload: () => run(filters),
  }
}
