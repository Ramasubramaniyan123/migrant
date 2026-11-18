import { useEffect, useState, useCallback } from 'react'
import { discoveryService } from '../../services/discovery/discoveryService'
import { connectionService } from '../../services/connections/connectionService'
import { errorMessage } from '../../services/api/apiClient'
import { PersonCard } from '../../components/ui/PersonCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'

export const PeopleDiscovery = () => {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ currentCity: '', interest: '' })
  const [connecting, setConnecting] = useState(null)
  const [notice, setNotice] = useState('')

  const load = useCallback(async (f = filters) => {
    setLoading(true)
    setError('')
    try {
      const params = { size: 24 }
      if (f.currentCity.trim()) params.currentCity = f.currentCity.trim()
      if (f.interest.trim()) params.interest = f.interest.trim()
      const page = await discoveryService.suggestions(params)
      setPeople(page.items || [])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const connect = async (userId) => {
    setConnecting(userId)
    setNotice('')
    try {
      await connectionService.sendRequest(userId)
      setNotice('Connection request sent.')
    } catch (err) {
      setNotice(errorMessage(err))
    } finally {
      setConnecting(null)
    }
  }

  return (
    <section>
      <header className="mb-6">
        <h2 className="font-display text-2xl font-bold">Discover people</h2>
        <p className="mt-1 text-sm text-ink-2">Find members near you or who share your interests.</p>
      </header>

      <form
        className="mb-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => { e.preventDefault(); load() }}
      >
        <input
          className="input sm:max-w-xs"
          placeholder="Current city"
          value={filters.currentCity}
          onChange={(e) => setFilters((f) => ({ ...f, currentCity: e.target.value }))}
          aria-label="Filter by current city"
        />
        <input
          className="input sm:max-w-xs"
          placeholder="Interest (e.g. Food, Travel)"
          value={filters.interest}
          onChange={(e) => setFilters((f) => ({ ...f, interest: e.target.value }))}
          aria-label="Filter by interest"
        />
        <button type="submit" className="btn-outline">Search</button>
      </form>

      {notice && <p className="mb-4 text-sm text-success" role="status">{notice}</p>}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : people.length === 0 ? (
        <EmptyState title="No people found" description="Try different filters, or complete your profile to get better matches." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {people.map((p) => (
            <PersonCard
              key={p.userId}
              person={p}
              action={
                <button
                  type="button"
                  className="btn-outline btn-sm w-full"
                  disabled={connecting === p.userId}
                  onClick={() => connect(p.userId)}
                >
                  {connecting === p.userId ? 'Sending…' : 'Connect'}
                </button>
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
