import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ADMIN_ROUTES } from '@/utils/constants';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { formatRelativeTime } from '@/utils/formatters';
export default function RecentUsers({
  users
}) {
  return <div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {users.map(u => <li key={u.id}>
            <Link to={ADMIN_ROUTES.userDetails(u.id)} className="flex items-center gap-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
              {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {u.fullName.split(' ').map(p => p[0]).slice(0, 2).join('')}
                </span>}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{u.fullName}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {u.motherTongue} · {u.currentCity}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge tone={statusTone(u.status)}>{statusLabel(u.status)}</StatusBadge>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatRelativeTime(u.joinedAt)}</span>
              </div>
            </Link>
          </li>)}
      </ul>
      <Link to={ADMIN_ROUTES.users} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
        View all users <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>;
}
