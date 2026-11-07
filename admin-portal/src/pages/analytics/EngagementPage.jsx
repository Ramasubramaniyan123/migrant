import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/widgets/StatCard';
import DataTable from '@/components/common/DataTable';
import Loader from '@/components/common/Loader';
import { EngagementAreaChart } from '@/components/charts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Activity, FileText, Link2, Users } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { formatPercent } from '@/utils/formatters';

export default function EngagementPage() {
  const { userGrowth, engagement, isLoading, error } = useAnalytics();

  // Weekly summary derived from the last 7 days of growth data.
  const weekly = userGrowth.slice(-7);
  const weeklySummary = {
    days: weekly.length,
    avgDailyActive: weekly.length ? Math.round(weekly.reduce((s, d) => s + d.activeUsers, 0) / weekly.length) : 0,
    totalPosts: weekly.reduce((s, d) => s + d.posts, 0),
    totalConnections: weekly.reduce((s, d) => s + d.connections, 0),
    avgPostsPerDay: weekly.length ? Math.round((weekly.reduce((s, d) => s + d.posts, 0) / weekly.length) * 10) / 10 : 0,
    avgConnectionsPerDay: weekly.length ? Math.round((weekly.reduce((s, d) => s + d.connections, 0) / weekly.length) * 10) / 10 : 0,
    activeRate: weekly.length && weekly[weekly.length - 1].users
      ? formatPercent((weekly[weekly.length - 1].activeUsers / weekly[weekly.length - 1].users) * 100)
      : '—'
  };

  const weeklyColumns = [
    { key: 'metric', header: 'Metric', render: () => 'Last 7 days' },
    { key: 'avgActive', header: 'Avg daily active users', render: () => formatNumber(weeklySummary.avgDailyActive) },
    { key: 'totalPosts', header: 'Total posts', render: () => formatNumber(weeklySummary.totalPosts) },
    { key: 'totalConnections', header: 'Total connections', render: () => formatNumber(weeklySummary.totalConnections) },
    { key: 'avgPosts', header: 'Avg posts / day', render: () => weeklySummary.avgPostsPerDay },
    { key: 'avgConnections', header: 'Avg connections / day', render: () => weeklySummary.avgConnectionsPerDay },
    { key: 'activeRate', header: 'Active rate (latest day)', render: () => weeklySummary.activeRate }
  ];

  return (
    <div>
      <PageHeader
        title="Engagement"
        description="How actively the community is using the platform."
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading || !engagement ? (
        <Loader label="Loading engagement…" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Daily Active Users" value={engagement.dailyActiveUsers} icon={<Activity className="h-5 w-5" />} />
            <StatCard label="Weekly Active Users" value={engagement.weeklyActiveUsers} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Monthly Active Users" value={engagement.monthlyActiveUsers} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Avg Posts / User" value={engagement.avgPostsPerUser} icon={<FileText className="h-5 w-5" />} />
            <StatCard label="Avg Connections / User" value={engagement.avgConnectionsPerUser} icon={<Link2 className="h-5 w-5" />} />
            <StatCard label="7-Day Retention" value={formatPercent(engagement.retentionDay7)} icon={<Activity className="h-5 w-5" />} />
            <StatCard label="30-Day Retention" value={formatPercent(engagement.retentionDay30)} icon={<Activity className="h-5 w-5" />} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <EngagementAreaChart data={userGrowth} dataKey="posts" name="Posts" />
            <EngagementAreaChart data={userGrowth} dataKey="connections" name="Connections" />
          </div>

          <div className="card mt-6 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Weekly summary</h3>
            <p className="mt-0.5 text-xs text-slate-500">Aggregated from the last 7 days of activity data.</p>
            <div className="mt-4">
              <DataTable
                columns={weeklyColumns}
                rows={[{ metric: 'last-7-days' }]}
                rowKey={() => 'weekly'}
                emptyTitle="No weekly data"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
