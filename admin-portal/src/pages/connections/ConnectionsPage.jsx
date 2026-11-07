import { useCallback, useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/widgets/StatCard';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import SearchBar from '@/components/common/SearchBar';
import { Select } from '@/components/common/Input';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { connectionService } from '@/services/connectionService';
import { formatDate, formatDateTime } from '@/utils/formatters';
import { Users, Clock, CheckCircle2, Percent, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/utils/constants';
import Button from '@/components/common/Button';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED'];

export default function ConnectionsPage() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    connectionService.getStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await connectionService.list({ status, search: debouncedSearch, page, pageSize });
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  }, [status, debouncedSearch, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    {
      key: 'requester',
      header: 'Requester',
      render: e => <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{e.requesterName}</span>
    },
    {
      key: 'arrow',
      header: '',
      className: 'w-10',
      render: () => <span className="text-slate-300">→</span>
    },
    {
      key: 'addressee',
      header: 'Addressee',
      render: e => <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{e.addresseeName}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: e => (
        <StatusBadge tone={statusTone(e.status)} dot>{statusLabel(e.status)}</StatusBadge>
      )
    },
    {
      key: 'created',
      header: 'Requested',
      render: e => <span className="text-sm text-slate-500">{formatDateTime(e.createdAt)}</span>
    },
    {
      key: 'accepted',
      header: 'Accepted',
      render: e => (
        <span className="text-sm text-slate-500">{e.acceptedAt ? formatDate(e.acceptedAt) : '—'}</span>
      )
    }
  ];

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div>
      <PageHeader
        title="Connections"
        description="Connection requests and accepted connections between users."
        actions={
          <Link to={ADMIN_ROUTES.connectionAnalytics}>
            <Button variant="secondary">View analytics</Button>
          </Link>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total connections" value={stats?.total ?? '—'} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Pending" value={stats?.pending ?? '—'} icon={<Clock className="h-5 w-5" />} hint="Awaiting response" />
        <StatCard label="Accepted" value={stats?.accepted ?? '—'} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Acceptance rate" value={stats ? `${stats.acceptanceRate}%` : '—'} icon={<Percent className="h-5 w-5" />} />
        <StatCard label="Avg requests / user" value={stats?.avgRequestsPerUser ?? '—'} icon={<UserPlus className="h-5 w-5" />} />
      </div>

      <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          onDebouncedChange={v => {
            setDebouncedSearch(v);
            setPage(1);
          }}
          placeholder="Search by name…"
          className="sm:max-w-sm"
        />
        <div className="sm:w-48">
          <Select
            label="Status"
            value={status}
            onChange={e => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map(o => <option key={o} value={o}>{statusLabel(o)}</option>)}
          </Select>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          rows={data.items}
          rowKey={e => e.id}
          isLoading={loading}
          error={error}
          emptyTitle="No connections found"
          emptyDescription="Try adjusting the filters above."
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          total={data.total}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="connections"
        />
      </div>
    </div>
  );
}
