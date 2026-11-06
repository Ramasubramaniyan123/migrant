import { useCallback, useEffect, useState } from 'react'
import { dashboardService } from '@/services/dashboardService'
import type { DashboardOverview } from '@/types/analytics.types'

export function useDashboard() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setOverview(await dashboardService.getOverview())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { overview, isLoading, error, refresh }
}
