import { useEffect, useState, useCallback } from 'react'
import { adminUserService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { Avatar } from '../../../components/ui/Avatar'
import { AdminHeader, AdminTable, StatusBadge, ConfirmButton, Pagination } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'
import { LoadingState } from '../../../components/ui/States'

export const Users = () => {
  const [filters, setFilters] = useState({ search: '', status: 'ALL', city: '', language: '' })
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [options, setOptions] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const r = await adminUserService.list({ ...filters, page, pageSize: 10 })
      setResult({ items: r.items || [], total: r.total || 0 })
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    adminUserService.filterOptions().then(setOptions).catch(() => {})
  }, [])

  const act = async (fn, id) => {
    try { await fn(id); load() } catch (e) { setError(errorMessage(e)) }
  }

  const viewDetail = async (id) => {
    if (detail?.user?.id === id) { setDetail(null); return }
    setDetailLoading(true)
    try {
      const [user, activity] = await Promise.all([
        adminUserService.get(id),
        adminUserService.activity(id).catch(() => []),
      ])
      setDetail({ user, activity: Array.isArray(activity) ? activity : [] })
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setDetailLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(result.total / 10))
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))

  return (
    <div>
      <AdminHeader title="User management" description="Search, review and moderate registered users." />
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input max-w-xs" placeholder="Search name or email" value={filters.search}
          onChange={(e) => set('search', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
        <select className="input max-w-[180px]" value={filters.status} onChange={(e) => set('status', e.target.value)}>
          {['ALL', 'ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DEACTIVATED'].map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        {options?.cities?.length > 0 && (
          <select className="input max-w-[180px]" value={filters.city} onChange={(e) => set('city', e.target.value)}>
            <option value="ALL">All cities</option>
            {options.cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <button type="button" className="btn-outline btn-sm" onClick={() => { setPage(1); load() }}>Apply</button>
      </div>

      <AdminTable
        loading={loading} error={error} onRetry={load}
        emptyTitle="No users found" emptyDescription="Try adjusting your filters."
        columns={[
          { key: 'name', label: 'User', render: (u) => (
            <span className="flex items-center gap-3"><Avatar name={u.fullName || u.email} src={u.avatarUrl} size="sm" />
              <span><span className="block font-medium">{u.fullName || '—'}</span><span className="text-xs text-ink-3">{u.email}</span></span></span>
          )},
          { key: 'city', label: 'City', render: (u) => u.currentCity || '—' },
          { key: 'hometown', label: 'Hometown', render: (u) => u.hometown || '—' },
          { key: 'status', label: 'Status', render: (u) => <StatusBadge status={u.status} /> },
          { key: 'verified', label: 'Verified', render: (u) => u.isVerified ? 'Yes' : 'No' },
          { key: 'joined', label: 'Joined', render: (u) => formatDateTime(u.joinedAt) },
        ]}
        actions={(u) => (
          <span className="inline-flex gap-1">
            <button className="btn-outline btn-sm" onClick={() => viewDetail(u.id)}>
              {detail?.user?.id === u.id ? 'Hide' : 'View'}
            </button>
            {u.status !== 'ACTIVE' && <button className="btn-outline btn-sm" onClick={() => act(adminUserService.activate, u.id)}>Activate</button>}
            {u.status === 'ACTIVE' && <ConfirmButton label="Suspend" confirmText="Suspend?" className="btn-outline btn-sm text-danger" onConfirm={() => act(adminUserService.suspend, u.id)} />}
            {!u.isVerified && <button className="btn-outline btn-sm" onClick={() => act(adminUserService.verify, u.id)}>Verify</button>}
          </span>
        )}
      />
      {detailLoading && <LoadingState label="Loading user details…" />}
      {detail && !detailLoading && (
        <div className="card mt-4 p-5">
          <h2 className="mb-3 font-display text-base font-semibold">
            {detail.user.fullName || detail.user.email}
          </h2>
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <p><span className="text-ink-3">Email:</span> {detail.user.email}</p>
            <p><span className="text-ink-3">Phone:</span> {detail.user.phone || '—'}</p>
            <p><span className="text-ink-3">City:</span> {detail.user.currentCity || '—'}</p>
            <p><span className="text-ink-3">Hometown:</span> {detail.user.hometown || '—'}</p>
            <p><span className="text-ink-3">Mother tongue:</span> {detail.user.motherTongue || '—'}</p>
            <p><span className="text-ink-3">Occupation:</span> {detail.user.occupation || '—'}</p>
            <p><span className="text-ink-3">Joined:</span> {detail.user.joinedAt ? formatDateTime(detail.user.joinedAt) : '—'}</p>
            <p><span className="text-ink-3">Last active:</span> {detail.user.lastActiveAt ? formatDateTime(detail.user.lastActiveAt) : '—'}</p>
          </div>
          {detail.user.languages?.length > 0 && (
            <p className="mt-2 text-sm text-ink-2">Languages: {detail.user.languages.join(', ')}</p>
          )}
          <h3 className="mb-2 mt-4 text-sm font-semibold">Recent activity</h3>
          {detail.activity.length === 0 ? (
            <p className="text-sm text-ink-3">No activity recorded.</p>
          ) : (
            <ul className="divide-y divide-line text-sm">
              {detail.activity.slice(0, 10).map((a, i) => (
                <li key={a.id ?? i} className="flex items-center justify-between py-2">
                  <span>{a.description || a.type || 'Activity'}</span>
                  <span className="text-xs text-ink-3">{a.createdAt ? formatDateTime(a.createdAt) : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <Pagination page={page - 1} totalPages={totalPages} onPage={(p) => setPage(p + 1)} />
    </div>
  )
}
