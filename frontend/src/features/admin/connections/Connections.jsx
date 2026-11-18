import { useEffect, useState, useCallback } from 'react'
import { adminConnectionService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, Pagination, StatCard } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'

const statEntries = (analytics) => {
  if (!analytics || typeof analytics !== 'object') return []
  const source = analytics instanceof Map ? Object.fromEntries(analytics) : analytics
  return Object.entries(source)
    .filter(([, v]) => typeof v === 'number')
    .map(([k, v]) => ({ label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()), value: v }))
}

const PAGE_SIZE = 20

export const Connections = () => {
  const [result, setResult] = useState({ items: [], total: 0 })
  const [analytics, setAnalytics] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const r = await adminConnectionService.list({ page, size: PAGE_SIZE })
      setResult({ items: r.items || [], total: r.total || 0 })
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])
  useEffect(() => { adminConnectionService.analytics().then(setAnalytics).catch(() => {}) }, [])

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE))
  const stats = statEntries(analytics)

  return (
    <div>
      <AdminHeader title="Connections" description="Review connection requests and match analytics." />

      {stats.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.slice(0, 8).map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
        </div>
      )}

      <AdminTable
        rows={result.items}
        loading={loading} error={error} onRetry={load}
        emptyTitle="No connections" emptyDescription="No connection requests found."
        columns={[
          { key: 'requester', label: 'Requester', render: (c) => c.requesterName || `#${c.requesterId}` },
          { key: 'receiver', label: 'Receiver', render: (c) => c.receiverName || `#${c.receiverId}` },
          { key: 'status', label: 'Status', render: (c) => <StatusBadge status={c.status} /> },
          { key: 'score', label: 'Match score', render: (c) => c.matchScore ?? '—' },
          { key: 'matchedBy', label: 'Matched by', render: (c) => c.matchedBy || '—' },
          { key: 'created', label: 'Created', render: (c) => formatDateTime(c.createdAt) },
          { key: 'updated', label: 'Updated', render: (c) => formatDateTime(c.updatedAt) },
        ]}
      />
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  )
}
