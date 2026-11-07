import { useCallback, useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { Select } from '@/components/common/Input';
import { auditService } from '@/services/auditService';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

export default function AdminActivityPage() {
  const { admin: currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(() => currentAdmin?.id ?? 'ALL');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    auditService.getFilterOptions()
      .then(opts => {
        setAdmins(opts.admins);
        // Default to the currently signed-in administrator when present in the options.
        if (currentAdmin?.id && !opts.admins.some(a => a.id === currentAdmin.id)) {
          setSelectedAdminId('ALL');
        }
      })
      .catch(() => undefined);
  }, [currentAdmin]);

  const load = useCallback(async adminId => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await auditService.list({ adminId, page: 1, pageSize: 50 });
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin activity');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(selectedAdminId);
  }, [selectedAdminId, load]);

  const columns = [
    { key: 'createdAt', header: 'Timestamp', render: row => formatDateTime(row.createdAt) },
    {
      key: 'action',
      header: 'Action',
      render: row => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{row.action}</code>
    },
    { key: 'target', header: 'Target', render: row => `${row.targetType}:${row.targetId}` },
    {
      key: 'result',
      header: 'Result',
      render: row => <StatusBadge tone={statusTone(row.result)} dot>{statusLabel(row.result)}</StatusBadge>
    },
    {
      key: 'details',
      header: 'Details',
      render: row => (
        <span className="block max-w-[260px] truncate text-sm text-slate-500" title={row.details ?? ''}>
          {row.details ?? '—'}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Admin Activity"
        description="Actions performed by a specific administrator, most recent first."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Audit Logs', to: ADMIN_ROUTES.auditLogs },
          { label: 'Admin Activity' }
        ]}
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="card p-5">
        <div className="mb-4 max-w-sm">
          <Select
            label="Administrator"
            value={selectedAdminId}
            onChange={e => setSelectedAdminId(e.target.value)}
          >
            <option value="ALL">All administrators</option>
            {admins.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </Select>
        </div>

        <DataTable
          columns={columns}
          rows={items}
          rowKey={row => row.id}
          isLoading={isLoading}
          error={error}
          emptyTitle="No activity"
          emptyDescription="This administrator has no recorded actions yet."
        />
      </div>
    </div>
  );
}
