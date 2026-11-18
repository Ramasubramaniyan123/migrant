import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Users, LogOut, UserPlus } from 'lucide-react'
import { communityService } from '../../services/communities/communityService'
import { errorMessage } from '../../services/api/apiClient'
import { Avatar } from '../../components/ui/Avatar'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'

export const CommunityDetails = () => {
  const { id } = useParams()
  const [community, setCommunity] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [details, memberPage] = await Promise.all([
        communityService.get(id),
        communityService.members(id, { size: 50 }).catch(() => ({ items: [] })),
      ])
      setCommunity(details)
      setMembers(memberPage.items || [])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const toggleMembership = async () => {
    setBusy(true)
    try {
      if (community?.member) await communityService.leave(id)
      else await communityService.join(id)
      await load()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <LoadingState />
  if (error && !community) return <ErrorState message={error} onRetry={load} />
  if (!community) return <EmptyState title="Community not found" />

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={community.name}
        description={[community.languageName, community.locationCity, community.locationCountry].filter(Boolean).join(' · ')}
        actions={
          <button type="button" className={community.member ? 'btn-outline' : 'btn-accent'} onClick={toggleMembership} disabled={busy}>
            {community.member ? <><LogOut className="h-4 w-4" /> Leave</> : <><UserPlus className="h-4 w-4" /> Join</>}
          </button>
        }
      />

      {community.description && (
        <p className="mb-8 text-ink-2">{community.description}</p>
      )}

      <div className="mb-4 flex items-center gap-2 text-sm text-ink-2">
        <Users className="h-4 w-4" /> {community.memberCount ?? members.length} members
        {community.memberRole && <span className="badge bg-accent-soft text-accent ml-2">{community.memberRole}</span>}
      </div>

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      <section className="card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Members</h2>
        {members.length === 0 ? (
          <EmptyState title="No members yet" description="Be the first to join." />
        ) : (
          <ul className="divide-y divide-line">
            {members.map((m) => (
              <li key={m.userId} className="flex items-center gap-3 py-3">
                <Avatar name={m.displayName} size="sm" />
                <span className="flex-1 truncate text-sm">{m.displayName || 'Member'}</span>
                {m.role && <span className="badge bg-surface-alt text-ink-2">{m.role}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-6 text-sm">
        <Link to={`/app/feed?community=${community.id}`} className="link">View community feed</Link>
      </p>
    </div>
  )
}
