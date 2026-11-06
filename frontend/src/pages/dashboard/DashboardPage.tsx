import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { DiscoveredUser } from '@/types/connection.types'
import { communityService } from '@/services/communityService'
import { discoveryService } from '@/services/discoveryService'
import { messageService } from '@/services/messageService'
import { useAuth } from '@/hooks/useAuth'
import { useConnections } from '@/hooks/useConnections'
import { useNotificationContext } from '@/context/NotificationContext'
import { NOTIFICATION_LABELS, ROUTES } from '@/utils/constants'
import { formatRelativeTime } from '@/utils/formatters'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import UserCard from '@/components/shared/UserCard'

interface StatCard {
  label: string
  value: number
  to: string
}

/** Signed-in home screen: personal stats, suggested matches and recent activity. */
export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { accepted, incomingCount, sendRequest, getStatus } = useConnections()
  const { notifications, unreadCount } = useNotificationContext()

  const [suggestions, setSuggestions] = useState<DiscoveredUser[]>([])
  const [communityCount, setCommunityCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)

  const userId = user?.id

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const [discovery, memberships] = await Promise.all([
          discoveryService.discoverPeople(user, { sortBy: 'match' }),
          communityService.getMembershipsForUser(user.id),
        ])
        if (cancelled) return
        setSuggestions(discovery.users.slice(0, 3))
        setCommunityCount(memberships.length)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user])

  const handleConnect = useCallback(
    async (target: DiscoveredUser) => {
      setBusyId(target.id)
      try {
        await sendRequest(target.id, target.matchScore, target.matchReason)
      } finally {
        setBusyId(null)
      }
    },
    [sendRequest],
  )

  const handleMessage = useCallback(
    async (target: DiscoveredUser) => {
      if (!userId) return
      const conversation = await messageService.getOrCreateConversation(userId, target.id)
      navigate(`${ROUTES.messages}/${conversation.id}`)
    },
    [navigate, userId],
  )

  const stats: StatCard[] = [
    { label: 'Connections', value: accepted.length, to: ROUTES.connections },
    { label: 'Incoming requests', value: incomingCount, to: ROUTES.connections },
    { label: 'Communities', value: communityCount, to: ROUTES.communities },
    { label: 'Unread alerts', value: unreadCount, to: ROUTES.notifications },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">
            Welcome back{user ? `, ${user.profile.firstName}` : ''}
          </h1>
          <p className="muted mt-1">Here is what is happening in your community today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={ROUTES.discover}>
            <Button>Discover people</Button>
          </Link>
          <Link to={ROUTES.communities}>
            <Button variant="secondary">Browse communities</Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to} className="card transition hover:shadow-md">
            <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="muted mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Suggested for you</h2>
            <Link
              to={ROUTES.discover}
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              See all
            </Link>
          </div>

          {isLoading ? (
            <Loader label="Finding people near you…" />
          ) : suggestions.length === 0 ? (
            <EmptyState
              title="No suggestions yet"
              description="Complete your profile so we can match you with people nearby."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestions.map((person) => (
                <UserCard
                  key={person.id}
                  user={person}
                  matchReason={person.matchReason}
                  connectionStatus={getStatus(person.id)}
                  onSendRequest={() => void handleConnect(person)}
                  onMessage={() => void handleMessage(person)}
                  onViewProfile={() => navigate(ROUTES.userProfile(person.id))}
                  isBusy={busyId === person.id}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
            <Link
              to={ROUTES.notifications}
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              View all
            </Link>
          </div>

          {notifications.length === 0 ? (
            <EmptyState title="Nothing new" description="You are all caught up." />
          ) : (
            <ul className="card divide-y divide-slate-100 p-0">
              {notifications.slice(0, 5).map((notification) => (
                <li key={notification.id} className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                  <p className="muted mt-0.5">
                    {NOTIFICATION_LABELS[notification.type]} ·{' '}
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
