import { useEffect, useState, useCallback } from 'react'
import { adminLanguageService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatusBadge, StatCard, asArray } from '../components/AdminUI'

const EMPTY_FORM = { name: '', nativeName: '', code: '' }

export const Languages = () => {
  const [languages, setLanguages] = useState([])
  const [stats, setStats] = useState(null)
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
      setLanguages(asArray(await adminLanguageService.list()))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { adminLanguageService.stats().then(setStats).catch(() => {}) }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    setError(''); setNotice('')
    try {
      await adminLanguageService.create({
        name: form.name.trim(),
        nativeName: form.nativeName.trim() || undefined,
        code: form.code.trim() || undefined,
      })
      setNotice('Language added.')
      setForm(EMPTY_FORM)
      setShowForm(false)
      load()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (lang) => {
    try {
      await adminLanguageService.setActive(lang.id, !lang.isActive)
      load()
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  return (
    <div>
      <AdminHeader
        title="Languages"
        description="Manage languages supported across the platform."
        actions={(
          <button type="button" className="btn-primary btn-sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'Add language'}
          </button>
        )}
      />

      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total languages" value={stats.totalLanguages ?? stats.total} />
          <StatCard label="Active" value={stats.activeLanguages ?? stats.active} />
          <StatCard label="Total users" value={stats.totalUsers} />
        </div>
      )}

      {notice && <p className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success">{notice}</p>}

      {showForm && (
        <form onSubmit={submit} className="card mb-6 grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <label htmlFor="lang-name" className="label">Name</label>
            <input id="lang-name" className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Hindi" />
          </div>
          <div>
            <label htmlFor="lang-native" className="label">Native name</label>
            <input id="lang-native" className="input" value={form.nativeName} onChange={(e) => set('nativeName', e.target.value)} placeholder="e.g. हिन्दी" />
          </div>
          <div>
            <label htmlFor="lang-code" className="label">Code</label>
            <input id="lang-code" className="input" value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="e.g. hi" />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" className="btn-primary btn-sm" disabled={saving}>
              {saving ? 'Adding…' : 'Add language'}
            </button>
          </div>
        </form>
      )}

      <AdminTable
        rows={languages}
        loading={loading} error={error} onRetry={load}
        emptyTitle="No languages" emptyDescription="No languages have been configured yet."
        columns={[
          { key: 'name', label: 'Name', render: (l) => <span className="font-medium">{l.name}</span> },
          { key: 'nativeName', label: 'Native name', render: (l) => l.nativeName || '—' },
          { key: 'code', label: 'Code', render: (l) => l.code || '—' },
          { key: 'users', label: 'Users', render: (l) => l.userCount ?? '—' },
          { key: 'communities', label: 'Communities', render: (l) => l.communityCount ?? '—' },
          { key: 'active', label: 'Status', render: (l) => <StatusBadge status={l.isActive ? 'ACTIVE' : 'INACTIVE'} /> },
        ]}
        actions={(l) => (
          <button type="button" className="btn-outline btn-sm" onClick={() => toggle(l)}>
            {l.isActive ? 'Deactivate' : 'Activate'}
          </button>
        )}
      />
    </div>
  )
}
