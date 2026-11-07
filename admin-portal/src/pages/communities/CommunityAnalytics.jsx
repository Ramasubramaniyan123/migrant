import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import Loader from '@/components/common/Loader';
import { communityService } from '@/services/communityService';
import { formatNumber } from '@/utils/helpers';

function StatCard({ label, value, icon }) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function CommunityAnalytics() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    communityService.getStats()
      .then(setStats)
      .catch(err => setError(err?.message ?? 'Failed to load stats'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader size="sm" label="Loading analytics…" />;
  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>;
  if (!stats) return null;

  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-slate-900">Platform overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total communities" value={formatNumber(stats.total ?? 0)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Active" value={formatNumber(stats.active ?? 0)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Total members" value={formatNumber(stats.totalMembers ?? 0)} icon={<Users className="h-5 w-5" />} />
      </div>
      {stats.byType && Object.keys(stats.byType).length > 0 ? (
        <div className="card mt-4 flex flex-wrap items-center gap-2 p-4">
          <span className="text-sm font-medium text-slate-600">By type:</span>
          {Object.entries(stats.byType).map(([type, count]) => (
            <StatusBadge key={type} tone="blue">
              {type}: {formatNumber(count)}
            </StatusBadge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
