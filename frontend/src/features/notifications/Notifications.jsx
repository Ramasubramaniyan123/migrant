import { useEffect, useState, useCallback } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { notificationService } from '../../services/notifications/notificationService'
import { errorMessage } from '../../services/api/apiClient'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'
import { timeAgo } from '../../utils/format'

export const Notifications = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async (p = page) => {
    setLoading(true)
    setError('')
    try {
      const result = await notificationService.list({ page: p, size: 20 })
      setItems(result.items || [])
      setTotalPages(result.totalPages || 1)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load(0) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const markAll = async () => {
    try {
      await notificationService.markAllRead()
      load(page)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const markRead = async (n) => {
    if (n.read) return
    try {
      await notificationService.markRead(n.id)
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const remove = async (id) => {
    try {
      await notificationService.remove(id)
      setItems((prev) => prev.filter((x) => x.id !== id))
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        description="Updates from your communities and connections."
        actions={
          <button type="button" className="btn-outline btn-sm" onClick={markAll}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : items.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <div className="card divide-y divide-line">
          {items.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 ${n.read ? '' : 'bg-accent-soft/40'}`}
            >
              <Bell className={`mt-0.5 h-4 w-4 flex-shrink-0 ${n.read ? 'text-ink-3' : 'text-accent'}`} />
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => markRead(n)}>
                <p className="text-sm font-medium">{n.title}</p>
                {n.content && <p className="mt-0.5 text-sm text-ink-2">{n.content}</p>}
                <p className="mt-1 text-xs text-ink-3">{n.createdAt ? timeAgo(n.createdAt) : ''}</p>
              </button>
              <button
                type="button"
                onClick={() => remove(n.id)}
                className="rounded-lg p-1.5 text-ink-3 hover:bg-hover hover:text-danger"
                aria-label="Delete notification"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" className="btn-outline btn-sm" disabled={page === 0} onClick={() => { setPage(page - 1); load(page - 1) }}>Previous</button>
          <span className="text-sm text-ink-2">Page {page + 1} of {totalPages}</span>
          <button type="button" className="btn-outline btn-sm" disabled={page >= totalPages - 1} onClick={() => { setPage(page + 1); load(page + 1) }}>Next</button>
        </div>
      )}
    </div>
  )
}
