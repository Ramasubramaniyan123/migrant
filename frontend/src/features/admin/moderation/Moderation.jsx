import { useEffect, useState, useCallback } from 'react'
import { adminModerationService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, asArray } from '../components/AdminUI'
import { LoadingState } from '../../../components/ui/States'
import { formatDateTime } from '../../../utils/format'

const isOpen = (r) => r.status === 'PENDING' || r.status === 'UNDER_REVIEW'

export const ReportDetailPanel = ({ reportId }) => {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(''); setDetail(null)
    adminModerationService.report(reportId)
      .then((d) => { if (!cancelled) setDetail(d) })
      .catch((e) => { if (!cancelled) setError(errorMessage(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [reportId])

  if (loading) return <LoadingState label="Loading report details…" />
  if (error) return <p className="text-sm text-danger">{error}</p>
  if (!detail) return null

  const history = detail.reporterHistory || {}
  return (
    <div className="space-y-3 text-sm">
      {detail.targetContent && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-3">Reported content</p>
          <p className="mt-1 whitespace-pre-wrap rounded-lg bg-surface-alt p-3">{detail.targetContent}</p>
        </div>
      )}
      {detail.description && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-3">Report description</p>
          <p className="mt-1">{detail.description}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-ink-2">
        <span>Reporter: {detail.reporterName || '—'}</span>
        {detail.assignedTo && <span>Assigned to: {detail.assignedTo}</span>}
        {detail.resolution && <span>Resolution: {detail.resolution}</span>}
        {detail.resolvedAt && <span>Resolved: {formatDateTime(detail.resolvedAt)}</span>}
      </div>
      {(history.totalReports !== undefined || history.priorResolved !== undefined) && (
        <p className="text-xs text-ink-3">
          Reporter history: {history.totalReports ?? 0} total reports, {history.priorResolved ?? 0} previously resolved.
        </p>
      )}
    </div>
  )
}

export const Moderation = () => {
  const [filters, setFilters] = useState({ status: 'PENDING', category: 'ALL' })
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminModerationService.reports(filters)
      const list = asArray(data)
      setReports(list)
      setCategories((prev) => {
        const known = new Set(prev)
        list.forEach((r) => r.category && known.add(r.category))
        return [...known].sort()
      })
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])

  const act = async (fn, id, payload) => {
    try {
      await fn(id, payload)
      setSelectedId(null)
      load()
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  const resolve = (id) => {
    const resolution = window.prompt('Resolution note (optional):')
    if (resolution === null) return
    act(adminModerationService.resolve, id, { resolution: resolution || undefined })
  }

  const dismiss = (id) => {
    const reason = window.prompt('Dismissal reason:')
    if (!reason) return
    act(adminModerationService.dismiss, id, { reason })
  }

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))

  return (
    <div>
      <AdminHeader title="Content moderation" description="Review reported content and take action." />
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="input max-w-[180px]" value={filters.status} onChange={(e) => set('status', e.target.value)}>
          {['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED', 'ALL'].map((s) => (
            <option key={s} value={s}>{s === 'ALL' ? 'All statuses' : s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <select className="input max-w-[200px]" value={filters.category} onChange={(e) => set('category', e.target.value)}>
          <option value="ALL">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <AdminTable
        rows={reports}
        loading={loading} error={error} onRetry={load}
        emptyTitle="No reports" emptyDescription="No reports match the current filters."
        columns={[
          { key: 'target', label: 'Reported content', render: (r) => (
            <span className="block max-w-sm">
              <span className="font-medium">{r.targetType} #{r.targetId}</span>
              {r.targetPreview && <span className="mt-0.5 line-clamp-2 block text-xs text-ink-3">{r.targetPreview}</span>}
            </span>
          )},
          { key: 'reporter', label: 'Reporter', render: (r) => r.reporterName || '—' },
          { key: 'category', label: 'Category', render: (r) => r.category ? r.category.replace(/_/g, ' ') : '—' },
          { key: 'priority', label: 'Priority', render: (r) => r.priority || '—' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'created', label: 'Created', render: (r) => formatDateTime(r.createdAt) },
        ]}
        actions={(r) => (
          <span className="inline-flex flex-wrap justify-end gap-1">
            <button
              type="button"
              className={selectedId === r.id ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}
              onClick={() => setSelectedId(selectedId === r.id ? null : r.id)}
            >
              {selectedId === r.id ? 'Hide' : 'Details'}
            </button>
            {isOpen(r) && (
              <>
                <button type="button" className="btn-outline btn-sm" onClick={() => resolve(r.id)}>Resolve</button>
                <button type="button" className="btn-outline btn-sm text-danger" onClick={() => dismiss(r.id)}>Dismiss</button>
              </>
            )}
          </span>
        )}
      />

      {selectedId && !loading && (
        <div className="card mt-4 p-5">
          <h2 className="mb-3 font-display text-base font-semibold">Report #{selectedId}</h2>
          <ReportDetailPanel reportId={selectedId} />
        </div>
      )}
    </div>
  )
}
