import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Activity, Ban, CheckCircle2, ShieldCheck, UserX } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import UserProfileView from './UserProfileView';
import { userService } from '@/services/userService';
import { ADMIN_ROUTES } from '@/utils/constants';

export default function UserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null); // 'suspend' | 'activate' | 'verify' | 'deactivate'

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setUser(await userService.getById(id));
    } catch (err) {
      setError(err?.message ?? 'Failed to load user');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirm = async () => {
    if (!pending || !user) return;
    if (pending === 'suspend') await userService.suspend(user.id);
    else if (pending === 'activate') await userService.activate(user.id);
    else if (pending === 'verify') await userService.verify(user.id);
    else if (pending === 'deactivate') await userService.deactivate(user.id);
    setPending(null);
    await load();
  };

  if (isLoading) {
    return <Loader label="Loading user…" />;
  }

  if (error || !user) {
    return (
      <div>
        <PageHeader title="User not found" />
        <EmptyState
          title="User not found"
          description={error ?? 'The requested user does not exist.'}
          action={
            <Link to={ADMIN_ROUTES.users}>
              <Button variant="secondary">Back to users</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const isSuspended = user.status === 'SUSPENDED';
  const isActive = user.status === 'ACTIVE';

  return (
    <div>
      <PageHeader
        title={user.fullName}
        description={user.email}
        breadcrumbs={[
          { label: 'Users', to: ADMIN_ROUTES.users },
          { label: user.fullName }
        ]}
        actions={
          <>
            <Link to={ADMIN_ROUTES.userActivity(user.id)}>
              <Button variant="secondary" leftIcon={<Activity className="h-4 w-4" />}>
                Activity
              </Button>
            </Link>
            {!user.isVerified ? (
              <Button variant="outline" leftIcon={<ShieldCheck className="h-4 w-4" />} onClick={() => setPending('verify')}>
                Verify
              </Button>
            ) : null}
            {isSuspended ? (
              <Button variant="primary" leftIcon={<CheckCircle2 className="h-4 w-4" />} onClick={() => setPending('activate')}>
                Activate
              </Button>
            ) : (
              <Button variant="danger" leftIcon={<Ban className="h-4 w-4" />} onClick={() => setPending('suspend')}>
                Suspend
              </Button>
            )}
            {isActive ? (
              <Button variant="ghost" leftIcon={<UserX className="h-4 w-4" />} onClick={() => setPending('deactivate')}>
                Deactivate
              </Button>
            ) : null}
          </>
        }
      />

      <UserProfileView user={user} />

      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title={
          pending === 'suspend' ? 'Suspend user'
          : pending === 'activate' ? 'Activate user'
          : pending === 'verify' ? 'Verify user'
          : 'Deactivate user'
        }
        message={
          pending === 'suspend'
            ? `Suspend ${user.fullName}? They will lose access to the app until reactivated.`
            : pending === 'activate'
              ? `Reactivate ${user.fullName}?`
              : pending === 'verify'
                ? `Mark ${user.fullName} as verified?`
                : `Deactivate ${user.fullName}? This will disable their account.`
        }
        confirmLabel={
          pending === 'suspend' ? 'Suspend'
          : pending === 'activate' ? 'Activate'
          : pending === 'verify' ? 'Verify'
          : 'Deactivate'
        }
        danger={pending === 'suspend' || pending === 'deactivate'}
      />
    </div>
  );
}
