import { useEffect, useState } from 'react'
import { adminSettingsService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { LoadingState, ErrorState } from '../../../components/ui/States'
import { AdminHeader } from '../components/AdminUI'

const toObject = (data) => {
  if (!data) return {}
  if (data instanceof Map) return Object.fromEntries(data)
  if (typeof data === 'object') return { ...data }
  return {}
}

// Coerce a string back to the original value's type when possible.
const coerce = (raw, original) => {
  if (typeof original === 'number') {
    const n = Number(raw)
    return Number.isNaN(n) ? raw : n
  }
  if (typeof original === 'boolean') return raw === 'true' || raw === '1'
  return raw
}

export const Settings = () => {
  const [original, setOriginal] = useState({})
  const [draft, setDraft] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    adminSettingsService.get()
      .then((data) => {
        const obj = toObject(data)
        setOriginal(obj)
        setDraft(Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v)])))
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const save = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    setError(''); setNotice('')
    try {
      const payload = Object.fromEntries(
        Object.entries(draft).map(([k, v]) => [k, coerce(v, original[k])])
      )
      await adminSettingsService.update(payload)
      setNotice('Settings saved.')
      load()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState />
  if (error && Object.keys(original).length === 0) return <ErrorState message={error} onRetry={load} />

  const keys = Object.keys(draft)

  return (
    <div>
      <AdminHeader title="Settings" description="Platform-wide configuration values." />
      {notice && <p className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success">{notice}</p>}
      {error && <p className="mb-4 rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>}

      {keys.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-3">No settings are configured.</div>
      ) : (
        <form onSubmit={save} className="card divide-y divide-line">
          {keys.map((key) => (
            <div key={key} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-center">
              <label htmlFor={`setting-${key}`} className="font-mono text-sm text-ink-2">{key}</label>
              <input
                id={`setting-${key}`}
                className="input"
                value={draft[key] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="p-4">
            <button type="submit" className="btn-primary btn-sm" disabled={saving}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
