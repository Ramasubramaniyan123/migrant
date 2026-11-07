import ActivityFeed from '@/components/widgets/ActivityFeed';

export default function PlatformActivity({ items }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Recent Activity
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Latest events across the platform
      </p>
      <div className="mt-4">
        <ActivityFeed items={items ?? []} />
      </div>
    </div>
  );
}
