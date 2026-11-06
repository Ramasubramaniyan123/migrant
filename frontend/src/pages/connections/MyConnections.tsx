import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messageService } from '@/services/messageService'
import { useAuth } from '@/hooks/useAuth'
import { useConnections } from '@/hooks/useConnections'
import { useUsers } from '@/hooks/useUsers'
import type { UserSummary } from '@/types/user.types'
import { ROUTES } from '@/utils/constants'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import SearchBar from '@/components/shared/SearchBar'
import UserCard from '@/components/shared/UserCard'

/** Grid of accepted connections with search and quick message/profile actions. */
export default function MyConnections() {
  const { user } = useAuth()
  const { accepted, isLoading } = useConnections()
  const { getSummaryById } = useUsers()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const connections = useMemo<Array<{ otherId: number; summary: UserSummary }>>(() => {
    if (!user) return []
    return accepted
      .map((connection) => ({
        otherId: connection.requesterId === user.id ? connection.receiverId : connection.requesterId,
      }))
      .map(({ otherId }) => ({ otherId, summary: getSummaryById(otherId) }))
      .filter((row): row is { otherId: number; summary: UserSummary } => Boolean(row.summary))
  }, [accepted, getSummaryById, user])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return connections
    return connections.filter((row) => row.summary.fullName.toLowerCase().includes(term))
  }, [connections, query])

  const handleMessage = async (otherId: number) => {
    if (!user) return
    await messageService.getOrCreateConversation(user.id, otherId)
    navigate(ROUTES.messages)
  }

  if (isLoading) {
    return <Loader label="Loading connections…" />
  }

  if (connections.length === 0) {
    return (
      <EmptyState
        title="No connections yet"
        description="Accepted connections will appear here. Head to Discover to find people nearby."
      />
    )
  }

  return (
    <div className="space-y-4">
      <SearchBar value={query} onChange={setQuery} placeholder="Search your connections" className="sm:max-w-sm" />

      {filtered.length === 0 ? (
        <EmptyState title="No matches" description="No connections match your search." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ otherId, summary }) => (
            <UserCard
              key={otherId}
              user={summary}
              connectionStatus="ACCEPTED"
              onMessage={() => void handleMessage(otherId)}
              onViewProfile={() => navigate(ROUTES.userProfile(otherId))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
