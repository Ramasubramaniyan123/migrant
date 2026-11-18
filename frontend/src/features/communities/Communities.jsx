import { useEffect, useState, useCallback } from 'react'
import { communityService } from '../../services/communities/communityService'
import { errorMessage } from '../../services/api/apiClient'
import { CommunityCard } from '../community/CommunityCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'

export const Communities = () => {
  const [communities, setCommunities] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async (p = page, q = query) => {
    setLoading(true)
    setError('')
    try {
      const result = await communityService.list({ query: q || undefined, page: p, size: 12 })
      setCommunities(result.items || [])
      setTotalPages(result.totalPages || 1)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, query])

  useEffect(() => { load(0, query) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Communities" description="Join communities based on shared interests and regional identity." />

      <form
        className="mb-6 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); setPage(0); load(0, query) }}
      >
        <input
          className="input max-w-sm"
          placeholder="Search communities…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search communities"
        />
        <button type="submit" className="btn-outline">Search</button>
      </form>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : communities.length === 0 ? (
        <EmptyState title="No communities found" description="Try a different search, or check back later." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => <CommunityCard key={c.id} community={c} />)}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button type="button" className="btn-outline btn-sm" disabled={page === 0} onClick={() => { setPage(page - 1); load(page - 1) }}>
                Previous
              </button>
              <span className="text-sm text-ink-2">Page {page + 1} of {totalPages}</span>
              <button type="button" className="btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => { setPage(page + 1); load(page + 1) }}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
