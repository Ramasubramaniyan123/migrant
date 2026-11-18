import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { eventService } from '../../services/events/eventService'
import { errorMessage } from '../../services/api/apiClient'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'
import { formatDateTime } from '../../utils/format'

const statusBadge = (status) => {
  const s = String(status || '').toLowerCase()
  const cls = s === 'completed' ? 'bg-success/10 text-success'
    : s === 'cancelled' ? 'bg-danger/10 text-danger'
    : s === 'ongoing' ? 'bg-info/10 text-info'
    : 'bg-accent-soft text-accent'
  return <span className={`badge ${cls}`}>{status || 'upcoming'}</span>
}

export const Events = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async (p = page) => {
    setLoading(true)
    setError('')
    try {
      const result = await eventService.list({ page: p, size: 12 })
      setItems(result.items || [])
      setTotalPages(result.totalPages || 1)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load(0) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Events" description="Upcoming community activities and gatherings." />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : items.length === 0 ? (
        <EmptyState title="No upcoming events" description="Check back soon — communities will post events here." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((ev) => (
              <Link key={ev.id} to={`/app/events/${ev.id}`} className="card flex flex-col p-5 transition-shadow hover:shadow-lift">
                <div className="mb-3 flex items-center justify-between">
                  <CalendarDays className="h-5 w-5 text-accent" />
                  {statusBadge(ev.status)}
                </div>
                <h3 className="font-display text-lg font-semibold line-clamp-2">{ev.title}</h3>
                <p className="mt-1 text-xs text-ink-3">{ev.communityName}</p>
                <div className="mt-3 space-y-1 text-xs text-ink-2">
                  <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDateTime(ev.startTime)}</p>
                  {ev.location && <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {ev.location}</p>}
                  {ev.maxParticipants != null && (
                    <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {ev.attendingCount ?? 0}/{ev.maxParticipants} attending</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button type="button" className="btn-outline btn-sm" disabled={page === 0} onClick={() => { setPage(page - 1); load(page - 1) }}>Previous</button>
              <span className="text-sm text-ink-2">Page {page + 1} of {totalPages}</span>
              <button type="button" className="btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => { setPage(page + 1); load(page + 1) }}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
