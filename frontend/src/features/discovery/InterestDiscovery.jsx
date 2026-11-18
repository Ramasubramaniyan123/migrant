import { useEffect, useState, useCallback } from 'react'
import { discoveryService } from '../../services/discovery/discoveryService'
import { connectionService } from '../../services/connections/connectionService'
import { errorMessage } from '../../services/api/apiClient'
import { PersonCard } from '../../components/ui/PersonCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'

const INTERESTS = ['Travel', 'Food', 'Music', 'Sports', 'Art', 'Photography', 'Cooking', 'Fitness', 'Reading', 'Technology']

export const InterestDiscovery = () => {
  const [interest, setInterest] = useState('')
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(null)

  const search = useCallback(async (i) => {
    if (!i) return
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const page = await discoveryService.suggestions({ interest: i, size: 24 })
      setPeople(page.items || [])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (interest) search(interest) }, [interest, search])

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
        <h2 className="font-display text-2xl font-bold">Interest discovery</h2>
        <p className="mt-1 text-sm text-ink-2">Find people who share your hobbies and passions.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {INTERESTS.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInterest(i)}
            aria-pressed={interest === i}
            className={`chip ${interest === i ? 'chip-active' : ''}`}
          >
            {i}
          </button>
        ))}
      </div>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      {loading ? (
        <LoadingState />
      ) : !searched ? (
        <EmptyState title="Pick an interest" description="Select an interest above to find like-minded people." />
      ) : people.length === 0 ? (
        <EmptyState title="No matches" description={`No members found for "${interest}" yet.`} />
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
