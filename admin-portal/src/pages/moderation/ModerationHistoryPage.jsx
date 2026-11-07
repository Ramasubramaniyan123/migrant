import { useCallback, useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge, { statusLabel } from '@/components/common/StatusBadge';
import { moderationService } from '@/services/moderationService';
import { formatDateTime } from '@/utils/formatters';

const ACTION_TONE = {
  REMOVE_CONTENT: 'red',
  SUSPEND_USER: 'red',
  DISMISS: 'gray',
  WARN_USER: 'amber',
  RESTORE_CONTENT: 'green'
};

export default function ModerationHistoryPage() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await moderationService.listModerationActions();
      setActions(res);
    } catch (err) {
      setError(err.message || 'Failed to load moderation history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: a => <span className="text-sm text-slate-500">{formatDateTime(a.createdAt)}</span>
    },
    {
      key: 'admin',
      header: 'Admin',
      render: a => <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{a.adminName}</span>
    },
    {
      key: 'action',
      header: 'Action',
      render: a => (
        <StatusBadge tone={ACTION_TONE[a.action] ?? 'blue'} dot>
          {statusLabel(a.action)}
        </StatusBadge>
      )
    },
    {
      key: 'target',
      header: 'Target',
      render: a => (
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-300">{statusLabel(a.targetType)}</p>
          <p className="text-xs text-slate-400">{a.targetId}{a.reportId ? ` · report ${a.reportId}` : ''}</p>
        </div>
      )
    },
    {
      key: 'reason',
      header: 'Reason',
      render: a => (
        <p className="max-w-md truncate text-sm text-slate-600 dark:text-slate-400">{a.reason ?? '—'}</p>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Moderation history"
        description="Complete audit trail of moderation actions taken by administrators."
      />
      <div className="card">
        <DataTable
          columns={columns}
          rows={actions}
          rowKey={a => a.id}
          isLoading={loading}
          error={error}
          emptyTitle="No moderation actions"
          emptyDescription="Actions will appear here once moderators start working the queue."
        />
      </div>
    </div>
  );
}
