import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UsersRound, CalendarDays, MessageSquare, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts'
import { communityService } from '../../services/communities/communityService'
import { connectionService } from '../../services/connections/connectionService'
import { notificationService } from '../../services/notifications/notificationService'
import { eventService } from '../../services/events/eventService'
import { discoveryService } from '../../services/discovery/discoveryService'
import { Avatar } from '../../components/ui/Avatar'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'
import { errorMessage } from '../../services/api/apiClient'

export const Home = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [communities, connCount, unread, upcoming, people] = await Promise.all([
          communityService.mine({ size: 1 }),
          connectionService.count().catch(() => null),
          notificationService.unreadCount().catch(() => null),
          eventService.list({ size: 3 }).catch(() => ({ items: [] })),
          discoveryService.suggestions({ size: 4 }).catch(() => ({ items: [] })),
        ])
        if (cancelled) return
        setStats({
          communities: communities?.total ?? 0,
          connections: typeof connCount === 'number' ? connCount : connCount?.count ?? 0,
          unread: typeof unread === 'number' ? unread : unread?.count ?? 0,
        })
        setEvents(upcoming.items || [])
        setSuggestions(people.items || [])
      } catch (err) {
        if (!cancelled) setError(errorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`${greeting()}${user?.email ? `, ${user.email.split('@')[0]}` : ''}`}
        description="Here's what's happening in your community."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={UsersRound} label="Communities" value={stats.communities} to="/app/communities" />
            <StatCard icon={Users} label="Connections" value={stats.connections} to="/app/connections" />
            <StatCard icon={MessageSquare} label="Unread notifications" value={stats.unread} to="/app/notifications" />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <section className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">People to discover</h2>
                <Link to="/app/discover" className="link flex items-center gap-1 text-sm">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {suggestions.length === 0 ? (
                <EmptyState title="No suggestions yet" description="Complete your profile to get better matches." />
              ) : (
                <ul className="divide-y divide-line">
                  {suggestions.map((p) => (
                    <li key={p.userId} className="flex items-center gap-3 py-3">
                      <Avatar name={p.displayName} src={p.avatarUrl} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.displayName || 'Community member'}</p>
                        <p className="truncate text-xs text-ink-3">
                          {[p.currentCity, p.hometownCity, p.matchReason].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <Link to="/app/discover" className="btn-outline btn-sm">View</Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Upcoming events</h2>
                <Link to="/app/events" className="link flex items-center gap-1 text-sm">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {events.length === 0 ? (
                <EmptyState title="No upcoming events" description="Events from your communities will appear here." />
              ) : (
                <ul className="divide-y divide-line">
                  {events.map((ev) => (
                    <li key={ev.id} className="flex items-start gap-3 py-3">
                      <CalendarDays className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                      <div className="min-w-0 flex-1">
                        <Link to={`/app/events/${ev.id}`} className="text-sm font-medium hover:text-accent">
                          {ev.title}
                        </Link>
                        <p className="text-xs text-ink-3">
                          {ev.communityName} · {ev.startTime ? new Date(ev.startTime).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, to }) => (
  <Link to={to} className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-lift">
    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
      <Icon className="h-5 w-5" />
    </span>
    <span>
      <span className="block font-display text-2xl font-bold">{value}</span>
      <span className="text-xs text-ink-2">{label}</span>
    </span>
  </Link>
)
