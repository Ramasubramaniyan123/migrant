import { useMemo, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { fullName } from '@/services/userService';
import { formatRelativeTime } from '@/utils/formatters';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
/** Seed reports — mock moderation queue for the prototype. */
const SEED_REPORTS = [{
  id: 1,
  reporterId: 5,
  targetUserId: 3,
  reason: 'Spam',
  details: 'Repeated job-posting links in the community feed.',
  status: 'OPEN',
  createdAt: '2026-11-04T07:20:00Z'
}, {
  id: 2,
  reporterId: 10,
  targetUserId: 7,
  reason: 'Harassment',
  details: 'Unwanted repeated connection requests after being declined.',
  status: 'OPEN',
  createdAt: '2026-11-03T19:05:00Z'
}, {
  id: 3,
  reporterId: 2,
  targetUserId: 12,
  reason: 'Inappropriate content',
  details: 'Profile bio flagged by a community moderator.',
  status: 'RESOLVED',
  createdAt: '2026-11-01T11:40:00Z'
}, {
  id: 4,
  reporterId: 9,
  targetUserId: 4,
  reason: 'Fake profile',
  details: 'Suspected duplicate account sharing the same photos.',
  status: 'DISMISSED',
  createdAt: '2026-10-29T15:10:00Z'
}];
const STATUS_VARIANTS = {
  OPEN: 'warning',
  RESOLVED: 'success',
  DISMISSED: 'neutral'
};

/** Moderation queue for abuse reports. */
export default function ReportManagement() {
  const {
    users,
    isLoading
  } = useUsers();
  const [reports, setReports] = useState(SEED_REPORTS);
  const [filter, setFilter] = useState('OPEN');
  const nameOf = id => {
    const user = users.find(row => row.id === id);
    return user ? fullName(user) : `Member #${id}`;
  };
  const rows = useMemo(() => filter === 'ALL' ? reports : reports.filter(report => report.status === filter), [filter, reports]);
  const setStatus = (id, status) => {
    setReports(prev => prev.map(report => report.id === id ? {
      ...report,
      status
    } : report));
  };
  const filters = ['OPEN', 'RESOLVED', 'DISMISSED', 'ALL'];
  return <div className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <h1 className="page-title">Reports</h1>
        <p className="muted mt-1">
          {reports.filter(report => report.status === 'OPEN').length} open reports awaiting review
        </p>
      </header>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {filters.map(value => <button key={value} type="button" onClick={() => setFilter(value)} className={'whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition ' + (filter === value ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
            {value === 'ALL' ? 'All' : value.charAt(0) + value.slice(1).toLowerCase()}
          </button>)}
      </div>

      {isLoading ? <Loader label="Loading reports…" /> : rows.length === 0 ? <EmptyState title="Nothing to review" description="No reports match this filter." /> : <ul className="space-y-3">
          {rows.map(report => <li key={report.id} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-900">{report.reason}</h2>
                    <Badge variant={STATUS_VARIANTS[report.status]} size="sm">
                      {report.status}
                    </Badge>
                  </div>
                  <p className="muted mt-1">{report.details}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {formatRelativeTime(report.createdAt)}
                </span>
              </div>

              <dl className="grid gap-2 text-xs sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Reported member</dt>
                  <dd className="font-medium text-slate-800">{nameOf(report.targetUserId)}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Reported by</dt>
                  <dd className="font-medium text-slate-800">{nameOf(report.reporterId)}</dd>
                </div>
              </dl>

              {report.status === 'OPEN' ? <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <Button size="sm" onClick={() => setStatus(report.id, 'RESOLVED')}>
                    Mark resolved
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setStatus(report.id, 'DISMISSED')}>
                    Dismiss
                  </Button>
                </div> : null}
            </li>)}
        </ul>}
    </div>;
}
