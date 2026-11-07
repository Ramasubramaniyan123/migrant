import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/widgets/StatCard';
import Loader from '@/components/common/Loader';
import { UserGrowthLineChart, EngagementAreaChart, LanguageDonutChart, CityBarChart } from '@/components/charts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Activity, CalendarDays, CalendarRange, FileText, Link2, Repeat } from 'lucide-react';
import { formatPercent } from '@/utils/formatters';

export default function AnalyticsPage() {
  const { userGrowth, languages, cities, engagement, isLoading, error } = useAnalytics();

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Platform-wide engagement, growth and distribution metrics."
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading || !engagement ? (
        <Loader label="Loading analytics…" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Daily Active Users" value={engagement.dailyActiveUsers} icon={<Activity className="h-5 w-5" />} hint="Last 24 hours" />
            <StatCard label="Weekly Active Users" value={engagement.weeklyActiveUsers} icon={<CalendarDays className="h-5 w-5" />} hint="Last 7 days" />
            <StatCard label="Monthly Active Users" value={engagement.monthlyActiveUsers} icon={<CalendarRange className="h-5 w-5" />} hint="Last 30 days" />
            <StatCard label="Avg Posts / User" value={engagement.avgPostsPerUser} icon={<FileText className="h-5 w-5" />} hint="Per monthly active user" />
            <StatCard label="Avg Connections / User" value={engagement.avgConnectionsPerUser} icon={<Link2 className="h-5 w-5" />} hint="Per monthly active user" />
            <StatCard label="7-Day Retention" value={formatPercent(engagement.retentionDay7)} icon={<Repeat className="h-5 w-5" />} hint="Users still active after 7 days" />
            <StatCard label="30-Day Retention" value={formatPercent(engagement.retentionDay30)} icon={<Repeat className="h-5 w-5" />} hint="Users still active after 30 days" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <UserGrowthLineChart data={userGrowth} />
            <EngagementAreaChart data={userGrowth} dataKey="connections" name="Connections" />
            <LanguageDonutChart data={languages} />
            <CityBarChart data={cities} />
          </div>
        </>
      )}
    </div>
  );
}
