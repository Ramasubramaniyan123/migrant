import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SearchBar from '@/components/common/SearchBar';
import { Select } from '@/components/common/Input';
import StatusBadge, { statusLabel } from '@/components/common/StatusBadge';
import { communityService } from '@/services/communityService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import { formatNumber } from '@/utils/helpers';
import { COMMUNITY_TYPE_OPTIONS, COMMUNITY_CITY_OPTIONS } from './CreateCommunityPage';

const COMMUNITY_TYPES = ['ALL', ...COMMUNITY_TYPE_OPTIONS];
const COMMUNITY_STATUSES = ['ALL', 'ACTIVE', 'INACTIVE'];
const TYPE_TONES = { LANGUAGE: 'blue', HOMETOWN: 'green', INTEREST: 'amber', WORKPLACE: 'purple' };

export default function CommunitiesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [city, setCity] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // { action: 'activate'|'deactivate'|'delete', community }

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await communityService.list({ search, type, city, status, page, pageSize });
      setRows(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err?.message ?? 'Failed to load communities');
    } finally {
      setIsLoading(false);
    }
  }, [search, type, city, status, page, pageSize]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleConfirm = async () => {
    if (!pending) return;
    const { action, community } = pending;
    if (action === 'delete') await communityService.delete(community.id);
    else await communityService.setActive(community.id, action === 'activate');
    setPending(null);
    await load();
  };

  const columns = [
    {
      key: 'name',
      header: 'Community',
      render: c => (
        <div>
          <p className="font-medium text-slate-900">{c.name}</p>
          <p className="max-w-xs truncate text-xs text-slate-500">{c.description}</p>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: c => <StatusBadge tone={TYPE_TONES[c.type] ?? 'gray'}>{statusLabel(c.type)}</StatusBadge>
    },
    { key: 'city', header: 'City', render: c => c.city ?? '—' },
    { key: 'members', header: 'Members', render: c => formatNumber(c.memberCount ?? 0) },
    { key: 'posts', header: 'Posts', render: c => formatNumber(c.postCount ?? 0) },
    {
      key: 'status',
      header: 'Status',
      render: c => (
        <StatusBadge tone={c.isActive ? 'green' : 'gray'} dot>
          {c.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      )
    },
    { key: 'created', header: 'Created', render: c => formatDate(c.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: c => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              setPending({ action: c.isActive ? 'deactivate' : 'activate', community: c });
            }}
          >
            {c.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={e => {
              e.stopPropagation();
              setPending({ action: 'delete', community: c });
            }}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <PageHeader
        title="Communities"
        description="Manage migrant community groups."
        actions={
          <Link to={ADMIN_ROUTES.createCommunity}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>Create community</Button>
          </Link>
        }
      />

      <div className="card mb-4 flex flex-col gap-3 p-4 lg:flex-row lg:items-end">
        <SearchBar
          value={search}
          onChange={v => { setSearch(v); setPage(1); }}
          placeholder="Search communities…"
          className="flex-1"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select label="Type" name="ctype" value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
            {COMMUNITY_TYPES.map(t => (
              <option key={t} value={t}>{t === 'ALL' ? 'All types' : t.charAt(0) + t.slice(1).toLowerCase()}</option>
            ))}
          </Select>
          <Select label="City" name="ccity" value={city} onChange={e => { setCity(e.target.value); setPage(1); }}>
            <option value="ALL">All cities</option>
            {COMMUNITY_CITY_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Select label="Status" name="cstatus" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            {COMMUNITY_STATUSES.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All statuses' : statusLabel(s)}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={c => c.id}
          isLoading={isLoading}
          error={error}
          onRowClick={c => navigate(ADMIN_ROUTES.communityDetails(c.id))}
          emptyTitle="No communities found"
          emptyDescription="Try adjusting your filters or create a new community."
        />
        {!isLoading && !error ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={s => { setPageSize(s); setPage(1); }}
            itemLabel="communities"
          />
        ) : null}
      </div>

      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title={
          pending?.action === 'delete' ? 'Delete community'
          : pending?.action === 'activate' ? 'Activate community'
          : 'Deactivate community'
        }
        message={
          pending?.action === 'delete'
            ? `Permanently delete "${pending?.community?.name}"? This cannot be undone.`
            : pending?.action === 'activate'
              ? `Activate "${pending?.community?.name}"? It will become visible to members again.`
              : `Deactivate "${pending?.community?.name}"? Members will no longer see it.`
        }
        confirmLabel={
          pending?.action === 'delete' ? 'Delete'
          : pending?.action === 'activate' ? 'Activate'
          : 'Deactivate'
        }
        danger={pending?.action === 'delete' || pending?.action === 'deactivate'}
      />
    </div>
  );
}
