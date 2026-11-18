import { useEffect, useState } from 'react'
import { adminAnalyticsService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States'
import { AdminHeader, StatCard, asArray } from '../components/AdminUI'
import { BarChart, PieChart } from '../charts/Charts'

const pickName = (item) => item?.name ?? item?.language ?? item?.city ?? item?.label ?? item?.key ?? 'Unknown'
const pickValue = (item) =>
  item?.users ?? item?.count ?? item?.value ?? item?.percentage ?? item?.total ?? 0

// Normalise any distribution array into { name, users, value } so both
// BarChart (dataKey="users") and PieChart (dataKey="value") can consume it.
const toDist = (data) => asArray(data).map((item) => {
  const name = pickName(item)
  const v = Number(pickValue(item)) || 0
  return { name: String(name), users: v, value: v }
})

const toMetrics = (engagement) => {
  if (!engagement || typeof engagement !== 'object') return []
  const source = engagement instanceof Map ? Object.fromEntries(engagement) : engagement
  return Object.entries(source)
    .filter(([, v]) => typeof v === 'number')
    .map(([k, v]) => ({ label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()), value: v }))
}

const Section = ({ title, children }) => (
  <section className="card p-6">
    <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
    {children}
  </section>
)

export const Analytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([
      adminAnalyticsService.users(),
      adminAnalyticsService.languages(),
      adminAnalyticsService.locations(),
      adminAnalyticsService.engagement(),
    ])
      .then(([users, languages, locations, engagement]) =>
        setData({ users, languages, locations, engagement }))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />

  const userDist = toDist(data?.users)
  const langDist = toDist(data?.languages)
  const locDist = toDist(data?.locations)
  const metrics = toMetrics(data?.engagement)

  return (
    <div>
      <AdminHeader title="Analytics" description="Platform growth, language and location distributions, and engagement." />

      {metrics.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => <StatCard key={m.label} label={m.label} value={m.value} />)}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Users analytics">
          {userDist.length === 0 ? <EmptyState title="No data" /> : <BarChart data={userDist} />}
        </Section>
        <Section title="Languages">
          {langDist.length === 0 ? <EmptyState title="No data" /> : <PieChart data={langDist} />}
        </Section>
        <Section title="Locations">
          {locDist.length === 0 ? <EmptyState title="No data" /> : <BarChart data={locDist} />}
        </Section>
        <Section title="Engagement details">
          {metrics.length === 0 ? (
            <EmptyState title="No data" />
          ) : (
            <ul className="divide-y divide-line">
              {metrics.map((m) => (
                <li key={m.label} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-ink-2">{m.label}</span>
                  <span className="font-medium">{m.value}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}
