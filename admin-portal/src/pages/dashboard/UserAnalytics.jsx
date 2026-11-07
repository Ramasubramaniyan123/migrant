import { UserGrowthLineChart, EngagementAreaChart } from '@/components/charts';

export default function UserAnalytics({ userGrowth }) {
  const data = userGrowth ?? [];
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <UserGrowthLineChart data={data} />
      <EngagementAreaChart data={data} dataKey="posts" name="Posts" />
    </div>
  );
}
