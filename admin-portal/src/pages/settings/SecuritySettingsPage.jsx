import { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input, Select } from '@/components/common/Input';
import { ADMIN_ROUTES } from '@/utils/constants';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'admin_portal_settings';
const PAGE_KEY = 'security';

const DEFAULTS = {
  minPasswordLength: '8',
  requireStrongPassword: true,
  sessionTimeoutMinutes: '60',
  maxLoginAttempts: '5',
  twoFactorRequired: false,
  ipAllowlistEnabled: false,
  auditRetentionDays: '365'
};

function readSaved() {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return { ...DEFAULTS, ...(all[PAGE_KEY] ?? {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

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
  const [form, setForm] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(readSaved());
  }, []);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = e => {
    e.preventDefault();
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
      all[PAGE_KEY] = form;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore storage errors in prototype
    }
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
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
