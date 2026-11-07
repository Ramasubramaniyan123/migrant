import { LanguageDonutChart } from '@/components/charts';

export default function LanguageAnalytics({ data }) {
  return <LanguageDonutChart data={data ?? []} />;
}
