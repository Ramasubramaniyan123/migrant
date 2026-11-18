import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminDashboardService } from '../../../services/admin/adminService'
import { errorMessage } from '../../../services/api/apiClient'
import { LoadingState, ErrorState } from '../../../components/ui/States'
import { AdminHeader, StatCard, StatusBadge } from '../components/AdminUI'
import { BarChart, PieChart } from '../charts/Charts'
import { formatDateTime } from '../../../utils/format'

export const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    adminDashboardService.overview()
      .then(setData)
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={load} />
  const stats = data?.statistics || {}

  return (
    <div>
      <AdminHeader title="Dashboard" description="Platform overview at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.totalUsers} />
        <StatCard label="Active users" value={stats.activeUsers} />
        <StatCard label="Communities" value={stats.totalCommunities} />
        <StatCard label="Pending reports" value={stats.pendingReports} />
        <StatCard label="Posts" value={stats.totalPosts} />
        <StatCard label="Connections" value={stats.totalConnections} />
        <StatCard label="Messages" value={stats.totalMessages} />
        <StatCard label="New today" value={stats.newRegistrationsToday} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">User growth</h2>
          <BarChart data={(data?.userGrowth || []).map((p) => ({ name: p.date, users: p.users }))} />
        </section>
        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Languages</h2>
          <PieChart data={(data?.languageDistribution || []).map((l) => ({ name: l.language, value: l.users }))} />
        </section>
        <section className="card p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold">Recent activity</h2>
          {(data?.recentActivity || []).length === 0 ? (
            <p className="text-sm text-ink-3">No recent activity.</p>
          ) : (
            <ul className="divide-y divide-line">
              {(data.recentActivity || []).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{a.description}</span>
                  <span className="text-xs text-ink-3">{a.actorName} · {formatDateTime(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Pending reports</h2>
            <Link to="/admin/moderation" className="link text-sm">Open moderation</Link>
          </div>
          {(data?.pendingReports || []).length === 0 ? (
            <p className="text-sm text-ink-3">No pending reports.</p>
          ) : (
            <ul className="divide-y divide-line">
              {(data.pendingReports || []).map((r) => (
                <li key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="truncate">{r.targetPreview || `${r.targetType} #${r.targetId}`}</span>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
