import { useState } from 'react';
import { cn } from '@/utils/helpers';
import AccountSettings from './AccountSettings';
import PrivacySettings from './PrivacySettings';
import ThemeToggle from '@/components/common/ThemeToggle';

const TABS = [{
  key: 'privacy',
  label: 'Privacy'
}, {
  key: 'account',
  label: 'Account'
}, {
  key: 'appearance',
  label: 'Appearance'
}];

function AppearanceSettings() {
  return (
    <section className="card space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Theme & Appearance</h2>
        <p className="muted mt-1">Choose between light, dark, or system preference mode.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <div>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Interface Theme</span>
          <p className="muted text-xs">Switch how the platform looks to suit your eyes and lighting conditions.</p>
        </div>
        <ThemeToggle variant="segmented" />
      </div>
    </section>
  );
}

/** Settings hub that groups privacy, account and appearance controls behind tabs. */
export default function SettingsPage() {
  const [tab, setTab] = useState('privacy');
  return <div className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <h1 className="page-title">Settings</h1>
        <p className="muted mt-1">Control what you share, how your account behaves, and appearance.</p>
      </header>

      <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {TABS.map(item => <button key={item.key} type="button" onClick={() => setTab(item.key)} className={cn('flex-1 rounded-md px-4 py-2 text-sm font-medium transition', tab === item.key ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200')}>
            {item.label}
          </button>)}
      </div>

      {tab === 'privacy' ? <PrivacySettings /> : tab === 'account' ? <AccountSettings /> : <AppearanceSettings />}
    </div>;
}
