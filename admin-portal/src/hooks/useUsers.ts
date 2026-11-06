import { useCallback, useEffect, useState } from 'react'
import { userService } from '@/services/userService'
import type { UserListParams, UserListResult } from '@/services/userService'
import type { PlatformUser } from '@/types/user.types'

export function useUsers(params: UserListParams = {}) {
  const [result, setResult] = useState<UserListResult>({ items: [], total: 0, page: 1, pageSize: 10 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const paramsKey = JSON.stringify(params)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setResult(await userService.list(JSON.parse(paramsKey) as UserListParams))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }, [paramsKey])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const suspend = useCallback(
    async (id: string) => {
      const updated = await userService.suspend(id)
      await refresh()
      return updated
    },
    [refresh],
  )

  const activate = useCallback(
    async (id: string) => {
      const updated = await userService.activate(id)
      await refresh()
      return updated
    },
    [refresh],
  )

  return { users: result.items, total: result.total, page: result.page, pageSize: result.pageSize, isLoading, error, refresh, suspend, activate }
}

export type { PlatformUser }
