import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { Select } from '@/components/common/Input';
import { adminAuthService } from '@/services/adminAuthService';
import { ADMIN_ROUTES, ADMIN_ROLE_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';
import { cn } from '@/utils/helpers';
import { ShieldCheck, UserPlus, Users } from 'lucide-react';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'ANALYST'];

function initials(name = '') {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export function AdminAvatar({ name, avatarUrl, className }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className={cn('h-9 w-9 rounded-full object-cover', className)} />;
  }
  return (
    <div className={cn('flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300', className)}>
      {initials(name)}
    </div>
  );
}

export default function AdministratorsPage() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [roleTarget, setRoleTarget] = useState(null);
  const [newRole, setNewRole] = useState('ADMIN');
  const [savingRole, setSavingRole] = useState(false);

  const [statusTarget, setStatusTarget] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAdmins(await adminAuthService.listAdmins());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load administrators');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openRoleModal = admin => {
    setRoleTarget(admin);
    setNewRole(admin.role);
    setActionError(null);
  };

  const handleSaveRole = async () => {
    setSavingRole(true);
    setActionError(null);
    try {
      await adminAuthService.updateAdminRole(roleTarget.id, newRole);
      setRoleTarget(null);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setSavingRole(false);
    }
  };

  const handleToggleStatus = async () => {
    setSavingStatus(true);
    setActionError(null);
    try {
      const nextStatus = statusTarget.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await adminAuthService.updateAdminStatus(statusTarget.id, nextStatus);
      setStatusTarget(null);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status');
      setStatusTarget(null);
    } finally {
      setSavingStatus(false);
    }
  };

  const columns = [
    {
      key: 'admin',
      header: 'Administrator',
      render: row => (
        <div className="flex items-center gap-3">
          <AdminAvatar name={row.name} avatarUrl={row.avatarUrl} />
          <div className="min-w-0">
            <Link to={ADMIN_ROUTES.adminDetails(row.id)} className="block truncate font-medium text-slate-900 hover:text-blue-600 dark:text-slate-100">
              {row.name}
            </Link>
            <span className="block truncate text-xs text-slate-500">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: row => <StatusBadge tone="blue">{ADMIN_ROLE_LABELS[row.role] ?? row.role}</StatusBadge>
    },
    {
      key: 'status',
      header: 'Status',
      render: row => <StatusBadge tone={statusTone(row.status)} dot>{statusLabel(row.status)}</StatusBadge>
    },
    {
      key: 'lastLogin',
      header: 'Last login',
      render: row => (row.lastLoginAt ? formatDateTime(row.lastLoginAt) : 'Never')
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: row => (row.createdAt ? formatDateTime(row.createdAt) : '—')
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: row => (
        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => openRoleModal(row)}>Change role</Button>
          <Button
            variant={row.status === 'ACTIVE' ? 'danger' : 'secondary'}
            size="sm"
            onClick={() => {
              setActionError(null);
              setStatusTarget(row);
            }}
          >
            {row.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Administrators"
        description="Manage admin accounts, roles and access."
        breadcrumbs={[{ label: 'Dashboard', to: ADMIN_ROUTES.dashboard }, { label: 'Administrators' }]}
        actions={
          <>
            <Button variant="secondary" leftIcon={<ShieldCheck className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.rolesPermissions)}>
              Roles &amp; permissions
            </Button>
            <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.createAdmin)}>
              Add administrator
            </Button>
          </>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{admins.length} administrator accounts</h3>
        </div>
        <DataTable
          columns={columns}
          rows={admins}
          rowKey={row => row.id}
          isLoading={isLoading}
          error={error}
          emptyTitle="No administrators"
          emptyDescription="No admin accounts have been created yet."
        />
      </div>

      <Modal
        open={!!roleTarget}
        onClose={() => setRoleTarget(null)}
        title={`Change role — ${roleTarget?.name ?? ''}`}
        description="The new role takes effect immediately."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRoleTarget(null)}>Cancel</Button>
            <Button onClick={handleSaveRole} isLoading={savingRole} disabled={!newRole || newRole === roleTarget?.role}>
              Save role
            </Button>
          </>
        }
      >
        <Select
          label="Role"
          value={newRole}
          onChange={e => setNewRole(e.target.value)}
        >
          {ADMIN_ROLES.map(role => (
            <option key={role} value={role}>{ADMIN_ROLE_LABELS[role]}</option>
          ))}
        </Select>
      </Modal>

      <ConfirmDialog
        open={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleToggleStatus}
        isLoading={savingStatus}
        danger={statusTarget?.status === 'ACTIVE'}
        title={statusTarget?.status === 'ACTIVE' ? 'Suspend administrator' : 'Activate administrator'}
        message={
          statusTarget?.status === 'ACTIVE'
            ? `${statusTarget?.name} will lose access to the admin portal immediately. You can reactivate the account later.`
            : `${statusTarget?.name} will regain access to the admin portal.`
        }
        confirmLabel={statusTarget?.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
      />
    </div>
  );
}
