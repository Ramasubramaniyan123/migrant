import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronRight
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/widgets/StatCard';
import { GenericBarChart } from '@/components/charts';
import Loader from '@/components/common/Loader';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { moderationService } from '@/services/moderationService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatters';

const SUB_PAGES = [
  { to: ADMIN_ROUTES.reports, label: 'All reports', description: 'Review and triage every reported item' },
  { to: ADMIN_ROUTES.postModeration, label: 'Post moderation', description: 'Moderate flagged community posts' },
  { to: ADMIN_ROUTES.userModeration, label: 'User moderation', description: 'Verify and review user accounts' },
  { to: ADMIN_ROUTES.blockedContent, label: 'Blocked content', description: 'Manage blocked or removed content' },
  { to: ADMIN_ROUTES.moderationHistory, label: 'Moderation history', description: 'Audit log of past moderation actions' },
  { to: ADMIN_ROUTES.flaggedPosts, label: 'Flagged posts', description: 'Quick view of flagged posts' }
];

export default function ModerationDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        moderationService.getModerationStats(),
        moderationService.listReports({ status: 'PENDING', pageSize: 5 })
      ]);
      setStats(statsRes);
      setPending(pendingRes.items);
    } catch (err) {
      setError(err.message || 'Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categoryData = stats
    ? Object.entries(stats.byCategory).map(([name, value]) => ({ name: statusLabel(name), value }))
    : [];

  return (
    <div>
      <PageHeader
        title="Moderation"
        description="Triage reports, review flagged content and keep the community safe."
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading && !stats ? (
        <Loader label="Loading moderation stats…" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Pending reports"
              value={stats?.pending ?? 0}
              icon={<ShieldAlert className="h-5 w-5" />}
              hint="Awaiting triage"
            />
            <StatCard
              label="Under review"
              value={stats?.underReview ?? 0}
              icon={<Eye className="h-5 w-5" />}
              hint="Assigned to moderators"
            />
            <StatCard
              label="Resolved"
              value={stats?.resolvedThisWeek ?? 0}
              icon={<CheckCircle2 className="h-5 w-5" />}
              hint="This period"
            />
            <StatCard
              label="Dismissed"
              value={stats?.dismissedThisWeek ?? 0}
              icon={<XCircle className="h-5 w-5" />}
              hint="This period"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <div className="card">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Pending reports
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">Newest items awaiting review</p>
                </div>
                {loading ? (
                  <div className="p-5">
                    <Loader label="Loading…" />
                  </div>
                ) : pending.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-500">
                    No pending reports. Queue is clear.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pending.map(r => (
                      <li key={r.id}>
                        <Link
                          to={ADMIN_ROUTES.reportDetails(r.id)}
                          className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <StatusBadge tone={statusTone(r.priority)} dot>
                                {statusLabel(r.priority)}
                              </StatusBadge>
                              <span className="text-xs text-slate-400">{r.category}</span>
                            </div>
                            <p className="mt-1 truncate text-sm text-slate-700 dark:text-slate-300">
                              {r.targetPreview}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {r.reporterName} · {formatRelativeTime(r.createdAt)}
                            </p>
                          </div>
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                  <Link
                    to={ADMIN_ROUTES.reports}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View all reports →
                  </Link>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2">
              <GenericBarChart
                data={categoryData}
                dataKey="value"
                name="Reports by category"
                color="#f59e0b"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SUB_PAGES.map(page => (
              <Link
                key={page.to}
                to={page.to}
                className="card group flex items-center justify-between p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100">
                    {page.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{page.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
