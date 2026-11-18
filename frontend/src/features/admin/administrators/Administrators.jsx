import { useEffect, useState, useCallback } from 'react'
import { adminManagementService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, asArray } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'

const EMPTY_FORM = { name: '', email: '', role: 'ADMIN' }
const ROLES = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'ANALYST']

export const Administrators = () => {
  const [admins, setAdmins] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setAdmins(asArray(await adminManagementService.list()))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    setError(''); setNotice('')
    try {
      await adminManagementService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      })
      setNotice('Administrator created.')
      setForm(EMPTY_FORM)
      setShowForm(false)
      load()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const setRole = async (admin, role) => {
    try {
      await adminManagementService.setRole(admin.id, role)
      load()
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  const setStatus = async (admin, status) => {
    try {
      await adminManagementService.setStatus(admin.id, status)
      load()
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  return (
    <div>
      <AdminHeader
        title="Administrators"
        description="Manage admin accounts, roles and access status."
        actions={(
          <button type="button" className="btn-primary btn-sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'New administrator'}
          </button>
        )}
      />

      {notice && <p className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success">{notice}</p>}

      {showForm && (
        <form onSubmit={submit} className="card mb-6 grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label htmlFor="adm-name" className="label">Name</label>
            <input id="adm-name" className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label htmlFor="adm-email" className="label">Email</label>
            <input id="adm-email" type="email" className="input" required value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label htmlFor="adm-role" className="label">Role</label>
            <select id="adm-role" className="input" value={form.role} onChange={(e) => set('role', e.target.value)}>
              {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary btn-sm" disabled={saving}>
              {saving ? 'Creating…' : 'Create administrator'}
            </button>
          </div>
        </form>
      )}

      <AdminTable
        rows={admins}
        loading={loading} error={error} onRetry={load}
        emptyTitle="No administrators" emptyDescription="No admin accounts found."
        columns={[
          { key: 'name', label: 'Admin', render: (a) => (
            <span>
              <span className="font-medium">{a.name || '—'}</span>
              <span className="block text-xs text-ink-3">{a.email}</span>
            </span>
          )},
          { key: 'role', label: 'Role', render: (a) => <StatusBadge status={a.role} /> },
          { key: 'status', label: 'Status', render: (a) => <StatusBadge status={a.status} /> },
          { key: 'lastLogin', label: 'Last login', render: (a) => a.lastLoginAt ? formatDateTime(a.lastLoginAt) : 'Never' },
          { key: 'created', label: 'Created', render: (a) => formatDateTime(a.createdAt) },
        ]}
        actions={(a) => (
          <span className="inline-flex flex-wrap justify-end gap-1">
            <select
              className="input h-8 w-auto px-2 text-xs"
              value={a.role}
              onChange={(e) => setRole(a, e.target.value)}
              aria-label={`Change role for ${a.name || a.email}`}
            >
              {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
            </select>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={() => setStatus(a, a.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
            >
              {a.status === 'ACTIVE' ? 'Disable' : 'Enable'}
            </button>
          </span>
        )}
      />
    </div>
  )
}
