import { useCallback, useState } from 'react'

/**
 * Pagination state helper. Returns the slice helpers pages need when the
 * service already paginates server-side (prototype: mock-side).
 */
export function usePagination(initialPageSize = 10) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const reset = useCallback(() => setPage(1), [])

  const goTo = useCallback((p: number) => setPage(Math.max(1, p)), [])

  const next = useCallback(() => setPage((p) => p + 1), [])

  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), [])

  const totalPages = useCallback(
    (total: number) => Math.max(1, Math.ceil(total / pageSize)),
    [pageSize],
  )

  return { page, pageSize, setPageSize, setPage: goTo, reset, next, prev, totalPages }
}
