import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { hasPermission } from '@/utils/permissions';
import { ADMIN_ROUTES } from '@/utils/constants';
import EmptyState from '@/components/common/EmptyState';
import { ShieldAlert } from 'lucide-react';
/**
 * Client-side permission gate for UI elements. NOTE: this is UX only —
 * the Spring Boot backend must enforce the same permission server-side.
 */
export default function PermissionRoute({
  permission,
  anyOf,
  children
}) {
  const {
    admin,
    role
  } = useAdminAuth();
  const allowed = permission ? hasPermission(role ?? undefined, permission) : anyOf ? anyOf.some(p => hasPermission(role ?? undefined, p)) : true;
  if (!allowed) {
    return <div className="py-16">
        <EmptyState icon={<ShieldAlert className="h-7 w-7" />} title="Access restricted" description={`Your role (${admin?.role.replace('_', ' ') ?? 'unknown'}) does not have permission to view this section.`} action={<a href={ADMIN_ROUTES.dashboard} className="text-sm font-medium text-blue-600 hover:underline">
              Back to dashboard
            </a>} />
      </div>;
  }
  return <>{children}</>;
}
