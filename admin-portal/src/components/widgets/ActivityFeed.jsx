import { formatRelativeTime } from '@/utils/formatters';
import { cn } from '@/utils/helpers';
const TYPE_STYLES = {
  USER_JOINED: {
    dot: 'bg-emerald-500',
    label: 'User joined'
  },
  COMMUNITY_CREATED: {
    dot: 'bg-blue-500',
    label: 'Community'
  },
  POST_CREATED: {
    dot: 'bg-violet-500',
    label: 'Post'
  },
  REPORT_FILED: {
    dot: 'bg-amber-500',
    label: 'Report'
  },
  ADMIN_ACTION: {
    dot: 'bg-slate-400',
    label: 'Admin'
  }
};
export default function ActivityFeed({
  items,
  className
}) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">No recent activity</p>;
  }
  return <ul className={cn('space-y-3', className)}>
      {items.map(item => <li key={item.id} className="flex items-start gap-3">
          <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', TYPE_STYLES[item.type].dot)} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-700 dark:text-slate-300">{item.description}</p>
            <p className="text-xs text-slate-400">
              {TYPE_STYLES[item.type].label} · {formatRelativeTime(item.createdAt)}
            </p>
          </div>
        </li>)}
    </ul>;
}
