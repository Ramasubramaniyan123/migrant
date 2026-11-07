import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/helpers';
import Badge from '@/components/common/Badge';
import Loader from '@/components/common/Loader';
const OPTIONS = [{
  key: 'showHometown',
  label: 'Show my hometown',
  description: 'Let other members see the city you grew up in.'
}, {
  key: 'showExactLocation',
  label: 'Share exact location',
  description: 'Off by default — only your approximate city is ever used for matching.'
}, {
  key: 'allowConnectionRequests',
  label: 'Allow connection requests',
  description: 'Turn this off to pause new incoming requests.'
}, {
  key: 'showOnlineStatus',
  label: 'Show online status',
  description: 'Let connections see when you are active.'
}];

/** Privacy toggles backed by the signed-in user's profile. */
export default function PrivacySettings() {
  const {
    user,
    updateProfile,
    isLoading
  } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  if (isLoading) {
    return <Loader label="Loading privacy settings…" />;
  }
  if (!user) {
    return <p className="muted">Sign in to manage your privacy settings.</p>;
  }
  const {
    privacy
  } = user.profile;
  const toggle = async key => {
    setIsSaving(true);
    try {
      await updateProfile({
        privacy: {
          ...privacy,
          [key]: !privacy[key]
        }
      });
    } finally {
      setIsSaving(false);
    }
  };
  return <section className="card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Privacy</h2>
        {isSaving ? <span className="text-xs text-slate-500">Saving…</span> : null}
      </div>

      <ul className="space-y-3">
        {OPTIONS.map(option => {
        const enabled = privacy[option.key];
        return <li key={option.key} className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">{option.label}</p>
                <p className="muted mt-0.5">{option.description}</p>
              </div>

              <button type="button" role="switch" aria-checked={enabled} aria-label={option.label} onClick={() => void toggle(option.key)} className={cn('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors', enabled ? 'bg-brand-600' : 'bg-slate-300')}>
                <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', enabled ? 'translate-x-[1.375rem]' : 'translate-x-0.5')} />
              </button>
            </li>;
      })}
      </ul>

      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3">
        <Badge variant={privacy.showExactLocation ? 'warning' : 'success'} size="sm">
          {privacy.showExactLocation ? 'Exact location on' : 'Location protected'}
        </Badge>
        <p className="muted">
          Location data is always fuzzed and never shared as an exact address.
        </p>
      </div>
    </section>;
}
