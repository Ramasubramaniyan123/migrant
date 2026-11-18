import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { eventService } from '../../services/events/eventService'
import { errorMessage } from '../../services/api/apiClient'
import { Avatar } from '../../components/ui/Avatar'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'
import { formatDateTime } from '../../utils/format'

export const EventDetails = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [ev, parts] = await Promise.all([
        eventService.get(id),
        eventService.participants(id, { size: 50 }).catch(() => ({ items: [] })),
      ])
      setEvent(ev)
      setParticipants(parts.items || [])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const toggleRegistration = async () => {
    setBusy(true)
    try {
      if (event?.registered) await eventService.unregister(id)
      else await eventService.register(id)
      await load()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <LoadingState />
  if (error && !event) return <ErrorState message={error} onRetry={load} />
  if (!event) return <EmptyState title="Event not found" />

  const full = event.maxParticipants != null && (event.attendingCount ?? 0) >= event.maxParticipants

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={event.title}
        description={event.communityName}
        actions={
          event.status === 'UPCOMING' || event.status === 'ONGOING' ? (
            <button
              type="button"
              className={event.registered ? 'btn-outline' : 'btn-accent'}
              onClick={toggleRegistration}
              disabled={busy || (!event.registered && full)}
            >
              {event.registered ? 'Cancel registration' : full ? 'Event full' : 'Register'}
            </button>
          ) : null
        }
      />

      {event.description && <p className="mb-6 text-ink-2">{event.description}</p>}

      <div className="card mb-6 grid gap-3 p-6 text-sm sm:grid-cols-2">
        <p className="flex items-center gap-2 text-ink-2"><CalendarDays className="h-4 w-4 text-accent" /> {formatDateTime(event.startTime)}</p>
        {event.endTime && <p className="flex items-center gap-2 text-ink-2"><CalendarDays className="h-4 w-4 text-accent" /> until {formatDateTime(event.endTime)}</p>}
        {event.location && <p className="flex items-center gap-2 text-ink-2 sm:col-span-2"><MapPin className="h-4 w-4 text-accent" /> {event.location}</p>}
        {event.maxParticipants != null && (
          <p className="flex items-center gap-2 text-ink-2"><Users className="h-4 w-4 text-accent" /> {event.attendingCount ?? 0} of {event.maxParticipants} attending</p>
        )}
        {event.organizerName && <p className="text-ink-2">Organized by {event.organizerName}</p>}
      </div>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      <section className="card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Participants</h2>
        {participants.length === 0 ? (
          <EmptyState title="No participants yet" description="Be the first to register." />
        ) : (
          <ul className="divide-y divide-line">
            {participants.map((p) => (
              <li key={p.userId} className="flex items-center gap-3 py-3">
                <Avatar name={p.displayName} size="sm" />
                <span className="flex-1 truncate text-sm">{p.displayName || 'Participant'}</span>
                {p.status && <span className="badge bg-surface-alt text-ink-2">{p.status}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-6 text-sm"><Link to="/app/events" className="link">← Back to events</Link></p>
    </div>
  )
}
