import { Link } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { ADMIN_ROUTES } from '@/utils/constants';
import { ChevronRight, Globe, Lock, Server, Settings, Wrench } from 'lucide-react';

const SECTIONS = [
  {
    title: 'General Settings',
    description: 'Platform name, default language, timezone and regional preferences.',
    to: ADMIN_ROUTES.settings,
    icon: <Settings className="h-5 w-5" />
  },
  {
    title: 'Platform Settings',
    description: 'Registration rules, content defaults, file upload limits and feature flags.',
    to: ADMIN_ROUTES.platformSettings,
    icon: <Globe className="h-5 w-5" />
  },
  {
    title: 'Security Settings',
    description: 'Password policy, session timeouts, two-factor authentication and audit retention.',
    to: ADMIN_ROUTES.securitySettings,
    icon: <Lock className="h-5 w-5" />
  },
  {
    title: 'Maintenance',
    description: 'Enable maintenance mode and configure the message shown to users.',
    to: ADMIN_ROUTES.maintenance,
    icon: <Wrench className="h-5 w-5" />
  }
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure platform-wide preferences and operational controls."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Settings' }
        ]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SECTIONS.map(section => (
          <Link
            key={section.to}
            to={section.to}
            className="card group flex items-start gap-4 p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              {section.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{section.title}</h3>
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-1 text-sm text-slate-500">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card mt-4 flex items-start gap-3 p-5">
        <Server className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
        <p className="text-sm text-slate-500">
          Settings are stored locally in this prototype. In production they are persisted by the backend
          and changes are recorded in the audit log.
        </p>
      </div>
    </div>
  );
}
