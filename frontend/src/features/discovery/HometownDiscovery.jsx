import { useEffect, useState, useCallback } from 'react'
import { MapPin } from 'lucide-react'
import { discoveryService } from '../../services/discovery/discoveryService'
import { connectionService } from '../../services/connections/connectionService'
import { errorMessage } from '../../services/api/apiClient'
import { PersonCard } from '../../components/ui/PersonCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'

export const HometownDiscovery = () => {
  const [city, setCity] = useState('')
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(null)

  const search = useCallback(async (c) => {
    if (!c.trim()) return
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const page = await discoveryService.byHometown(c.trim(), { size: 24 })
      setPeople(page.items || [])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const connect = async (userId) => {
    setConnecting(userId)
    try {
      await connectionService.sendRequest(userId)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setConnecting(null)
    }
  }

  return (
    <section>
      <header className="mb-6">
        <h2 className="font-display text-2xl font-bold">Hometown discovery</h2>
        <p className="mt-1 text-sm text-ink-2">Find people who share your hometown or region.</p>
      </header>

      <form className="mb-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); search(city) }}>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            className="input pl-9"
            placeholder="Hometown city (e.g. Bangalore)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Hometown city"
          />
        </div>
        <button type="submit" className="btn-outline" disabled={loading || !city.trim()}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      {loading ? (
        <LoadingState />
      ) : !searched ? (
        <EmptyState title="Search by hometown" description="Enter a city name to find people from that region." />
      ) : people.length === 0 ? (
        <EmptyState title="No one found" description={`No members found for "${city}" yet.`} />
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
