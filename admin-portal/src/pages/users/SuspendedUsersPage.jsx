import { useCallback, useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { userService } from '@/services/userService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import { UserCheck } from 'lucide-react';

export default function SuspendedUsersPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // user awaiting activate confirmation

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.list({ status: 'SUSPENDED', page: 1, pageSize: 50 });
      setRows(result.items);
    } catch (err) {
      setError(err?.message ?? 'Failed to load suspended users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirm = async () => {
    if (!pending) return;
    await userService.activate(pending.id);
    setPending(null);
    await load();
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: u => (
        <div className="flex items-center gap-3">
          {u.avatarUrl ? (
            <img src={u.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700">
              {u.fullName?.charAt(0) ?? '?'}
            </div>
          )}
          <div>
            <p className="font-medium text-slate-900">{u.fullName}</p>
            <p className="text-xs text-slate-500">{u.email}</p>
          </div>
        </div>
      )
    },
    { key: 'city', header: 'City', render: u => u.currentCity ?? '—' },
    { key: 'reason', header: 'Reason', render: () => 'Policy violation' },
    { key: 'suspended', header: 'Suspended', render: u => formatDate(u.lastActiveAt ?? u.joinedAt) },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: u => (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<UserCheck className="h-4 w-4" />}
          onClick={() => setPending(u)}
        >
          Activate
        </Button>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Suspended users"
        description="Accounts that have been suspended and may be reactivated."
        breadcrumbs={[
          { label: 'Users', to: ADMIN_ROUTES.users },
          { label: 'Suspended' }
        ]}
      />

      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={u => u.id}
          isLoading={isLoading}
          error={error}
          emptyTitle="No suspended users"
          emptyDescription="There are currently no suspended accounts."
        />
      </div>

      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title="Activate user"
        message={`Reactivate ${pending?.fullName}? They will regain full access to the app.`}
        confirmLabel="Activate"
      />
    </div>
  );
}
