import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Loader from '@/components/common/Loader';
import { LanguageDonutChart } from '@/components/charts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/utils/helpers';
import { formatPercent } from '@/utils/formatters';

export default function LanguageDistributionPage() {
  const { languages, isLoading, error } = useAnalytics();

  const columns = [
    { key: 'language', header: 'Language', render: row => <span className="font-medium text-slate-900 dark:text-slate-100">{row.language}</span> },
    { key: 'users', header: 'Users', render: row => formatNumber(row.users) },
    {
      key: 'percentage',
      header: 'Share',
      render: row => (
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(row.percentage, 100)}%` }} />
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-300">{formatPercent(row.percentage)}</span>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Language Distribution"
        description="Registered users grouped by mother tongue."
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <Loader label="Loading language data…" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <LanguageDonutChart data={languages} />
          </div>

          <div className="card mt-6 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Breakdown by language</h3>
            <div className="mt-4">
              <DataTable
                columns={columns}
                rows={languages}
                rowKey={row => row.language}
                emptyTitle="No language data"
                emptyDescription="Language distribution data is not available yet."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
