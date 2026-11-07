import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import { userService } from '@/services/userService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';
import { cn } from '@/utils/helpers';

const TYPE_TONES = {
  LOGIN: 'blue',
  POST: 'green',
  COMMENT: 'cyan',
  REPORT: 'amber',
  PROFILE_UPDATE: 'purple',
  COMMUNITY_JOIN: 'green',
  DEFAULT: 'gray'
};

export default function UserActivityPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [u, a] = await Promise.all([userService.getById(id), userService.getActivity(id)]);
      setUser(u);
      setActivity(a);
    } catch (err) {
      setError(err?.message ?? 'Failed to load activity');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <PageHeader
        title={user ? `${user.fullName} — Activity` : 'User activity'}
        description="Recent actions performed by this user."
        breadcrumbs={[
          { label: 'Users', to: ADMIN_ROUTES.users },
          { label: user?.fullName ?? 'User', to: ADMIN_ROUTES.userDetails(id) },
          { label: 'Activity' }
        ]}
      />

      {isLoading ? (
        <Loader label="Loading activity…" />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : activity.length === 0 ? (
        <EmptyState title="No activity yet" description="This user has no recorded activity." />
      ) : (
        <div className="card p-6">
          <ol className="relative space-y-6 border-l border-slate-200 pl-6">
            {activity.map(entry => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 shadow" aria-hidden="true" />
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={TYPE_TONES[entry.type] ?? TYPE_TONES.DEFAULT}>
                    {entry.type?.replace(/_/g, ' ')}
                  </StatusBadge>
                  <span className={cn('text-xs text-slate-400')}>{formatDateTime(entry.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{entry.description}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
