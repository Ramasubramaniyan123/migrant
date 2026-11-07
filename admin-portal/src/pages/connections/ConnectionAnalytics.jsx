import { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { GenericBarChart } from '@/components/charts';
import Loader from '@/components/common/Loader';
import { connectionService } from '@/services/connectionService';

export default function ConnectionAnalytics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    connectionService.getStats()
      .then(setStats)
      .catch(err => setError(err.message || 'Failed to load analytics'));
  }, []);

  if (error) {
    return (
      <div>
        <PageHeader title="Connection analytics" />
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        <PageHeader title="Connection analytics" />
        <Loader label="Loading analytics…" />
      </div>
    );
  }

  const cityData = stats.connectionsByCity.map(c => ({ name: c.city, value: c.count }));
  const languageData = stats.connectionsByLanguage.map(l => ({ name: l.language, value: l.count }));

  return (
    <div>
      <PageHeader
        title="Connection analytics"
        description="Where connections happen across cities, languages and time."
        breadcrumbs={[
          { label: 'Connections', to: '/connections' },
          { label: 'Analytics' }
        ]}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <GenericBarChart
          data={cityData}
          dataKey="value"
          name="Connections by city"
          color="#2563eb"
          horizontal
        />
        <GenericBarChart
          data={languageData}
          dataKey="value"
          name="Connections by language"
          color="#8b5cf6"
        />
      </div>

      <div className="card mt-6 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Weekly connection trend</h3>
        <p className="mt-0.5 text-xs text-slate-500">Requests sent vs accepted over the last 8 weeks</p>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                <th className="th">Week</th>
                <th className="th">Requests sent</th>
                <th className="th">Accepted</th>
                <th className="th">Acceptance rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.weeklyTrend.map(w => (
                <tr key={w.week}>
                  <td className="td font-medium text-slate-800 dark:text-slate-200">{w.week}</td>
                  <td className="td text-slate-600 dark:text-slate-400">{w.sent}</td>
                  <td className="td text-slate-600 dark:text-slate-400">{w.accepted}</td>
                  <td className="td text-slate-600 dark:text-slate-400">
                    {w.sent ? `${Math.round((w.accepted / w.sent) * 100)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
