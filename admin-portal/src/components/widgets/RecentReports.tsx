import { Link } from 'react-router-dom'
import { ArrowRight, Flag } from 'lucide-react'
import type { Report } from '@/types/moderation.types'
import { ADMIN_ROUTES } from '@/utils/constants'
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge'
import { formatRelativeTime } from '@/utils/formatters'
import { cn } from '@/utils/helpers'

const PRIORITY_DOT: Record<Report['priority'], string> = {
  LOW: 'bg-slate-300',
  MEDIUM: 'bg-amber-400',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
}

interface RecentReportsProps {
  reports: Report[]
}

export default function RecentReports({ reports }: RecentReportsProps) {
  if (reports.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">No pending reports — queue is clear</p>
  }
  return (
    <div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {reports.slice(0, 6).map((r) => (
          <li key={r.id}>
            <Link
              to={ADMIN_ROUTES.reportDetails(r.id)}
              className="flex items-center gap-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <span className={cn('h-2 w-2 shrink-0 rounded-full', PRIORITY_DOT[r.priority])} title={`Priority: ${r.priority}`} />
              <Flag className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{r.targetPreview}</p>
                <p className="text-xs text-slate-500">
                  {r.category.replace(/_/g, ' ')} · {r.reporterName}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge tone={statusTone(r.status)}>{statusLabel(r.status)}</StatusBadge>
                <span className="text-[11px] text-slate-400">{formatRelativeTime(r.createdAt)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={ADMIN_ROUTES.reports}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Open moderation queue <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
