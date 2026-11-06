import { useCallback, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { languageById } from '@/services/userService'
import { messageService } from '@/services/messageService'
import { useAuth } from '@/hooks/useAuth'
import { useConnections } from '@/hooks/useConnections'
import { useUsers } from '@/hooks/useUsers'
import { PROFICIENCY_LABELS, ROUTES } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'
import Avatar from '@/components/common/Avatar'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import ConnectionButton from '@/components/shared/ConnectionButton'
import LocationBadge from '@/components/shared/LocationBadge'

/** Public profile of another member, with connection and messaging actions. */
export default function UserProfilePage() {
  const { userId: userIdParam } = useParams<{ userId: string }>()
  const profileUserId = Number(userIdParam)
  const { user } = useAuth()
  const { users, isLoading } = useUsers()
  const { isConnected } = useConnections()
  const navigate = useNavigate()
  const [isOpeningChat, setIsOpeningChat] = useState(false)

  const openChat = useCallback(async () => {
    if (!user) return
    setIsOpeningChat(true)
    try {
      const conversation = await messageService.getOrCreateConversation(user.id, profileUserId)
      navigate(`${ROUTES.messages}/${conversation.id}`)
    } finally {
      setIsOpeningChat(false)
    }
  }, [navigate, profileUserId, user])

  if (user && profileUserId === user.id) {
    return <Navigate to={ROUTES.profile} replace />
  }

  if (isLoading) {
    return <Loader label="Loading profile…" />
  }

  const member = users.find((row) => row.id === profileUserId)

  if (!member) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <EmptyState
          title="Member not found"
          description="This profile may have been removed or the link is incorrect."
          action={
            <Link to={ROUTES.discover}>
              <Button variant="secondary">Back to discover</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const { profile } = member
  const name = `${profile.firstName} ${profile.lastName}`.trim()
  const connected = isConnected(member.id)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={name} src={profile.avatarUrl} size="xl" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="page-title">{name}</h1>
                {member.isVerified ? <Badge variant="success">Verified</Badge> : null}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {profile.currentCity ? (
                  <LocationBadge
                    city={profile.currentCity}
                    country={profile.currentCountry}
                    approximate
                  />
                ) : null}
                {profile.privacy.showHometown && profile.hometownCity ? (
                  <span className="text-slate-500">
                    From {[profile.hometownCity, profile.hometownCountry].filter(Boolean).join(', ')}
                  </span>
                ) : null}
              </div>
              {profile.bio ? (
                <p className="max-w-xl text-sm text-slate-600">{profile.bio}</p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <ConnectionButton userId={member.id} size="md" />
            {connected ? (
              <Button
                variant="secondary"
                isLoading={isOpeningChat}
                onClick={() => void openChat()}
              >
                Message
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Languages</h2>
        {profile.languages.length === 0 ? (
          <p className="muted">No languages added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((entry) => {
              const language = languageById(entry.languageId)
              if (!language) return null
              return (
                <span
                  key={entry.languageId}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                >
                  {language.name}
                  <span className="text-xs text-slate-500">
                    {PROFICIENCY_LABELS[entry.proficiency]}
                  </span>
                  {entry.isPrimary ? (
                    <Badge variant="brand" size="sm">
                      Primary
                    </Badge>
                  ) : null}
                </span>
              )
            })}
          </div>
        )}
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Interests</h2>
        {profile.interests.length === 0 ? (
          <p className="muted">No interests added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest} variant="neutral" size="md">
                {interest}
              </Badge>
            ))}
          </div>
        )}
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">About</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Member since</dt>
            <dd className="font-medium text-slate-800">{formatDate(member.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Verification</dt>
            <dd>
              {member.isVerified ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Badge variant="warning">Unverified</Badge>
              )}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
