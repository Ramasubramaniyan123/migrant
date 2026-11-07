import PageHeader from '@/components/layout/PageHeader';
import { PERMISSIONS, ROLE_PERMISSIONS } from '@/utils/permissions';
import { ADMIN_ROLE_LABELS } from '@/utils/constants';
import { Check, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/helpers';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'ANALYST'];

function humanize(permission) {
  const [area, action] = permission.split(':');
  const areaLabel = area.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const actionLabel = action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `${areaLabel} · ${actionLabel}`;
}

export default function RolesPermissionsPage() {
  const permissions = Object.values(PERMISSIONS);

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Which permissions each administrator role grants. Enforcement happens in the backend in production."
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Administrators', to: '/administrators' },
          { label: 'Roles & permissions' }
        ]}
      />

      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <Check className="h-3.5 w-3.5" />
            </span>
            Allowed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <X className="h-3.5 w-3.5" />
            </span>
            Not granted
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            {permissions.length} permissions across {ROLES.length} roles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                <th className="th">Permission</th>
                {ROLES.map(role => (
                  <th key={role} className="th text-center">{ADMIN_ROLE_LABELS[role]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissions.map(perm => (
                <tr key={perm} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="td font-medium text-slate-900 dark:text-slate-100">{humanize(perm)}</td>
                  {ROLES.map(role => {
                    const granted = ROLE_PERMISSIONS[role]?.has(perm) ?? false;
                    return (
                      <td key={role} className="td text-center">
                        <span
                          className={cn(
                            'inline-flex h-6 w-6 items-center justify-center rounded-full',
                            granted
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600'
                          )}
                          title={`${ADMIN_ROLE_LABELS[role]}: ${granted ? 'allowed' : 'not granted'}`}
                        >
                          {granted ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
