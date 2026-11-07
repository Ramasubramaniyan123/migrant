import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import { Select } from '@/components/common/Input';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { moderationService } from '@/services/moderationService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'];
const CATEGORY_OPTIONS = [
  'ALL', 'SPAM', 'HARASSMENT', 'HATE_SPEECH', 'INAPPROPRIATE_CONTENT',
  'FAKE_PROFILE', 'PRIVACY_VIOLATION', 'OTHER'
];
const TARGET_TYPE_OPTIONS = ['ALL', 'POST', 'USER', 'COMMENT', 'MESSAGE', 'COMMUNITY'];
const PRIORITY_OPTIONS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const PRIORITY_TONE = { CRITICAL: 'red', HIGH: 'amber', MEDIUM: 'blue', LOW: 'gray' };

export default function ReportsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ status: 'ALL', category: 'ALL', targetType: 'ALL', priority: 'ALL' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await moderationService.listReports({ ...filters, page, pageSize });
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilter = key => e => {
    setFilters(f => ({ ...f, [key]: e.target.value }));
    setPage(1);
  };

  const columns = [
    {
      key: 'priority',
      header: 'Priority',
      render: r => (
        <StatusBadge tone={PRIORITY_TONE[r.priority] ?? 'gray'} dot>
          {statusLabel(r.priority)}
        </StatusBadge>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: r => <span className="text-sm text-slate-700 dark:text-slate-300">{statusLabel(r.category)}</span>
    },
    {
      key: 'target',
      header: 'Target',
      render: r => (
        <div className="max-w-xs">
          <span className="mb-0.5 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800">
            {r.targetType}
          </span>
          <p className="truncate text-sm text-slate-600 dark:text-slate-400">{r.targetPreview}</p>
        </div>
      )
    },
    {
      key: 'reporter',
      header: 'Reporter',
      render: r => <span className="text-sm text-slate-700 dark:text-slate-300">{r.reporterName}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: r => (
        <StatusBadge tone={statusTone(r.status)} dot>
          {statusLabel(r.status)}
        </StatusBadge>
      )
    },
    {
      key: 'created',
      header: 'Reported',
      render: r => <span className="text-sm text-slate-500">{formatDateTime(r.createdAt)}</span>
    }
  ];

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div>
      <PageHeader
        title="Reports"
        description="All user-submitted reports across posts, users, comments, messages and communities."
      />

      <div className="card mb-4 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Status" value={filters.status} onChange={updateFilter('status')}>
            {STATUS_OPTIONS.map(o => <option key={o} value={o}>{statusLabel(o)}</option>)}
          </Select>
          <Select label="Category" value={filters.category} onChange={updateFilter('category')}>
            {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{statusLabel(o)}</option>)}
          </Select>
          <Select label="Target type" value={filters.targetType} onChange={updateFilter('targetType')}>
            {TARGET_TYPE_OPTIONS.map(o => <option key={o} value={o}>{statusLabel(o)}</option>)}
          </Select>
          <Select label="Priority" value={filters.priority} onChange={updateFilter('priority')}>
            {PRIORITY_OPTIONS.map(o => <option key={o} value={o}>{statusLabel(o)}</option>)}
          </Select>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          rows={data.items}
          rowKey={r => r.id}
          isLoading={loading}
          error={error}
          emptyTitle="No reports found"
          emptyDescription="Try adjusting the filters above."
          onRowClick={r => navigate(ADMIN_ROUTES.reportDetails(r.id))}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          total={data.total}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="reports"
        />
      </div>
    </div>
  );
}
