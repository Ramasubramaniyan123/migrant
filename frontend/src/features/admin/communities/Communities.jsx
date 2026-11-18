import { useEffect, useState, useCallback } from 'react'
import { adminCommunityService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, ConfirmButton, Pagination, StatCard } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'

const EMPTY_FORM = { name: '', description: '', type: 'INTEREST', language: '', hometown: '', city: '' }
const COMMUNITY_TYPES = ['LANGUAGE', 'HOMETOWN', 'INTEREST', 'WORKPLACE']

export const AdminCommunities = () => {
  const [filters, setFilters] = useState({ search: '', type: 'ALL', city: 'ALL', status: 'ALL' })
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ items: [], total: 0 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await adminCommunityService.list({ ...filters, page, pageSize: 10 })
      setResult({ items: r.items || [], total: r.total || 0 })
    } catch (e) { setError(errorMessage(e)) } finally { setLoading(false) }
  }, [filters, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { adminCommunityService.stats().then(setStats).catch(() => {}) }, [])

  const act = async (fn, ...args) => {
    try { await fn(...args); load() } catch (e) { setError(errorMessage(e)) }
  }

  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))
  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const totalPages = Math.max(1, Math.ceil(result.total / 10))

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }
  const openEdit = (c) => {
    setForm({
      name: c.name || '', description: c.description || '', type: c.type || 'INTEREST',
      language: c.language || '', hometown: c.hometown || '', city: c.city || '',
    })
    setEditingId(c.id)
    setShowForm(true)
  }

  const submit = async (ev) => {
    ev.preventDefault()
    setSaving(true); setError(''); setNotice('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        language: form.language.trim() || undefined,
        hometown: form.hometown.trim() || undefined,
        city: form.city.trim() || undefined,
      }
      if (editingId) await adminCommunityService.update(editingId, payload)
      else await adminCommunityService.create(payload)
      setNotice(editingId ? 'Community updated.' : 'Community created.')
      setShowForm(false)
      load()
    } catch (e) { setError(errorMessage(e)) } finally { setSaving(false) }
  }

  return (
    <div>
      <AdminHeader
        title="Community management" description="Review, activate and moderate communities."
        actions={<button type="button" className="btn-primary btn-sm" onClick={openCreate}>New community</button>}
      />
      {notice && <p className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success">{notice}</p>}
      {showForm && (
        <form onSubmit={submit} className="card mb-6 grid gap-4 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><label htmlFor="cm-name" className="label">Name</label>
            <input id="cm-name" className="input" required value={form.name} onChange={(e) => setF('name', e.target.value)} /></div>
          <div className="sm:col-span-2"><label htmlFor="cm-desc" className="label">Description</label>
            <textarea id="cm-desc" className="input min-h-[70px]" value={form.description} onChange={(e) => setF('description', e.target.value)} /></div>
          <div><label htmlFor="cm-type" className="label">Type</label>
            <select id="cm-type" className="input" value={form.type} onChange={(e) => setF('type', e.target.value)}>
              {COMMUNITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></div>
          <div><label htmlFor="cm-lang" className="label">Language</label>
            <input id="cm-lang" className="input" value={form.language} onChange={(e) => setF('language', e.target.value)} placeholder="e.g. Hindi" /></div>
          <div><label htmlFor="cm-hometown" className="label">Hometown</label>
            <input id="cm-hometown" className="input" value={form.hometown} onChange={(e) => setF('hometown', e.target.value)} /></div>
          <div><label htmlFor="cm-city" className="label">City</label>
            <input id="cm-city" className="input" value={form.city} onChange={(e) => setF('city', e.target.value)} /></div>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="btn-primary btn-sm" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create community'}</button>
            <button type="button" className="btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total communities" value={stats.total} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Total members" value={stats.totalMembers} />
        </div>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input max-w-xs" placeholder="Search communities" value={filters.search} onChange={(e) => set('search', e.target.value)} />
        <select className="input max-w-[160px]" value={filters.type} onChange={(e) => set('type', e.target.value)}>
          <option value="ALL">All types</option>
          {['LANGUAGE', 'HOMETOWN', 'INTEREST', 'WORKPLACE'].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select className="input max-w-[160px]" value={filters.status} onChange={(e) => set('status', e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button type="button" className="btn-outline btn-sm" onClick={() => { setPage(1); load() }}>Apply</button>
      </div>
      <AdminTable
        loading={loading} error={error} onRetry={load}
        emptyTitle="No communities" emptyDescription="No communities match the filters."
        columns={[
          { key: 'name', label: 'Name', render: (c) => <span className="font-medium">{c.name}</span> },
          { key: 'type', label: 'Type', render: (c) => c.type || '—' },
          { key: 'city', label: 'City', render: (c) => c.city || '—' },
          { key: 'members', label: 'Members', render: (c) => c.memberCount },
          { key: 'active', label: 'Status', render: (c) => <StatusBadge status={c.isActive ? 'ACTIVE' : 'SUSPENDED'} /> },
          { key: 'created', label: 'Created', render: (c) => formatDateTime(c.createdAt) },
        ]}
        actions={(c) => (
          <span className="inline-flex gap-1">
            <button className="btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
            <button className="btn-outline btn-sm" onClick={() => act(adminCommunityService.setActive, c.id, !c.isActive)}>
              {c.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <ConfirmButton label="Delete" className="btn-outline btn-sm text-danger" onConfirm={() => act(adminCommunityService.remove, c.id)} />
          </span>
        )}
      />
      <Pagination page={page - 1} totalPages={totalPages} onPage={(p) => setPage(p + 1)} />
    </div>
  )
}
