import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, UserPlus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PersonCard } from '@/components/people/PersonCard'
import { useApp } from '@/store/AppProvider'
import { discoverableUsers, sharedInterests, withDistance } from '@/lib/people'
import { formatDate } from '@/lib/dates'

export function DashboardPage() {
  const { currentUser, state } = useApp()
  if (!currentUser) return null

  const nearby = withDistance(discoverableUsers(state, currentUser), currentUser)
  const languageCircle = nearby.filter(({ user }) => user.motherTongue === currentUser.motherTongue)
  const connections = state.connections.filter(
    (item) => item.status === 'accepted' && (item.fromUserId === currentUser.id || item.toUserId === currentUser.id),
  )
  const pending = state.connections.filter((item) => item.status === 'pending' && item.toUserId === currentUser.id)
  const recentIds = connections.slice(0, 4).map((item) => (item.fromUserId === currentUser.id ? item.toUserId : item.fromUserId))
  const recentPeople = recentIds
    .map((id) => nearby.find((item) => item.user.id === id) ?? { user: state.users.find((user) => user.id === id)!, distance: 0 })
    .filter((item) => item.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Welcome back, {currentUser.name.split(' ')[0]}.</h1>
        <p className="mt-1 flex items-center gap-1 text-muted">
          <MapPin className="h-4 w-4" /> {currentUser.locality}, Gurugram, Haryana
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Nearby people', value: nearby.length, icon: Users },
          { label: 'Pending requests', value: pending.length, icon: UserPlus },
          { label: 'Total connections', value: connections.length, icon: Users },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-3 p-4">
            <stat.icon className="h-5 w-5 text-brand" />
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">People near you</h2>
          <Link to="/app/discover" className="text-sm text-brand">
            See all
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {nearby.slice(0, 3).map(({ user, distance }) => (
            <PersonCard key={user.id} person={user} distance={distance} shared={sharedInterests(currentUser, user)} />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Suggested connections</h2>
          <Link to="/app/hometown" className="text-sm text-brand">
            Hometown matches
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {nearby
            .filter(({ user }) => user.homeState === currentUser.homeState || sharedInterests(currentUser, user).length > 0)
            .slice(0, 3)
            .map(({ user, distance }) => (
              <PersonCard key={user.id} person={user} distance={distance} shared={sharedInterests(currentUser, user)} />
            ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your language community</h2>
        <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="font-semibold">Gurugram {currentUser.motherTongue} Community</p>
            <p className="text-sm text-muted">{languageCircle.length} people nearby speak {currentUser.motherTongue}.</p>
          </div>
          <Link to="/app/communities">
            <Button>Open communities</Button>
          </Link>
        </Card>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent connections</h2>
        {recentPeople.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {recentPeople.map(({ user, distance }) => (
              <PersonCard key={user.id} person={user} distance={distance} shared={sharedInterests(currentUser, user)} layout="list" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No connections yet. Start with Discover.</p>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Upcoming community events</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {state.events.map((event) => {
            const community = state.communities.find((item) => item.id === event.communityId)
            return (
              <Card key={event.id} className="p-4">
                <p className="flex items-center gap-2 text-sm text-brand">
                  <Calendar className="h-4 w-4" /> {formatDate(event.date)}
                </p>
                <p className="mt-1 font-semibold">{event.title}</p>
                <p className="text-sm text-muted">{event.description}</p>
                <p className="mt-2 text-xs text-muted">
                  {community?.name} · {event.locality}
                </p>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
