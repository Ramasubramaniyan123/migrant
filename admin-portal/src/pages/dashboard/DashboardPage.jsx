import { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Loader from '@/components/common/Loader';
import { userService } from '@/services/userService';
import RecentUsers from '@/components/widgets/RecentUsers';
import RecentReports from '@/components/widgets/RecentReports';
import QuickActions from '@/components/widgets/QuickActions';
import { useDashboard } from '@/hooks/useDashboard';
import OverviewCards from './OverviewCards';
import UserAnalytics from './UserAnalytics';
import LanguageAnalytics from './LanguageAnalytics';
import LocationAnalytics from './LocationAnalytics';
import PlatformActivity from './PlatformActivity';

function WidgetCard({ title, subtitle, children }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { overview, isLoading, error } = useDashboard();
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    userService
      .list({ pageSize: 5 })
      .then(result => {
        if (cancelled) return;
        const sorted = [...result.items].sort(
          (a, b) => new Date(b.joinedAt) - new Date(a.joinedAt)
        );
        setRecentUsers(sorted);
      })
      .catch(() => {
        if (!cancelled) setRecentUsers([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Platform overview, analytics and moderation queue at a glance"
      />

      {isLoading ? (
        <Loader label="Loading dashboard…" />
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
          <p className="mt-1 text-xs text-slate-500">
            Please refresh the page to try again.
          </p>
        </div>
      ) : overview ? (
        <div className="space-y-6">
          <OverviewCards statistics={overview.statistics} />

          <UserAnalytics userGrowth={overview.userGrowth} />

          <div className="grid gap-6 lg:grid-cols-2">
            <LanguageAnalytics data={overview.languageDistribution} />
            <LocationAnalytics data={overview.cityDistribution} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <WidgetCard title="Recent Users" subtitle="Newest registrations">
              <RecentUsers users={recentUsers} />
            </WidgetCard>
            <WidgetCard
              title="Pending Reports"
              subtitle={`${overview.statistics.pendingReports} awaiting review`}
            >
              <RecentReports reports={overview.pendingReports ?? []} />
            </WidgetCard>
            <WidgetCard title="Quick Actions">
              <QuickActions />
            </WidgetCard>
            <PlatformActivity items={overview.recentActivity} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
