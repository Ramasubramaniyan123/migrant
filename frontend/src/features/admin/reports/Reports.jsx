import { useEffect, useState, useCallback } from 'react'
import { adminReportService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, asArray } from '../components/AdminUI'
import { ReportDetailPanel } from '../moderation/Moderation'
import { formatDateTime } from '../../../utils/format'

export const Reports = () => {
  const [filters, setFilters] = useState({ status: 'ALL', category: 'ALL' })
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = asArray(await adminReportService.reports(filters))
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

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))

  return (
    <div>
      <AdminHeader title="Reports" description="All user-submitted reports with full detail." />
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="input max-w-[180px]" value={filters.status} onChange={(e) => set('status', e.target.value)}>
          {['ALL', 'PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'].map((s) => (
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
          { key: 'id', label: 'Report', render: (r) => <span className="font-medium">#{r.id}</span> },
          { key: 'target', label: 'Target', render: (r) => (
            <span className="block max-w-sm">
              <span>{r.targetType} #{r.targetId}</span>
              {r.targetPreview && <span className="mt-0.5 line-clamp-2 block text-xs text-ink-3">{r.targetPreview}</span>}
            </span>
          )},
          { key: 'reporter', label: 'Reported by', render: (r) => r.reporterName || '—' },
          { key: 'category', label: 'Category', render: (r) => r.category ? r.category.replace(/_/g, ' ') : '—' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'created', label: 'Created', render: (r) => formatDateTime(r.createdAt) },
        ]}
        actions={(r) => (
          <button
            type="button"
            className={selectedId === r.id ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}
            onClick={() => setSelectedId(selectedId === r.id ? null : r.id)}
          >
            {selectedId === r.id ? 'Hide' : 'Details'}
          </button>
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
