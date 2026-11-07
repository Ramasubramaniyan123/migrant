import { BadgeCheck, Briefcase, MapPin } from 'lucide-react';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { formatDate, formatRelativeTime } from '@/utils/formatters';

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-800">{children ?? '—'}</span>
    </div>
  );
}

export default function UserProfileView({ user }) {
  if (!user) return null;
  return (
    <div className="card p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.fullName} className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-700">
            {user.fullName?.charAt(0) ?? '?'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-900">{user.fullName}</h2>
            <StatusBadge tone={statusTone(user.status)}>{statusLabel(user.status)}</StatusBadge>
            {user.isVerified ? (
              <StatusBadge tone="blue">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </StatusBadge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          {user.phone ? <p className="text-sm text-slate-500">{user.phone}</p> : null}
          {user.occupation ? (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-600">
              <Briefcase className="h-4 w-4 text-slate-400" />
              {user.occupation}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <MapPin className="h-4 w-4 text-slate-400" />
            Location
          </h3>
          <Row label="Hometown">{user.hometown ? `${user.hometown}${user.hometownState ? `, ${user.hometownState}` : ''}` : null}</Row>
          <Row label="Current city">{user.currentCity}</Row>
          <Row label="Locality">{user.currentLocality}</Row>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Languages</h3>
          <div className="flex flex-wrap gap-1.5 py-2">
            {(user.languages ?? []).length > 0 ? (
              user.languages.map(l => (
                <span key={l} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {l}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">—</span>
            )}
          </div>
          <Row label="Mother tongue">{user.motherTongue}</Row>
          <Row label="Joined">{user.joinedAt ? formatDate(user.joinedAt) : null}</Row>
          <Row label="Last active">{user.lastActiveAt ? formatRelativeTime(user.lastActiveAt) : null}</Row>
        </div>
      </div>
    </div>
  );
}
