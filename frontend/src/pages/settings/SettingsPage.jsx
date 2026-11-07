import { useState } from 'react';
import { cn } from '@/utils/helpers';
import AccountSettings from './AccountSettings';
import PrivacySettings from './PrivacySettings';
const TABS = [{
  key: 'privacy',
  label: 'Privacy'
}, {
  key: 'account',
  label: 'Account'
}];

/** Settings hub that groups privacy and account controls behind tabs. */
export default function SettingsPage() {
  const [tab, setTab] = useState('privacy');
  return <div className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <h1 className="page-title">Settings</h1>
        <p className="muted mt-1">Control what you share and how your account behaves.</p>
      </header>

      <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {TABS.map(item => <button key={item.key} type="button" onClick={() => setTab(item.key)} className={cn('flex-1 rounded-md px-4 py-2 text-sm font-medium transition', tab === item.key ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
            {item.label}
          </button>)}
      </div>

      {tab === 'privacy' ? <PrivacySettings /> : <AccountSettings />}
    </div>;
}
