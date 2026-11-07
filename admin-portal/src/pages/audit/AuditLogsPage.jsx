import { useCallback, useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import DatePicker from '@/components/common/DatePicker';
import { Select } from '@/components/common/Input';
import { auditService } from '@/services/auditService';
import { ADMIN_ROUTES, ADMIN_ROLE_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';
import { Lock, RefreshCw, Search } from 'lucide-react';

const PAGE_SIZE = 15;
const RESULTS = ['ALL', 'SUCCESS', 'FAILURE', 'DENIED'];

export default function AuditLogsPage() {
  const [filters, setFilters] = useState({
    adminId: 'ALL',
    action: 'ALL',
    targetType: 'ALL',
    result: 'ALL',
    from: '',
    to: ''
  });
  const [options, setOptions] = useState({ admins: [], actions: [], targetTypes: [] });
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    auditService.getFilterOptions()
      .then(setOptions)
      .catch(() => undefined);
  }, []);

  const load = useCallback(async (currentPage = page) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await auditService.list({
        ...filters,
        page: currentPage,
        pageSize
      });
      setData(result);
      setPage(result.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    void load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = e => {
    e.preventDefault();
    void load(1);
  };

  const resetFilters = () => {
    const cleared = { adminId: 'ALL', action: 'ALL', targetType: 'ALL', result: 'ALL', from: '', to: '' };
    setFilters(cleared);
    setIsLoading(true);
    setError(null);
    auditService.list({ ...cleared, page: 1, pageSize })
      .then(result => {
        setData(result);
        setPage(1);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load audit logs'))
      .finally(() => setIsLoading(false));
  };

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const columns = [
    {
      key: 'createdAt',
      header: 'Timestamp',
      render: row => formatDateTime(row.createdAt)
    },
    {
      key: 'admin',
      header: 'Administrator',
      render: row => (
        <div>
          <span className="block font-medium text-slate-900 dark:text-slate-100">{row.adminName}</span>
          <span className="block text-xs text-slate-500">{ADMIN_ROLE_LABELS[row.adminRole] ?? row.adminRole}</span>
        </div>
      )
    },
    { key: 'action', header: 'Action', render: row => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{row.action}</code> },
    { key: 'target', header: 'Target', render: row => `${row.targetType}:${row.targetId}` },
    {
      key: 'result',
      header: 'Result',
      render: row => <StatusBadge tone={statusTone(row.result)} dot>{statusLabel(row.result)}</StatusBadge>
    },
    { key: 'ipAddress', header: 'IP address', render: row => <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{row.ipAddress}</span> },
    {
      key: 'details',
      header: 'Details',
      render: row => (
        <span className="block max-w-[220px] truncate text-sm text-slate-500" title={row.details ?? ''}>
          {row.details ?? '—'}
        </span>
      )
    }
  ];

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Immutable record of all administrative actions across the platform."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Audit Logs' }
        ]}
      />

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <span>Audit logs are immutable — entries cannot be edited or deleted.</span>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={applyFilters} className="card mb-4 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Select label="Administrator" value={filters.adminId} onChange={e => setFilter('adminId', e.target.value)}>
            <option value="ALL">All administrators</option>
            {options.admins.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </Select>
          <Select label="Action" value={filters.action} onChange={e => setFilter('action', e.target.value)}>
            <option value="ALL">All actions</option>
            {options.actions.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </Select>
          <Select label="Target type" value={filters.targetType} onChange={e => setFilter('targetType', e.target.value)}>
            <option value="ALL">All types</option>
            {options.targetTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Select label="Result" value={filters.result} onChange={e => setFilter('result', e.target.value)}>
            {RESULTS.map(r => (
              <option key={r} value={r}>{r === 'ALL' ? 'All results' : statusLabel(r)}</option>
            ))}
          </Select>
          <DatePicker label="From" value={filters.from} onChange={e => setFilter('from', e.target.value)} />
          <DatePicker label="To" value={filters.to} onChange={e => setFilter('to', e.target.value)} />
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
          <Button type="submit" size="sm" leftIcon={<Search className="h-4 w-4" />} isLoading={isLoading}>
            Apply filters
          </Button>
        </div>
      </form>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{data.total} log entries</h3>
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => void load(page)}>
            Refresh
          </Button>
        </div>
        <DataTable
          columns={columns}
          rows={data.items}
          rowKey={row => row.id}
          isLoading={isLoading}
          error={error}
          emptyTitle="No audit entries"
          emptyDescription="No audit log entries match the current filters."
        />
        {data.total > 0 ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={data.total}
            pageSize={pageSize}
            onPageChange={p => void load(p)}
            itemLabel="log entries"
          />
        ) : null}
      </div>
    </div>
  );
}
