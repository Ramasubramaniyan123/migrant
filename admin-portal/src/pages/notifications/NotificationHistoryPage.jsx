import { useCallback, useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { notificationService } from '@/services/notificationService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';
import { formatNumber } from '@/utils/helpers';
import { audienceLabel, notificationTypeLabel } from './NotificationsPage';

const TYPE_TONES = {
  ANNOUNCEMENT: 'blue',
  MAINTENANCE: 'amber',
  POLICY: 'purple',
  EVENT: 'cyan'
};

const STATUS_TONES = {
  SENT: 'green',
  DRAFT: 'gray',
  SCHEDULED: 'amber'
};

export default function NotificationHistoryPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setNotifications(await notificationService.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notification history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const columns = [
    {
      key: 'title',
      header: 'Notification',
      render: row => (
        <div className="min-w-0">
          <span className="block truncate font-medium text-slate-900 dark:text-slate-100">{row.title}</span>
          <span className="block truncate text-xs text-slate-500">{row.body}</span>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: row => <StatusBadge tone={TYPE_TONES[row.type] ?? 'gray'}>{notificationTypeLabel(row.type)}</StatusBadge>
    },
    { key: 'audience', header: 'Audience', render: row => audienceLabel(row.audience) },
    { key: 'sentBy', header: 'Sent by', render: row => row.sentBy },
    { key: 'recipients', header: 'Recipients', render: row => formatNumber(row.recipientCount) },
    { key: 'sentAt', header: 'Sent at', render: row => (row.sentAt ? formatDateTime(row.sentAt) : '—') },
    {
      key: 'status',
      header: 'Status',
      render: row => <StatusBadge tone={STATUS_TONES[row.status] ?? 'gray'} dot>{row.status}</StatusBadge>
    }
  ];

  return (
    <div>
      <PageHeader
        title="Notification History"
        description="All notifications that have been broadcast to users."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Notifications', to: ADMIN_ROUTES.notifications },
          { label: 'History' }
        ]}
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="card p-5">
        <DataTable
          columns={columns}
          rows={notifications}
          rowKey={row => row.id}
          isLoading={isLoading}
          error={error}
          emptyTitle="No notifications"
          emptyDescription="No notifications have been sent yet."
        />
      </div>
    </div>
  );
}
