import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Loader from '@/components/common/Loader';
import { CityBarChart } from '@/components/charts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/utils/helpers';
import { formatPercent } from '@/utils/formatters';

export default function GeographicDistributionPage() {
  const { cities, isLoading, error } = useAnalytics();

  const columns = [
    { key: 'city', header: 'City', render: row => <span className="font-medium text-slate-900 dark:text-slate-100">{row.city}</span> },
    { key: 'users', header: 'Users', render: row => formatNumber(row.users) },
    { key: 'percentage', header: 'Share', render: row => formatPercent(row.percentage) },
    {
      key: 'bar',
      header: 'Distribution',
      render: row => (
        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(row.percentage, 100)}%` }} />
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Geographic Distribution"
        description="Registered users grouped by city."
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <Loader label="Loading geographic data…" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <CityBarChart data={cities} />
          </div>

          <div className="card mt-6 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Breakdown by city</h3>
            <div className="mt-4">
              <DataTable
                columns={columns}
                rows={cities}
                rowKey={row => row.city}
                emptyTitle="No geographic data"
                emptyDescription="Geographic distribution data is not available yet."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
