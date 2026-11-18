import { useEffect, useState, useCallback, useMemo } from 'react'
import { adminAuditService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, asArray } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'

export const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const [resultFilter, setResultFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setLogs(asArray(await adminAuditService.list()))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return logs.filter((l) => {
      if (resultFilter !== 'ALL' && String(l.result || '').toUpperCase() !== resultFilter) return false
      if (!q) return true
      return [l.action, l.adminName, l.targetType, l.details, l.ipAddress]
        .some((v) => String(v || '').toLowerCase().includes(q))
    })
  }, [logs, search, resultFilter])

  return (
    <div>
      <AdminHeader title="Audit logs" description="Every administrative action recorded on the platform." />
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          className="input max-w-xs"
          placeholder="Search action, admin, target…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input max-w-[160px]" value={resultFilter} onChange={(e) => setResultFilter(e.target.value)}>
          {['ALL', 'SUCCESS', 'FAILURE', 'FAILED'].map((r) => (
            <option key={r} value={r}>{r === 'ALL' ? 'All results' : r}</option>
          ))}
        </select>
      </div>
      <AdminTable
        rows={filtered}
        loading={loading} error={error} onRetry={load}
        emptyTitle="No audit logs" emptyDescription="No admin actions have been recorded yet."
        columns={[
          { key: 'time', label: 'Time', render: (l) => formatDateTime(l.createdAt) },
          { key: 'admin', label: 'Admin', render: (l) => (
            <span>
              <span className="font-medium">{l.adminName || '—'}</span>
              {l.adminRole && <span className="block text-xs text-ink-3">{l.adminRole}</span>}
            </span>
          )},
          { key: 'action', label: 'Action', render: (l) => <span className="font-medium">{l.action || '—'}</span> },
          { key: 'target', label: 'Target', render: (l) => `${l.targetType || ''}${l.targetId ? ` #${l.targetId}` : ''}`.trim() || '—' },
          { key: 'details', label: 'Details', render: (l) => (
            <span className="block max-w-sm truncate" title={l.details}>{l.details || '—'}</span>
          )},
          { key: 'ip', label: 'IP', render: (l) => l.ipAddress || '—' },
          { key: 'result', label: 'Result', render: (l) => l.result ? <StatusBadge status={l.result} /> : '—' },
        ]}
      />
    </div>
  )
}
