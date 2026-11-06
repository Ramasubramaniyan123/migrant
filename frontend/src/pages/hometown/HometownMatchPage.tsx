import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DiscoveredUser } from '@/types/connection.types'
import { discoveryService } from '@/services/discoveryService'
import { messageService } from '@/services/messageService'
import { useAuth } from '@/hooks/useAuth'
import { useConnections } from '@/hooks/useConnections'
import { ROUTES } from '@/utils/constants'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import UserCard from '@/components/shared/UserCard'

/** Highlights people who grew up in the same city, then the same country. */
export default function HometownMatchPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { sendRequest, getStatus } = useConnections()

  const [cityMatches, setCityMatches] = useState<DiscoveredUser[]>([])
  const [countryMatches, setCountryMatches] = useState<DiscoveredUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)

  const userId = user?.id
  const hometownCity = user?.profile.hometownCity
  const hometownCountry = user?.profile.hometownCountry

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const [byCity, byCountry] = await Promise.all([
          hometownCity
            ? discoveryService.discoverPeople(user, { hometownCity, sortBy: 'match' })
            : Promise.resolve({ users: [], total: 0 }),
          hometownCountry
            ? discoveryService.discoverPeople(user, { hometownCountry, sortBy: 'match' })
            : Promise.resolve({ users: [], total: 0 }),
        ])
        if (cancelled) return
        setCityMatches(byCity.users)
        setCountryMatches(
          byCountry.users.filter((person) => person.hometownCity !== hometownCity),
        )
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user, hometownCity, hometownCountry])

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

  const renderSection = (title: string, description: string, people: DiscoveredUser[]) => (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="muted mt-1">{description}</p>
      </div>
      {people.length === 0 ? (
        <EmptyState title="Nobody here yet" description="Check back once more members join." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
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
  )

  if (isLoading) {
    return <Loader fullScreen label="Looking for your hometown…" />
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <header className="card">
        <h1 className="page-title">Hometown match</h1>
        <p className="muted mt-1">
          {hometownCity
            ? `People who also grew up in ${[hometownCity, hometownCountry].filter(Boolean).join(', ')}.`
            : 'Add your hometown to your profile to unlock hometown matching.'}
        </p>
      </header>

      {renderSection(
        `From ${hometownCity ?? 'your city'}`,
        'The closest thing to home — start with a familiar reference point.',
        cityMatches,
      )}

      {renderSection(
        `From ${hometownCountry ?? 'your country'}`,
        'Same country, different city — plenty in common to talk about.',
        countryMatches,
      )}
    </div>
  )
}
