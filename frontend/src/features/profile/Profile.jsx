import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Pencil } from 'lucide-react'
import { profileService } from '../../services/users/userService'
import { errorMessage } from '../../services/api/apiClient'
import { Avatar } from '../../components/ui/Avatar'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'
import { formatDate } from '../../utils/format'

export const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setProfile(await profileService.details())
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!profile) return null

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email
  const location = [
    profile.privacy?.showCurrentCity !== false ? profile.currentCity : null,
    profile.privacy?.showHometown !== false ? profile.hometownCity : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={name}
        description={profile.email}
        actions={<Link to="/app/settings" className="btn-outline btn-sm"><Pencil className="h-4 w-4" /> Edit profile</Link>}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="card flex flex-col items-center p-6 text-center">
          <Avatar name={name} src={profile.profilePictureUrl} size="xl" />
          <h2 className="mt-4 font-display text-xl font-semibold">{name}</h2>
          {profile.createdAt && <p className="mt-1 text-xs text-ink-3">Member since {formatDate(profile.createdAt)}</p>}
          {location && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-2">
              <MapPin className="h-4 w-4 text-accent" /> {location}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <section className="card p-6">
            <h3 className="mb-3 font-display text-lg font-semibold">About</h3>
            {profile.bio ? (
              <p className="whitespace-pre-line text-sm text-ink-2">{profile.bio}</p>
            ) : (
              <p className="text-sm text-ink-3">No bio yet. <Link to="/app/settings" className="link">Add one</Link></p>
            )}
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="card p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Hometown</h3>
              {profile.hometownCity || profile.hometownCountry ? (
                <p className="text-sm text-ink-2">
                  {[profile.hometownCity, profile.hometownCountry].filter(Boolean).join(', ')}
                </p>
              ) : (
                <p className="text-sm text-ink-3">Not set</p>
              )}
            </section>
            <section className="card p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Languages</h3>
              {profile.languages?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((l) => (
                    <span key={l.languageId} className="chip">
                      {l.name}{l.proficiency ? ` · ${l.proficiency}` : ''}{l.primary ? ' ★' : ''}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-3">No languages added</p>
              )}
            </section>
          </div>

          <section className="card p-6">
            <h3 className="mb-3 font-display text-lg font-semibold">Interests</h3>
            {profile.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => <span key={i} className="chip">{i}</span>)}
              </div>
            ) : (
              <p className="text-sm text-ink-3">No interests yet</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
