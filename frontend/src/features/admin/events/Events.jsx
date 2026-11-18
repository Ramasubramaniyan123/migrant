import { useEffect, useState, useCallback } from 'react'
import { adminEventService, adminCommunityService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, ConfirmButton, asArray } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'

const EMPTY_FORM = {
  title: '', description: '', communityId: '', location: '', city: '',
  startsAt: '', endsAt: '', capacity: '',
}

export const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [communities, setCommunities] = useState([])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setEvents(asArray(await adminEventService.list()))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    adminCommunityService.list({ page: 1, pageSize: 100 })
      .then((r) => setCommunities(r.items || []))
      .catch(() => {})
  }, [])

  const filtered = events.filter((e) => {
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false
    if (search && !`${e.title} ${e.communityName || ''} ${e.city || ''}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const toLocalInput = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const openEdit = (e) => {
    setForm({
      title: e.title || '', description: e.description || '',
      communityId: e.communityId ? String(e.communityId) : '',
      location: e.location || '', city: e.city || '',
      startsAt: toLocalInput(e.startsAt), endsAt: toLocalInput(e.endsAt),
      capacity: e.capacity != null ? String(e.capacity) : '',
    })
    setEditingId(e.id)
    setShowForm(true)
  }

  const submit = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    setError(''); setNotice('')
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        communityId: form.communityId ? Number(form.communityId) : undefined,
        location: form.location.trim() || undefined,
        city: form.city.trim() || undefined,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      }
      if (editingId) await adminEventService.update(editingId, payload)
      else await adminEventService.create(payload)
      setNotice(editingId ? 'Event updated.' : 'Event created.')
      setForm(EMPTY_FORM)
      setEditingId(null)
      setShowForm(false)
      load()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    try { await adminEventService.remove(id); load() } catch (e) { setError(errorMessage(e)) }
  }

  return (
    <div>
      <AdminHeader
        title="Event management"
        description="Create and moderate community events."
        actions={(
          <button type="button" className="btn-primary btn-sm" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setShowForm((v) => !v) }}>
            {showForm ? 'Close form' : 'New event'}
          </button>
        )}
      />

      {notice && <p className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success">{notice}</p>}

      {showForm && (
        <form onSubmit={submit} className="card mb-6 grid gap-4 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="ev-title" className="label">Title</label>
            <input id="ev-title" className="input" required value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ev-desc" className="label">Description</label>
            <textarea id="ev-desc" className="input min-h-[80px]" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div>
            <label htmlFor="ev-community" className="label">Community</label>
            <select id="ev-community" className="input" value={form.communityId} onChange={(e) => set('communityId', e.target.value)}>
              <option value="">None</option>
              {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ev-capacity" className="label">Capacity</label>
            <input id="ev-capacity" type="number" min="1" className="input" value={form.capacity} onChange={(e) => set('capacity', e.target.value)} />
          </div>
          <div>
            <label htmlFor="ev-location" className="label">Location</label>
            <input id="ev-location" className="input" value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div>
            <label htmlFor="ev-city" className="label">City</label>
            <input id="ev-city" className="input" value={form.city} onChange={(e) => set('city', e.target.value)} />
          </div>
          <div>
            <label htmlFor="ev-start" className="label">Starts at</label>
            <input id="ev-start" type="datetime-local" className="input" value={form.startsAt} onChange={(e) => set('startsAt', e.target.value)} />
          </div>
          <div>
            <label htmlFor="ev-end" className="label">Ends at</label>
            <input id="ev-end" type="datetime-local" className="input" value={form.endsAt} onChange={(e) => set('endsAt', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary btn-sm" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create event'}
            </button>
            {editingId && (
              <button type="button" className="btn-ghost btn-sm ml-2" onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM) }}>Cancel</button>
            )}
          </div>
        </form>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input max-w-xs" placeholder="Search events" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-[160px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].map((s) => (
            <option key={s} value={s}>{s === 'ALL' ? 'All statuses' : s}</option>
          ))}
        </select>
      </div>

      <AdminTable
        rows={filtered}
        loading={loading} error={error} onRetry={load}
        emptyTitle="No events" emptyDescription="No events match the current filters."
        columns={[
          { key: 'title', label: 'Event', render: (e) => (
            <span className="block max-w-sm">
              <span className="font-medium">{e.title}</span>
              {e.communityName && <span className="block text-xs text-ink-3">{e.communityName}</span>}
            </span>
          )},
          { key: 'location', label: 'Location', render: (e) => e.location || e.city || '—' },
          { key: 'starts', label: 'Starts', render: (e) => formatDateTime(e.startsAt) },
          { key: 'participants', label: 'Participants', render: (e) => `${e.participantCount ?? 0}${e.capacity ? ` / ${e.capacity}` : ''}` },
          { key: 'status', label: 'Status', render: (e) => <StatusBadge status={e.status} /> },
          { key: 'organizer', label: 'Organizer', render: (e) => e.organizerName || '—' },
        ]}
        actions={(e) => (
          <span className="inline-flex gap-1">
            <button className="btn-outline btn-sm" onClick={() => openEdit(e)}>Edit</button>
            <ConfirmButton label="Delete" className="btn-outline btn-sm text-danger" onConfirm={() => remove(e.id)} />
          </span>
        )}
      />
    </div>
  )
}
