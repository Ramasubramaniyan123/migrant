import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { Select } from '@/components/common/Input';
import { AdminAvatar } from './AdministratorsPage';
import { adminAuthService } from '@/services/adminAuthService';
import { ADMIN_ROUTES, ADMIN_ROLE_LABELS } from '@/utils/constants';
import { formatDateTime, formatDate } from '@/utils/formatters';
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'ANALYST'];

export default function AdminDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('ADMIN');
  const [savingRole, setSavingRole] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const admins = await adminAuthService.listAdmins();
      const found = admins.find(a => a.id === id);
      if (!found) {
        setError('Administrator not found');
      } else {
        setAdmin(found);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load administrator');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const openRoleModal = () => {
    setNewRole(admin.role);
    setActionError(null);
    setRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    setSavingRole(true);
    setActionError(null);
    try {
      await adminAuthService.updateAdminRole(admin.id, newRole);
      setRoleModalOpen(false);
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
      const nextStatus = admin.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await adminAuthService.updateAdminStatus(admin.id, nextStatus);
      setStatusDialogOpen(false);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status');
      setStatusDialogOpen(false);
    } finally {
      setSavingStatus(false);
    }
  };

  if (isLoading) {
    return <Loader label="Loading administrator…" />;
  }

  if (error || !admin) {
    return (
      <EmptyState
        title="Administrator not found"
        description={error ?? 'The requested administrator account does not exist.'}
        action={<Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.administrators)}>Back to administrators</Button>}
      />
    );
  }

  const details = [
    { label: 'Email', value: admin.email, icon: <Mail className="h-4 w-4" /> },
    { label: 'Role', value: ADMIN_ROLE_LABELS[admin.role] ?? admin.role },
    { label: 'Status', value: statusLabel(admin.status) },
    { label: 'Last login', value: admin.lastLoginAt ? formatDateTime(admin.lastLoginAt) : 'Never' },
    { label: 'Created', value: admin.createdAt ? formatDate(admin.createdAt) : '—' }
  ];

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={admin.name}
        description="Administrator account details and access controls."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Administrators', to: ADMIN_ROUTES.administrators },
          { label: admin.name }
        ]}
        actions={
          <>
            <Button variant="secondary" leftIcon={<ShieldCheck className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.rolesPermissions)}>
              Roles &amp; permissions
            </Button>
            <Button variant="secondary" onClick={openRoleModal}>Change role</Button>
            <Button
              variant={admin.status === 'ACTIVE' ? 'danger' : 'primary'}
              onClick={() => {
                setActionError(null);
                setStatusDialogOpen(true);
              }}
            >
              {admin.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
            </Button>
          </>
        }
      />

      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      <div className="card p-6">
        <div className="flex items-start gap-4">
          <AdminAvatar name={admin.name} avatarUrl={admin.avatarUrl} className="h-16 w-16 text-lg" />
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{admin.name}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{admin.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge tone="blue">{ADMIN_ROLE_LABELS[admin.role] ?? admin.role}</StatusBadge>
              <StatusBadge tone={statusTone(admin.status)} dot>{statusLabel(admin.status)}</StatusBadge>
            </div>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-700">
          {details.map(item => (
            <div key={item.label}>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                {item.icon}{item.label}
              </dt>
              <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <p className="text-sm text-slate-500">
            Permissions for this role are defined in the{' '}
            <Link to={ADMIN_ROUTES.rolesPermissions} className="text-blue-600 hover:underline">Roles &amp; permissions</Link> matrix.
          </p>
        </div>
      </div>

      <Modal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={`Change role — ${admin.name}`}
        description="The new role takes effect immediately."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRoleModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRole} isLoading={savingRole} disabled={!newRole || newRole === admin.role}>
              Save role
            </Button>
          </>
        }
      >
        <Select label="Role" value={newRole} onChange={e => setNewRole(e.target.value)}>
          {ADMIN_ROLES.map(role => (
            <option key={role} value={role}>{ADMIN_ROLE_LABELS[role]}</option>
          ))}
        </Select>
      </Modal>

      <ConfirmDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={handleToggleStatus}
        isLoading={savingStatus}
        danger={admin.status === 'ACTIVE'}
        title={admin.status === 'ACTIVE' ? 'Suspend administrator' : 'Activate administrator'}
        message={
          admin.status === 'ACTIVE'
            ? `${admin.name} will lose access to the admin portal immediately. You can reactivate the account later.`
            : `${admin.name} will regain access to the admin portal.`
        }
        confirmLabel={admin.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
      />
    </div>
  );
}
