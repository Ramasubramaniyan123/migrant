import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, Ban, RotateCcw } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import Loader from '@/components/common/Loader';
import { userService } from '@/services/userService';
import { formatDate } from '@/utils/formatters';

export default function UserModerationPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { user, action }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pending, suspended] = await Promise.all([
        userService.list({ status: 'PENDING_VERIFICATION', pageSize: 50 }),
        userService.list({ status: 'SUSPENDED', pageSize: 50 })
      ]);
      setPendingUsers(pending.items);
      setSuspendedUsers(suspended.items);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (user, action) => {
    setBusyId(user.id);
    setActionError(null);
    try {
      if (action === 'verify') await userService.verify(user.id);
      else if (action === 'suspend') await userService.suspend(user.id);
      else if (action === 'activate') await userService.activate(user.id);
      setConfirm(null);
      await load();
    } catch (err) {
      setActionError(err.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: u => (
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{u.fullName}</p>
          <p className="text-xs text-slate-400">{u.email}</p>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      render: u => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {u.currentCity}{u.currentLocality ? `, ${u.currentLocality}` : ''}
        </span>
      )
    },
    {
      key: 'language',
      header: 'Mother tongue',
      render: u => <span className="text-sm text-slate-600 dark:text-slate-400">{u.motherTongue}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: u => (
        <StatusBadge tone={statusTone(u.status)} dot>{statusLabel(u.status)}</StatusBadge>
      )
    },
    {
      key: 'joined',
      header: 'Joined',
      render: u => <span className="text-sm text-slate-500">{formatDate(u.joinedAt)}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-44',
      render: u => (
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          {u.status === 'PENDING_VERIFICATION' ? (
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
              onClick={() => runAction(u, 'verify')}
              isLoading={busyId === u.id}
            >
              Verify
            </Button>
          ) : null}
          {u.status === 'SUSPENDED' ? (
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={() => setConfirm({ user: u, action: 'activate' })}
              disabled={busyId === u.id}
            >
              Activate
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              leftIcon={<Ban className="h-3.5 w-3.5" />}
              onClick={() => setConfirm({ user: u, action: 'suspend' })}
              disabled={busyId === u.id}
            >
              Suspend
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="User moderation"
        description="Verify pending accounts and manage suspended users."
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {loading ? (
        <Loader label="Loading users…" />
      ) : (
        <div className="space-y-6">
          <div className="card">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Pending verification
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {pendingUsers.length} account{pendingUsers.length === 1 ? '' : 's'} awaiting review
              </p>
            </div>
            <DataTable
              columns={columns}
              rows={pendingUsers}
              rowKey={u => u.id}
              emptyTitle="No pending users"
              emptyDescription="All accounts have been verified."
            />
          </div>

          <div className="card">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Suspended users</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {suspendedUsers.length} suspended account{suspendedUsers.length === 1 ? '' : 's'}
              </p>
            </div>
            <DataTable
              columns={columns}
              rows={suspendedUsers}
              rowKey={u => u.id}
              emptyTitle="No suspended users"
              emptyDescription="No accounts are currently suspended."
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => runAction(confirm.user, confirm.action)}
        title={confirm?.action === 'suspend' ? 'Suspend user' : 'Activate user'}
        message={
          confirm?.action === 'suspend'
            ? `Suspend ${confirm.user.fullName}? They will lose access to the platform.`
            : `Reactivate ${confirm.user.fullName}? Their account will be restored to active status.`
        }
        confirmLabel={confirm?.action === 'suspend' ? 'Suspend' : 'Activate'}
        danger={confirm?.action === 'suspend'}
        isLoading={!!busyId}
      />
    </div>
  );
}
