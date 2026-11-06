import { useCallback, useEffect, useState } from 'react'
import { analyticsService } from '@/services/analyticsService'
import type {
  TimeSeriesPoint,
  LanguageDistribution,
  CityDistribution,
  EngagementMetrics,
} from '@/types/analytics.types'

export function useAnalytics() {
  const [userGrowth, setUserGrowth] = useState<TimeSeriesPoint[]>([])
  const [languages, setLanguages] = useState<LanguageDistribution[]>([])
  const [cities, setCities] = useState<CityDistribution[]>([])
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [growth, lang, city, eng] = await Promise.all([
        analyticsService.getUserGrowth(),
        analyticsService.getLanguageDistribution(),
        analyticsService.getCityDistribution(),
        analyticsService.getEngagement(),
      ])
      setUserGrowth(growth)
      setLanguages(lang)
      setCities(city)
      setEngagement(eng)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { userGrowth, languages, cities, engagement, isLoading, error, refresh }
}
