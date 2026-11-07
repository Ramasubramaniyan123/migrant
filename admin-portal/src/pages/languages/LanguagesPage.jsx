import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge from '@/components/common/StatusBadge';
import { languageService } from '@/services/languageService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatNumber } from '@/utils/helpers';

function StatCard({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function LanguagesPage() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // { language, activate: bool }

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [list, s] = await Promise.all([languageService.list(), languageService.getStats()]);
      setRows(list);
      setStats(s);
    } catch (err) {
      setError(err?.message ?? 'Failed to load languages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirm = async () => {
    if (!pending) return;
    await languageService.setActive(pending.language.id, pending.activate);
    setPending(null);
    await load();
  };

  const columns = [
    {
      key: 'name',
      header: 'Language',
      render: l => (
        <div>
          <p className="font-medium text-slate-900">{l.name}</p>
          <p className="text-xs text-slate-500">{l.nativeName}</p>
        </div>
      )
    },
    { key: 'code', header: 'Code', render: l => <span className="font-mono text-xs">{l.code}</span> },
    { key: 'users', header: 'Users', render: l => formatNumber(l.userCount ?? 0) },
    { key: 'communities', header: 'Communities', render: l => formatNumber(l.communityCount ?? 0) },
    {
      key: 'status',
      header: 'Status',
      render: l => (
        <StatusBadge tone={l.isActive ? 'green' : 'gray'} dot>
          {l.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: l => (
        <div className="flex items-center justify-end gap-2">
          <Link to={ADMIN_ROUTES.editLanguage(l.id)} onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="sm" leftIcon={<Pencil className="h-4 w-4" />}>Edit</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              setPending({ language: l, activate: !l.isActive });
            }}
          >
            {l.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Languages"
        description="Manage supported languages in the platform."
        actions={
          <Link to={ADMIN_ROUTES.createLanguage}>
            <Button leftIcon={<Plus className="h-4 w-4" />}>Add language</Button>
          </Link>
        }
      />

      {stats ? (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total languages" value={formatNumber(stats.total ?? 0)} />
          <StatCard label="Active" value={formatNumber(stats.active ?? 0)} />
          <StatCard label="Users speaking" value={formatNumber(stats.totalUsers ?? 0)} />
        </div>
      ) : null}

      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={l => l.id}
          isLoading={isLoading}
          error={error}
          emptyTitle="No languages"
          emptyDescription="Add a language to get started."
        />
      </div>

      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title={pending?.activate ? 'Activate language' : 'Deactivate language'}
        message={
          pending?.activate
            ? `Activate "${pending?.language?.name}"? It will be available for selection again.`
            : `Deactivate "${pending?.language?.name}"? Existing users keep their data, but it won't be selectable for new entries.`
        }
        confirmLabel={pending?.activate ? 'Activate' : 'Deactivate'}
        danger={!pending?.activate}
      />
    </div>
  );
}
