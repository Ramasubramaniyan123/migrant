import { useCallback, useEffect, useState } from 'react'
import { moderationService } from '@/services/moderationService'
import type { ReportListParams } from '@/services/moderationService'
import type { Report } from '@/types/moderation.types'

export function useModerationReports(params: ReportListParams = {}) {
  const [result, setResult] = useState<{ items: Report[]; total: number }>({ items: [], total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paramsKey = JSON.stringify(params)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await moderationService.listReports(JSON.parse(paramsKey) as ReportListParams)
      setResult({ items: res.items, total: res.total })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }, [paramsKey])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { reports: result.items, total: result.total, isLoading, error, refresh }
}
