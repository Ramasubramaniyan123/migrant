import { useEffect, useState, useCallback } from 'react'
import { adminNotificationService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, asArray } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'

const EMPTY_FORM = { title: '', body: '', type: 'ANNOUNCEMENT', audience: 'ALL' }

export const Notifications = () => {
  const [tab, setTab] = useState('notifications')
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = tab === 'notifications'
        ? await adminNotificationService.list()
        : await adminNotificationService.history()
      setItems(asArray(data))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => { load() }, [load])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const broadcast = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    setError(''); setNotice('')
    try {
      await adminNotificationService.broadcast({
        title: form.title.trim(),
        body: form.body.trim(),
        type: form.type,
        audience: form.audience,
      })
      setNotice('Notification broadcast sent.')
      setForm(EMPTY_FORM)
      if (tab === 'notifications') load()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminHeader title="Notifications" description="Broadcast announcements and review notification history." />

      <form onSubmit={broadcast} className="card mb-6 grid gap-4 p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nt-title" className="label">Title</label>
          <input id="nt-title" className="input" required value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="nt-body" className="label">Body</label>
          <textarea id="nt-body" className="input min-h-[80px]" required value={form.body} onChange={(e) => set('body', e.target.value)} />
        </div>
        <div>
          <label htmlFor="nt-type" className="label">Type</label>
          <select id="nt-type" className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>
            {['ANNOUNCEMENT', 'EVENT', 'MAINTENANCE', 'POLICY'].map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nt-audience" className="label">Audience</label>
          <select id="nt-audience" className="input" value={form.audience} onChange={(e) => set('audience', e.target.value)}>
            {['ALL', 'ACTIVE_USERS', 'NEW_USERS', 'COMMUNITY_MEMBERS'].map((a) => (
              <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary btn-sm" disabled={saving}>
            {saving ? 'Sending…' : 'Broadcast notification'}
          </button>
        </div>
      </form>

      {notice && <p className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success">{notice}</p>}

      <div className="mb-4 flex gap-2">
        {['notifications', 'history'].map((t) => (
          <button
            key={t}
            type="button"
            className={`btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t)}
          >
            {t === 'notifications' ? 'Sent notifications' : 'Broadcast history'}
          </button>
        ))}
      </div>

      <AdminTable
        rows={items}
        loading={loading} error={error} onRetry={load}
        emptyTitle={tab === 'notifications' ? 'No notifications' : 'No broadcast history'}
        emptyDescription="Nothing has been sent yet."
        columns={[
          { key: 'title', label: 'Title', render: (n) => (
            <span className="block max-w-md">
              <span className="font-medium">{n.title}</span>
              {n.body && <span className="mt-0.5 line-clamp-2 block text-xs text-ink-3">{n.body}</span>}
            </span>
          )},
          { key: 'type', label: 'Type', render: (n) => n.type ? n.type.replace(/_/g, ' ') : '—' },
          { key: 'audience', label: 'Audience', render: (n) => n.audience ? n.audience.replace(/_/g, ' ') : '—' },
          { key: 'recipients', label: 'Recipients', render: (n) => n.recipientCount ?? '—' },
          { key: 'status', label: 'Status', render: (n) => n.status ? <StatusBadge status={n.status} /> : '—' },
          { key: 'sent', label: 'Sent', render: (n) => formatDateTime(n.sentAt) },
          { key: 'sentBy', label: 'Sent by', render: (n) => n.sentBy || '—' },
        ]}
      />
    </div>
  )
}
