import { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/widgets/StatCard';
import DataTable from '@/components/common/DataTable';
import Loader from '@/components/common/Loader';
import { analyticsService } from '@/services/analyticsService';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Repeat, Users } from 'lucide-react';
import { formatNumber } from '@/utils/helpers';
import { formatPercent } from '@/utils/formatters';

export default function RetentionPage() {
  const { engagement, isLoading: engagementLoading, error: engagementError } = useAnalytics();
  const [cohorts, setCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    analyticsService.getRetentionCohorts()
      .then(data => {
        if (!cancelled) setCohorts(data);
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load retention data');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const combinedError = error ?? engagementError;
  const loading = isLoading || engagementLoading;

  const pct = value => (value === null || value === undefined ? '—' : formatPercent(value));

  const columns = [
    { key: 'cohort', header: 'Cohort', render: row => <span className="font-medium text-slate-900 dark:text-slate-100">{row.cohort}</span> },
    { key: 'size', header: 'Size', render: row => formatNumber(row.size) },
    { key: 'day1', header: 'Day 1', render: row => pct(row.day1) },
    { key: 'day7', header: 'Day 7', render: row => pct(row.day7) },
    { key: 'day30', header: 'Day 30', render: row => pct(row.day30) }
  ];

  return (
    <div>
      <PageHeader
        title="Retention"
        description="How well the platform retains users over time, by signup cohort."
      />

      {combinedError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {combinedError}
        </div>
      ) : null}

      {loading ? (
        <Loader label="Loading retention data…" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="7-Day Retention" value={engagement ? formatPercent(engagement.retentionDay7) : '—'} icon={<Repeat className="h-5 w-5" />} hint="Users still active after 7 days" />
            <StatCard label="30-Day Retention" value={engagement ? formatPercent(engagement.retentionDay30) : '—'} icon={<Repeat className="h-5 w-5" />} hint="Users still active after 30 days" />
            <StatCard label="Cohorts tracked" value={cohorts.length} icon={<Users className="h-5 w-5" />} hint="Signup cohorts" />
            <StatCard label="Latest cohort size" value={cohorts.length ? cohorts[cohorts.length - 1].size : '—'} icon={<Users className="h-5 w-5" />} hint="Most recent signup week" />
          </div>

          <div className="card mt-6 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Retention by cohort</h3>
            <p className="mt-0.5 text-xs text-slate-500">Percentage of each cohort still active 1, 7 and 30 days after signup.</p>
            <div className="mt-4">
              <DataTable
                columns={columns}
                rows={cohorts}
                rowKey={row => row.cohort}
                emptyTitle="No retention data"
                emptyDescription="Cohort retention data is not available yet."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
