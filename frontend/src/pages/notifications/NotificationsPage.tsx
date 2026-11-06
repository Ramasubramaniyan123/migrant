import { useNavigate } from 'react-router-dom'
import type { NotificationType } from '@/types/notification.types'
import { useNotificationContext } from '@/context/NotificationContext'
import { NOTIFICATION_LABELS, ROUTES } from '@/utils/constants'
import { cn } from '@/utils/helpers'
import { formatRelativeTime } from '@/utils/formatters'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'

const DESTINATIONS: Record<NotificationType, string> = {
  CONNECTION_REQUEST: ROUTES.connections,
  MESSAGE: ROUTES.messages,
  COMMUNITY_INVITE: ROUTES.communities,
  POST_LIKE: ROUTES.communities,
  COMMENT: ROUTES.communities,
}

const TONES: Record<NotificationType, string> = {
  CONNECTION_REQUEST: 'bg-brand-50 text-brand-700',
  MESSAGE: 'bg-cyan-50 text-cyan-700',
  COMMUNITY_INVITE: 'bg-emerald-50 text-emerald-700',
  POST_LIKE: 'bg-amber-50 text-amber-700',
  COMMENT: 'bg-violet-50 text-violet-700',
}

/** Activity feed of connection, message and community notifications. */
export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markRead, markAllRead, clearAll } =
    useNotificationContext()
  const navigate = useNavigate()

  const handleOpen = async (id: number, type: NotificationType) => {
    await markRead(id)
    navigate(DESTINATIONS[type])
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="muted mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void markAllRead()} disabled={unreadCount === 0}>
            Mark all read
          </Button>
          <Button variant="ghost" onClick={() => void clearAll()} disabled={notifications.length === 0}>
            Clear all
          </Button>
        </div>
      </header>

      {isLoading ? (
        <Loader label="Loading notifications…" />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="Requests, messages and community activity will show up here."
        />
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => void handleOpen(notification.id, notification.type)}
                className={cn(
                  'card flex w-full items-start gap-4 text-left transition hover:shadow-md',
                  !notification.isRead && 'border-brand-200 bg-brand-50/40',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase',
                    TONES[notification.type],
                  )}
                  aria-hidden="true"
                >
                  {notification.type.slice(0, 2)}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {notification.title}
                    </span>
                    {!notification.isRead ? (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-brand-600"
                        aria-label="Unread"
                      />
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">{notification.content}</span>
                  <span className="mt-2 flex items-center gap-2">
                    <Badge variant="neutral" size="sm">
                      {NOTIFICATION_LABELS[notification.type]}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
