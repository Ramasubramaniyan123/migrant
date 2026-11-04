import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApp } from '@/store/AppProvider'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

const tabs = ['Received', 'Sent', 'My connections'] as const

export function ConnectionsPage() {
  const { state, currentUser, respondRequest } = useApp()
  const toast = useToast()
  const [tab, setTab] = useState<(typeof tabs)[number]>('Received')
  if (!currentUser) return null

  const received = state.connections.filter((item) => item.toUserId === currentUser.id && item.status === 'pending')
  const sent = state.connections.filter((item) => item.fromUserId === currentUser.id && item.status === 'pending')
  const mine = state.connections.filter(
    (item) => item.status === 'accepted' && (item.fromUserId === currentUser.id || item.toUserId === currentUser.id),
  )

  const rows = tab === 'Received' ? received : tab === 'Sent' ? sent : mine

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Connections</h1>
        <p className="text-muted">Accept people you want to talk to. Messaging stays mutual.</p>
      </div>
      <div className="flex gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={cn('rounded-full px-4 py-2 text-sm', tab === item ? 'bg-brand text-white' : 'bg-card text-muted ring-1 ring-line')}
          >
            {item}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState title={`No ${tab.toLowerCase()} yet`} body="Discover people nearby and send a connection request." />
      ) : (
        <div className="space-y-3">
          {rows.map((item) => {
            const otherId = item.fromUserId === currentUser.id ? item.toUserId : item.fromUserId
            const person = state.users.find((user) => user.id === otherId)
            if (!person) return null
            return (
              <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <Link to={`/app/people/${person.id}`} className="flex items-center gap-3">
                  <Avatar src={person.photo} name={person.name} />
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <div className="mt-1 flex gap-2">
                      <Badge>{person.motherTongue}</Badge>
                      <Badge tone="line">{person.hometown}</Badge>
                    </div>
                  </div>
                </Link>
                {tab === 'Received' ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        respondRequest(item.id, 'accepted')
                        toast('Connected')
                      }}
                    >
                      Accept
                    </Button>
                    <Button variant="outline" onClick={() => respondRequest(item.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                ) : tab === 'Sent' ? (
                  <Button variant="outline" disabled>
                    Pending
                  </Button>
                ) : (
                  <Link to={`/app/messages/${person.id}`}>
                    <Button>Message</Button>
                  </Link>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
