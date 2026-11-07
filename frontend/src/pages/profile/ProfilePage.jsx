import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { communityService } from '@/services/communityService';
import { languageById } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { useConnections } from '@/hooks/useConnections';
import { PROFICIENCY_LABELS, ROUTES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import LocationBadge from '@/components/shared/LocationBadge';
const PRIVACY_LABELS = {
  showHometown: 'Hometown visible',
  showExactLocation: 'Exact location shared',
  allowConnectionRequests: 'Open to connection requests',
  showOnlineStatus: 'Online status visible'
};

/** Read-only overview of the signed-in user's own profile. */
export default function ProfilePage() {
  const {
    user,
    isLoading
  } = useAuth();
  const {
    accepted
  } = useConnections();
  const [communityCount, setCommunityCount] = useState(0);
  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    void communityService.getMembershipsForUser(userId).then(rows => setCommunityCount(rows.length)).catch(() => setCommunityCount(0));
  }, [userId]);
  if (isLoading) {
    return <Loader fullScreen label="Loading profile…" />;
  }
  if (!user) {
    return <EmptyState title="Sign in required" description="Please sign in to view your profile." action={<Link to={ROUTES.login}>
            <Button>Go to sign in</Button>
          </Link>} />;
  }
  const {
    profile
  } = user;
  const fullNameValue = `${profile.firstName} ${profile.lastName}`.trim();
  return <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={fullNameValue} src={profile.avatarUrl} size="xl" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="page-title">{fullNameValue}</h1>
                {user.isVerified && <Badge variant="success">Verified</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {profile.currentCity && <LocationBadge city={profile.currentCity} country={profile.currentCountry} approximate />}
                {profile.hometownCity && <span className="text-slate-500">
                    From {[profile.hometownCity, profile.hometownCountry].filter(Boolean).join(', ')}
                  </span>}
              </div>
              {profile.bio && <p className="max-w-xl text-sm text-slate-600">{profile.bio}</p>}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link to={ROUTES.editProfile}>
              <Button>Edit profile</Button>
            </Link>
            <Link to={ROUTES.settings}>
              <Button variant="ghost">Settings</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <p className="text-2xl font-semibold text-slate-900">{accepted.length}</p>
          <p className="muted">Connections</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-semibold text-slate-900">{communityCount}</p>
          <p className="muted">Communities joined</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-semibold text-slate-900">{profile.languages.length}</p>
          <p className="muted">Languages</p>
        </div>
      </div>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Languages</h2>
        {profile.languages.length === 0 ? <p className="muted">No languages added yet.</p> : <div className="flex flex-wrap gap-2">
            {profile.languages.map(entry => {
          const language = languageById(entry.languageId);
          if (!language) return null;
          return <span key={entry.languageId} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                  {language.name}
                  <span className="text-xs text-slate-500">{PROFICIENCY_LABELS[entry.proficiency]}</span>
                  {entry.isPrimary && <Badge variant="brand" size="sm">Primary</Badge>}
                </span>;
        })}
          </div>}
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Interests</h2>
        {profile.interests.length === 0 ? <p className="muted">No interests added yet.</p> : <div className="flex flex-wrap gap-2">
            {profile.interests.map(interest => <Badge key={interest} variant="neutral" size="md">
                {interest}
              </Badge>)}
          </div>}
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">About</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-800">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Member since</dt>
            <dd className="font-medium text-slate-800">{formatDate(user.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Verification</dt>
            <dd>
              {user.isVerified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Unverified</Badge>}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Privacy</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {Object.entries(profile.privacy).map(([key, value]) => <li key={key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <span className="text-slate-600">{PRIVACY_LABELS[key] ?? key}</span>
              <Badge variant={value ? 'success' : 'neutral'} size="sm">
                {value ? 'On' : 'Off'}
              </Badge>
            </li>)}
        </ul>
        <Link to={ROUTES.settings} className="text-sm font-medium text-brand-700 hover:underline">
          Manage privacy settings →
        </Link>
      </section>
    </div>;
}
