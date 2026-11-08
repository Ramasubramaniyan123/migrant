import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, UserCheck, UserX } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { userService } from '@/services/userService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import UserFilters from './UserFilters';

export default function UsersPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [city, setCity] = useState('ALL');
  const [language, setLanguage] = useState('ALL');
  const [options, setOptions] = useState({ cities: [], languages: [], statuses: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // { action: 'suspend'|'activate', user }

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.list({ search, status, city, language, page, pageSize });
      setRows(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err?.message ?? 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [search, status, city, language, page, pageSize]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    userService.getFilterOptions().then(setOptions).catch(() => {});
  }, []);

  const handleReset = () => {
    setSearch('');
    setStatus('ALL');
    setCity('ALL');
    setLanguage('ALL');
    setPage(1);
  };

  const handleConfirm = async () => {
    if (!pending) return;
    const { action, user } = pending;
    if (action === 'suspend') await userService.suspend(user.id);
    else await userService.activate(user.id);
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
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {u.fullName?.charAt(0) ?? '?'}
            </div>
          )}
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{u.fullName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{u.id}</p>
          </div>
        </div>
      )
    },
    { key: 'email', header: 'Email', render: u => u.email },
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
        <div className="flex items-center justify-end gap-2">
          {u.status === 'SUSPENDED' ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<UserCheck className="h-4 w-4" />}
              onClick={e => {
                e.stopPropagation();
                setPending({ action: 'activate', user: u });
              }}
            >
              Activate
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<UserX className="h-4 w-4" />}
              onClick={e => {
                e.stopPropagation();
                setPending({ action: 'suspend', user: u });
              }}
            >
              Suspend
            </Button>
          )}
        </div>
      )
    }
  ];

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage registered migrant community members."
        actions={
          <Link to={ADMIN_ROUTES.suspendedUsers} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 h-10 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            <Link2 className="h-4 w-4" />
            View suspended
          </Link>
        }
      />

      <UserFilters
        search={search}
        onSearchChange={v => { setSearch(v); setPage(1); }}
        status={status}
        onStatusChange={v => { setStatus(v); setPage(1); }}
        city={city}
        onCityChange={v => { setCity(v); setPage(1); }}
        language={language}
        onLanguageChange={v => { setLanguage(v); setPage(1); }}
        cities={options.cities}
        languages={options.languages}
        statuses={options.statuses}
        onReset={handleReset}
      />

      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={u => u.id}
          isLoading={isLoading}
          error={error}
          onRowClick={u => navigate(ADMIN_ROUTES.userDetails(u.id))}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters."
        />
        {!isLoading && !error ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={s => { setPageSize(s); setPage(1); }}
            itemLabel="users"
          />
        ) : null}
      </div>

      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title={pending?.action === 'suspend' ? 'Suspend user' : 'Activate user'}
        message={
          pending?.action === 'suspend'
            ? `Suspend ${pending?.user?.fullName}? They will not be able to use the app until reactivated.`
            : `Reactivate ${pending?.user?.fullName}? They will regain full access.`
        }
        confirmLabel={pending?.action === 'suspend' ? 'Suspend' : 'Activate'}
        danger={pending?.action === 'suspend'}
      />
    </div>
  );
}
