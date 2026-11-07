import { CityBarChart } from '@/components/charts';

export default function LocationAnalytics({ data }) {
  return <CityBarChart data={data ?? []} />;
}
