import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input, Select } from '@/components/common/Input';
import { usePageSettings } from '@/hooks/usePageSettings';
import { ADMIN_ROUTES } from '@/utils/constants';
import { CheckCircle2 } from 'lucide-react';

const DEFAULTS = {
  platformName: 'MigrantConnect',
  supportEmail: 'support@migrantconnect.in',
  defaultLanguage: 'en',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD MMM YYYY',
  itemsPerPage: '20'
};

export default function GeneralSettingsPage() {
  const { form, setField, save, saved, isSaving, error } = usePageSettings('generalSettings', DEFAULTS);

  const handleSave = e => {
    e.preventDefault();
    void save();
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="General Settings"
        description="Basic platform identity and regional preferences."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Settings', to: ADMIN_ROUTES.settings },
          { label: 'General' }
        ]}
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSave} className="card space-y-5 p-6">
        <Input
          label="Platform name"
          name="platformName"
          value={form.platformName}
          onChange={e => setField('platformName', e.target.value)}
        />
        <Input
          label="Support email"
          name="supportEmail"
          type="email"
          value={form.supportEmail}
          onChange={e => setField('supportEmail', e.target.value)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Default language" name="defaultLanguage" value={form.defaultLanguage} onChange={e => setField('defaultLanguage', e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="ml">Malayalam</option>
            <option value="kn">Kannada</option>
            <option value="mr">Marathi</option>
            <option value="bn">Bengali</option>
          </Select>
          <Select label="Timezone" name="timezone" value={form.timezone} onChange={e => setField('timezone', e.target.value)}>
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Date format" name="dateFormat" value={form.dateFormat} onChange={e => setField('dateFormat', e.target.value)}>
            <option value="DD MMM YYYY">DD MMM YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </Select>
          <Select label="Default page size" name="itemsPerPage" value={form.itemsPerPage} onChange={e => setField('itemsPerPage', e.target.value)}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
        </div>

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
