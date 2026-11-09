import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Textarea, Select } from '@/components/common/Input';
import { usePageSettings } from '@/hooks/usePageSettings';
import { ADMIN_ROUTES } from '@/utils/constants';
import { AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';
import { cn } from '@/utils/helpers';

const DEFAULTS = {
  maintenanceMode: false,
  maintenanceMessage: 'We are performing scheduled maintenance. Please check back soon.',
  estimatedDowntime: '2 hours',
  notifyUsersOnMaintenance: true,
  allowAdminAccess: true
};

export default function MaintenancePage() {
  const { form, setField, save, saved, isSaving, error } = usePageSettings('maintenanceSettings', DEFAULTS);

  const handleSave = e => {
    e.preventDefault();
    void save();
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Maintenance"
        description="Put the platform into maintenance mode and communicate downtime to users."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Settings', to: ADMIN_ROUTES.settings },
          { label: 'Maintenance' }
        ]}
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {form.maintenanceMode ? (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Maintenance mode is currently enabled. Users will see the maintenance message on their next visit after settings are saved.</span>
        </div>
      ) : null}

      <form onSubmit={handleSave} className="card space-y-5 p-6">
        <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 px-4 py-4 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', form.maintenanceMode ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50' : 'bg-slate-100 text-slate-400 dark:bg-slate-800')}>
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Maintenance mode</p>
              <p className="mt-0.5 text-xs text-slate-500">
                When enabled, regular users see a maintenance screen instead of the app.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.maintenanceMode}
            onClick={() => setField('maintenanceMode', !form.maintenanceMode)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
              form.maintenanceMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform',
                form.maintenanceMode ? 'translate-x-[22px]' : 'translate-x-0.5'
              )}
            />
          </button>
        </div>

        <Textarea
          label="Maintenance message"
          name="maintenanceMessage"
          value={form.maintenanceMessage}
          onChange={e => setField('maintenanceMessage', e.target.value)}
          hint="Shown to users while maintenance mode is active."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Estimated downtime" name="estimatedDowntime" value={form.estimatedDowntime} onChange={e => setField('estimatedDowntime', e.target.value)}>
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="2 hours">2 hours</option>
            <option value="4 hours">4 hours</option>
            <option value="Overnight">Overnight</option>
          </Select>
          <label className="flex cursor-pointer items-start justify-between gap-4 self-end rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
            <span>
              <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">Notify users</span>
              <span className="mt-0.5 block text-xs text-slate-500">Send a notification when maintenance starts.</span>
            </span>
            <input
              type="checkbox"
              checked={form.notifyUsersOnMaintenance}
              onChange={e => setField('notifyUsersOnMaintenance', e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
          <span>
            <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">Allow admin access during maintenance</span>
            <span className="mt-0.5 block text-xs text-slate-500">Administrators can still log in to manage the platform.</span>
          </span>
          <input
            type="checkbox"
            checked={form.allowAdminAccess}
            onChange={e => setField('allowAdminAccess', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </label>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" /> Settings saved
            </span>
          ) : null}
          <Button type="submit" isLoading={isSaving}>Save changes</Button>
        </div>
      </form>
    </div>
  );
}
