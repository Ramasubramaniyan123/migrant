import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { connectionService } from '../../services/connections/connectionService'
import { messagingService } from '../../services/messaging/messagingService'
import { useAuth } from '../../contexts'
import { errorMessage } from '../../services/api/apiClient'
import { Avatar } from '../../components/ui/Avatar'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'

export const Connections = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const myId = user?.id
  const [tab, setTab] = useState('pending')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const otherParty = (c) =>
    String(c.requesterId) === String(myId)
      ? { id: c.receiverId, name: c.receiverName }
      : { id: c.requesterId, name: c.requesterName }

  const load = useCallback(async (t = tab) => {
    setLoading(true)
    setError('')
    try {
      const fetcher =
        t === 'pending' ? connectionService.pending
        : t === 'sent' ? connectionService.sent
        : () => connectionService.list({ status: 'ACCEPTED', size: 50 })
      const result = await fetcher({ size: 50 })
      setItems(result.items || [])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  const act = async (fn, id) => {
    setBusyId(id)
    try {
      await fn(id)
      await load()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const message = async (userId) => {
    try {
      await messagingService.createConversation(userId)
      navigate('/app/messages')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Connections" description="Manage your network of friends and acquaintances." />

      <div className="mb-6 flex gap-2" role="tablist">
        {[
          ['pending', 'Pending requests'],
          ['accepted', 'My connections'],
          ['sent', 'Sent requests'],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={`chip ${tab === key ? 'chip-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : items.length === 0 ? (
        <EmptyState
          title={tab === 'pending' ? 'No pending requests' : tab === 'sent' ? 'No sent requests' : 'No connections yet'}
          description="Discover people to start connecting."
          action={<Link to="/app/discover" className="btn-accent btn-sm">Discover people</Link>}
        />
      ) : (
        <div className="card divide-y divide-line">
          {items.map((c) => {
            const other = otherParty(c)
            return (
              <div key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar name={other.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{other.name || 'Member'}</p>
                    <p className="text-xs capitalize text-ink-3">{String(c.status || '').toLowerCase()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {tab === 'pending' && (
                    <>
                      <button type="button" className="btn-accent btn-sm" disabled={busyId === c.id}
                        onClick={() => act(connectionService.accept, c.id)}>Accept</button>
                      <button type="button" className="btn-outline btn-sm" disabled={busyId === c.id}
                        onClick={() => act(connectionService.reject, c.id)}>Decline</button>
                    </>
                  )}
                  {tab === 'accepted' && (
                    <>
                      <button type="button" className="btn-outline btn-sm" onClick={() => message(other.id)}>Message</button>
                      <button type="button" className="btn-outline btn-sm text-danger" disabled={busyId === c.id}
                        onClick={() => act(connectionService.remove, c.id)}>Remove</button>
                    </>
                  )}
                  {tab === 'sent' && (
                    <button type="button" className="btn-outline btn-sm text-danger" disabled={busyId === c.id}
                      onClick={() => act(connectionService.cancel, c.id)}>Cancel</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
