import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import StatCard from '@/components/widgets/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { notificationService } from '@/services/notificationService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';
import { formatNumber } from '@/utils/helpers';
import { Bell, History, Mail, Send } from 'lucide-react';

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

export function audienceLabel(audience) {
  return (audience ?? '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export function notificationTypeLabel(type) {
  return (type ?? '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [list, statsResult] = await Promise.all([
        notificationService.list(),
        notificationService.getStats()
      ]);
      setNotifications(list);
      setStats(statsResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
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
        title="Notifications"
        description="Broadcast announcements and messages to platform users."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Notifications' }
        ]}
        actions={
          <>
            <Button variant="secondary" leftIcon={<History className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.notificationHistory)}>
              History
            </Button>
            <Button leftIcon={<Send className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.sendNotification)}>
              Send notification
            </Button>
          </>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {stats ? (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Notifications sent" value={stats.totalSent} icon={<Send className="h-5 w-5" />} />
          <StatCard label="Total recipients" value={stats.totalRecipients} icon={<Mail className="h-5 w-5" />} />
          <StatCard label="Drafts" value={stats.drafts} icon={<Bell className="h-5 w-5" />} />
        </div>
      ) : null}

      <div className="card p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Recent notifications</h3>
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

      <p className="mt-4 text-sm">
        <Link to={ADMIN_ROUTES.notificationHistory} className="text-blue-600 hover:underline">
          View full notification history →
        </Link>
      </p>
    </div>
  );
}
