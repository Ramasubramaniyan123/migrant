import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatRelative } from '@/lib/dates'
import { useApp } from '@/store/AppProvider'
import { useEffect } from 'react'

export function NotificationsPage() {
  const { state, currentUser, markNotificationsRead } = useApp()
  const items = state.notifications.filter((item) => item.userId === currentUser?.id)

  useEffect(() => {
    markNotificationsRead()
  }, [markNotificationsRead])

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      {items.length === 0 ? (
        <EmptyState title="You are all caught up" body="Connection requests, comments and events will land here." />
      ) : (
        items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted">{item.body}</p>
                <p className="mt-1 text-xs text-muted">{formatRelative(item.createdAt)}</p>
              </div>
              {!item.read ? <span className="h-2 w-2 rounded-full bg-accent" /> : null}
            </div>
            <Link to={item.href}>
              <Button className="mt-3" size="sm" variant="secondary">
                Open
              </Button>
            </Link>
          </Card>
        ))
      )}
    </div>
  )
}
