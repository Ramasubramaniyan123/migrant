import { Link, useNavigate } from 'react-router-dom'
import { MapPin, MessageCircle, UserPlus } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatDistance } from '@/lib/distance'
import { cn } from '@/lib/cn'
import { useApp } from '@/store/AppProvider'
import { useToast } from '@/components/ui/Toast'
import type { User } from '@/types'

export function PersonCard({
  person,
  distance,
  shared,
  layout = 'grid',
}: {
  person: User
  distance: number
  shared: string[]
  layout?: 'grid' | 'list'
}) {
  const { requestState, sendRequest, respondRequest, state, currentUser } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const status = requestState(person.id)
  const incoming = state.connections.find(
    (item) => item.status === 'pending' && item.fromUserId === person.id && item.toUserId === currentUser?.id,
  )

  return (
    <Card className={cn('p-4 transition hover:-translate-y-0.5 hover:shadow-md', layout === 'list' && 'flex gap-4')}>
      <Link to={`/app/people/${person.id}`} className={cn('flex gap-3', layout === 'list' && 'flex-1')}>
        <Avatar src={person.photo} name={person.name} size={layout === 'list' ? 'lg' : 'md'} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">{person.name}</p>
              <p className="text-sm text-muted">{person.profession}</p>
            </div>
            {person.privacy.locationVisibility === 'approximate' ? (
              <span className="shrink-0 text-xs text-muted">{formatDistance(distance)}</span>
            ) : (
              <span className="shrink-0 text-xs text-muted">Location hidden</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge>{person.motherTongue}</Badge>
            <Badge tone="line">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {person.hometown}
              </span>
            </Badge>
          </div>
          {shared.length ? (
            <p className="mt-2 text-xs text-muted">Shared: {shared.slice(0, 3).join(', ')}</p>
          ) : (
            <p className="mt-2 text-xs text-muted">{person.locality}, Gurugram</p>
          )}
        </div>
      </Link>
      <div className={cn('mt-3 flex gap-2', layout === 'list' && 'mt-0 w-40 flex-col justify-center')}>
        {status === 'accepted' ? (
          <Button className="w-full" onClick={() => navigate(`/app/messages/${person.id}`)}>
            <MessageCircle className="h-4 w-4" /> Message
          </Button>
        ) : status === 'pending-out' ? (
          <Button className="w-full" variant="outline" disabled>
            Request sent
          </Button>
        ) : status === 'pending-in' && incoming ? (
          <Button
            className="w-full"
            onClick={() => {
              respondRequest(incoming.id, 'accepted')
              toast('You are now connected')
            }}
          >
            Accept
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              sendRequest(person.id)
              toast('Connection request sent')
            }}
          >
            <UserPlus className="h-4 w-4" /> Connect
          </Button>
        )}
      </div>
    </Card>
  )
}
