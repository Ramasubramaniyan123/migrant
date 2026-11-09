import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input, Select } from '@/components/common/Input';
import { usePageSettings } from '@/hooks/usePageSettings';
import { ADMIN_ROUTES } from '@/utils/constants';
import { CheckCircle2 } from 'lucide-react';

const DEFAULTS = {
  allowRegistration: true,
  requireEmailVerification: true,
  allowGuestBrowsing: false,
  maxUploadSizeMb: '10',
  maxCommunitiesPerUser: '5',
  defaultCommunityVisibility: 'PUBLIC',
  enableNotifications: true,
  enableAnalyticsTracking: true
};

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700">
      <span>
        <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-slate-500">{hint}</span> : null}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

export default function PlatformSettingsPage() {
  const { form, setField, save, saved, isSaving, error } = usePageSettings('platformSettings', DEFAULTS);

  const handleSave = e => {
    e.preventDefault();
    void save();
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Platform Settings"
        description="Registration, content and feature configuration."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Settings', to: ADMIN_ROUTES.settings },
          { label: 'Platform' }
        ]}
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="card space-y-3 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Features</h3>
          <Toggle label="Allow new registrations" hint="When off, no new user accounts can be created." checked={form.allowRegistration} onChange={v => setField('allowRegistration', v)} />
          <Toggle label="Require email verification" hint="Users must verify their email before posting." checked={form.requireEmailVerification} onChange={v => setField('requireEmailVerification', v)} />
          <Toggle label="Allow guest browsing" hint="Unauthenticated visitors can view public content." checked={form.allowGuestBrowsing} onChange={v => setField('allowGuestBrowsing', v)} />
          <Toggle label="Push notifications" hint="Enable in-app and push notifications for users." checked={form.enableNotifications} onChange={v => setField('enableNotifications', v)} />
          <Toggle label="Analytics tracking" hint="Collect usage analytics for reporting." checked={form.enableAnalyticsTracking} onChange={v => setField('enableAnalyticsTracking', v)} />
        </div>

        <div className="card space-y-5 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Limits & defaults</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Max upload size (MB)"
              name="maxUploadSizeMb"
              type="number"
              min="1"
              value={form.maxUploadSizeMb}
              onChange={e => setField('maxUploadSizeMb', e.target.value)}
            />
            <Input
              label="Max communities per user"
              name="maxCommunitiesPerUser"
              type="number"
              min="1"
              value={form.maxCommunitiesPerUser}
              onChange={e => setField('maxCommunitiesPerUser', e.target.value)}
            />
          </div>
          <Select label="Default community visibility" name="defaultCommunityVisibility" value={form.defaultCommunityVisibility} onChange={e => setField('defaultCommunityVisibility', e.target.value)}>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="APPROVAL">Approval required</option>
          </Select>
        </div>

        <div className="card flex items-center justify-end gap-3 p-4">
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
