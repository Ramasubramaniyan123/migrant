import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { userService } from '@/services/userService';
import { formatDate } from '@/utils/formatters';

export default function UserVerificationPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // user awaiting verify confirmation

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.list({ status: 'PENDING_VERIFICATION', page: 1, pageSize: 50 });
      setRows(result.items.filter(u => !u.isVerified));
    } catch (err) {
      setError(err?.message ?? 'Failed to load verification queue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirm = async () => {
    if (!pending) return;
    await userService.verify(pending.id);
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
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
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
    { key: 'language', header: 'Language', render: u => u.motherTongue ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: u => <StatusBadge tone={statusTone(u.status)}>{statusLabel(u.status)}</StatusBadge>
    },
    { key: 'joined', header: 'Joined', render: u => formatDate(u.joinedAt) },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: u => (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ShieldCheck className="h-4 w-4" />}
          onClick={() => setPending(u)}
        >
          Verify
        </Button>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="User verification"
        description="Review and verify pending user accounts."
      />

      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={u => u.id}
          isLoading={isLoading}
          error={error}
          emptyTitle="Queue is clear"
          emptyDescription="There are no users pending verification."
        />
      </div>

      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title="Verify user"
        message={`Mark ${pending?.fullName} as a verified user?`}
        confirmLabel="Verify"
      />
    </div>
  );
}
