import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input, Select } from '@/components/common/Input';
import { usePageSettings } from '@/hooks/usePageSettings';
import { ADMIN_ROUTES } from '@/utils/constants';
import { CheckCircle2 } from 'lucide-react';

const DEFAULTS = {
  minPasswordLength: '8',
  requireStrongPassword: true,
  sessionTimeoutMinutes: '60',
  maxLoginAttempts: '5',
  twoFactorRequired: false,
  ipAllowlistEnabled: false,
  auditRetentionDays: '365'
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

export default function SecuritySettingsPage() {
  const { form, setField, save, saved, isSaving, error } = usePageSettings('securitySettings', DEFAULTS);

  const handleSave = e => {
    e.preventDefault();
    void save();
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Security Settings"
        description="Authentication, session and audit policies."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Settings', to: ADMIN_ROUTES.settings },
          { label: 'Security' }
        ]}
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="card space-y-5 p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Authentication</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Minimum password length"
              name="minPasswordLength"
              type="number"
              min="6"
              value={form.minPasswordLength}
              onChange={e => setField('minPasswordLength', e.target.value)}
            />
            <Input
              label="Session timeout (minutes)"
              name="sessionTimeoutMinutes"
              type="number"
              min="5"
              value={form.sessionTimeoutMinutes}
              onChange={e => setField('sessionTimeoutMinutes', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Max login attempts"
              name="maxLoginAttempts"
              type="number"
              min="1"
              value={form.maxLoginAttempts}
              onChange={e => setField('maxLoginAttempts', e.target.value)}
            />
            <Select label="Audit log retention" name="auditRetentionDays" value={form.auditRetentionDays} onChange={e => setField('auditRetentionDays', e.target.value)}>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              <option value="730">2 years</option>
            </Select>
          </div>
          <Toggle label="Require strong passwords" hint="Passwords must include letters and numbers." checked={form.requireStrongPassword} onChange={v => setField('requireStrongPassword', v)} />
          <Toggle label="Require two-factor authentication" hint="Admins must enroll in 2FA on next login." checked={form.twoFactorRequired} onChange={v => setField('twoFactorRequired', v)} />
          <Toggle label="IP allowlist" hint="Restrict admin portal access to approved IP ranges." checked={form.ipAllowlistEnabled} onChange={v => setField('ipAllowlistEnabled', v)} />
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
