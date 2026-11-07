import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Loader from '@/components/common/Loader';
import { UserGrowthLineChart } from '@/components/charts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/utils/helpers';

export default function UserGrowthPage() {
  const { userGrowth, isLoading, error } = useAnalytics();

  const recentPoints = userGrowth.slice(-10).reverse();

  const columns = [
    { key: 'date', header: 'Date', render: row => row.date },
    { key: 'users', header: 'Total users', render: row => formatNumber(row.users) },
    { key: 'activeUsers', header: 'Daily active', render: row => formatNumber(row.activeUsers) },
    { key: 'posts', header: 'Posts', render: row => formatNumber(row.posts) },
    { key: 'connections', header: 'Connections', render: row => formatNumber(row.connections) }
  ];

  return (
    <div>
      <PageHeader
        title="User Growth"
        description="Total registrations vs daily active users over the last 30 days."
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <Loader label="Loading user growth…" />
      ) : (
        <>
          <UserGrowthLineChart data={userGrowth} />

          <div className="card mt-6 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent growth points</h3>
            <p className="mt-0.5 text-xs text-slate-500">Last 10 days, most recent first.</p>
            <div className="mt-4">
              <DataTable
                columns={columns}
                rows={recentPoints}
                rowKey={row => row.date}
                emptyTitle="No growth data"
                emptyDescription="User growth data is not available yet."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
