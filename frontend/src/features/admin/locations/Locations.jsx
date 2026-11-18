import { useEffect, useState, useCallback } from 'react'
import { adminLocationService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { AdminHeader, AdminTable, StatCard, asArray } from '../components/AdminUI'

const statEntries = (stats) => {
  if (!stats || typeof stats !== 'object') return []
  const source = stats instanceof Map ? Object.fromEntries(stats) : stats
  return Object.entries(source)
    .filter(([, v]) => typeof v === 'number')
    .map(([k, v]) => ({ label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()), value: v }))
}

export const Locations = () => {
  const [cities, setCities] = useState([])
  const [localities, setLocalities] = useState([])
  const [stats, setStats] = useState(null)
  const [cityFilter, setCityFilter] = useState('')
  const [form, setForm] = useState({ name: '', cityId: '' })
  const [saving, setSaving] = useState(false)
  const [loadingCities, setLoadingCities] = useState(true)
  const [loadingLocalities, setLoadingLocalities] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadCities = useCallback(async () => {
    setLoadingCities(true)
    setError('')
    try {
      setCities(asArray(await adminLocationService.cities()))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoadingCities(false)
    }
  }, [])

  const loadLocalities = useCallback(async () => {
    setLoadingLocalities(true)
    setError('')
    try {
      setLocalities(asArray(await adminLocationService.localities(cityFilter || undefined)))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoadingLocalities(false)
    }
  }, [cityFilter])

  useEffect(() => { loadCities() }, [loadCities])
  useEffect(() => { loadLocalities() }, [loadLocalities])
  useEffect(() => { adminLocationService.stats().then(setStats).catch(() => {}) }, [])

  useEffect(() => {
    if (!form.cityId && cities.length > 0) setForm((f) => ({ ...f, cityId: String(cities[0].id) }))
  }, [cities, form.cityId])

  const submit = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    setError(''); setNotice('')
    try {
      await adminLocationService.createLocality({
        name: form.name.trim(),
        cityId: Number(form.cityId),
      })
      setNotice('Locality added.')
      setForm((f) => ({ ...f, name: '' }))
      loadLocalities()
      loadCities()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const statCards = statEntries(stats)

  return (
    <div>
      <AdminHeader title="Locations" description="Manage cities and localities across the platform." />

      {statCards.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {statCards.slice(0, 8).map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
        </div>
      )}

      <form onSubmit={submit} className="card mb-6 flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-[180px] flex-1">
          <label htmlFor="loc-name" className="label">New locality name</label>
          <input id="loc-name" className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Indiranagar" />
        </div>
        <div className="min-w-[180px]">
          <label htmlFor="loc-city" className="label">City</label>
          <select id="loc-city" className="input" required value={form.cityId} onChange={(e) => setForm((f) => ({ ...f, cityId: e.target.value }))}>
            {cities.length === 0 && <option value="">No cities</option>}
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary btn-sm" disabled={saving || !form.cityId}>
          {saving ? 'Adding…' : 'Add locality'}
        </button>
      </form>

      {notice && <p className="mb-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success">{notice}</p>}

      <h2 className="mb-3 font-display text-lg font-semibold">Cities</h2>
      <AdminTable
        rows={cities}
        loading={loadingCities} error={error} onRetry={loadCities}
        emptyTitle="No cities" emptyDescription="No cities have been configured yet."
        columns={[
          { key: 'name', label: 'City', render: (c) => <span className="font-medium">{c.name}</span> },
          { key: 'state', label: 'State', render: (c) => c.state || '—' },
          { key: 'users', label: 'Users', render: (c) => c.userCount ?? '—' },
          { key: 'localities', label: 'Localities', render: (c) => c.localityCount ?? '—' },
        ]}
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">Localities</h2>
        <select className="input max-w-[220px]" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="">All cities</option>
          {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="mt-3">
        <AdminTable
          rows={localities}
          loading={loadingLocalities} error={error} onRetry={loadLocalities}
          emptyTitle="No localities" emptyDescription="No localities match the selected city."
          columns={[
            { key: 'name', label: 'Locality', render: (l) => <span className="font-medium">{l.name}</span> },
            { key: 'city', label: 'City', render: (l) => l.cityName || '—' },
            { key: 'users', label: 'Users', render: (l) => l.userCount ?? '—' },
          ]}
        />
      </div>
    </div>
  )
}
