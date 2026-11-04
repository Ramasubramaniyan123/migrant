import { MapPin } from 'lucide-react'
import { PersonCard } from '@/components/people/PersonCard'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApp } from '@/store/AppProvider'
import { discoverableUsers, hometownRank, sharedInterests, withDistance } from '@/lib/people'

export function HometownPage() {
  const { currentUser, state } = useApp()
  if (!currentUser) return null

  const ranked = withDistance(discoverableUsers(state, currentUser), currentUser)
    .map((item) => ({ ...item, rank: hometownRank(item.user, currentUser) }))
    .filter((item) => item.rank < 3)
    .sort((a, b) => a.rank - b.rank || a.distance - b.distance)

  const groups = [
    { title: `People from ${currentUser.hometown}`, rank: 0 },
    { title: `People from ${currentUser.district} district`, rank: 1 },
    { title: `People from other parts of ${currentUser.homeState}`, rank: 2 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand">Hometown match</p>
        <h1 className="text-2xl font-bold">Find people from your hometown</h1>
        <p className="mt-2 max-w-2xl text-muted">
          You are from {currentUser.hometown}, {currentUser.homeState}, now living in {currentUser.locality}, Gurugram. We surface
          people from the same town first, then the same district, then the rest of your home state. Distances stay approximate.
        </p>
      </div>
      <Card className="flex items-center gap-3 p-4">
        <MapPin className="h-5 w-5 text-accent" />
        <p className="text-sm">
          Example: a Tamil speaker from Tenkasi can find people from Tenkasi, Tirunelveli, Madurai and other parts of Tamil Nadu —
          without exposing anyone’s residence.
        </p>
      </Card>
      {ranked.length === 0 ? (
        <EmptyState title="No hometown matches yet" body="As more people from your state join, they will appear here." />
      ) : (
        groups.map((group) => {
          const rows = ranked.filter((item) => item.rank === group.rank)
          if (!rows.length) return null
          return (
            <section key={group.title}>
              <h2 className="mb-3 text-lg font-semibold">{group.title}</h2>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {rows.map(({ user, distance }) => (
                  <PersonCard key={user.id} person={user} distance={distance} shared={sharedInterests(currentUser, user)} />
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
