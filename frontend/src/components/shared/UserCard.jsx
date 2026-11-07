import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { MATCH_REASON_LABELS } from '@/utils/constants';
import { formatDistance, truncate } from '@/utils/formatters';
import { matchScoreBucket } from '@/utils/distanceCalculator';
const SCORE_BUCKET_CLASSES = {
  high: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-slate-100 text-slate-600 ring-slate-200'
};

/** Compact profile card used in discover, hometown and connection lists. */
export default function UserCard({
  user,
  matchReason,
  connectionStatus,
  onSendRequest,
  onMessage,
  onViewProfile,
  isBusy = false
}) {
  const matchScore = user.matchScore;
  const matchReasonLabel = matchReason ? MATCH_REASON_LABELS[matchReason] : undefined;
  const hometown = [user.hometownCity, user.hometownCountry].filter(Boolean).join(', ');
  return <article className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar name={user.fullName} src={user.avatarUrl} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            {onViewProfile ? <button type="button" onClick={onViewProfile} className="truncate text-left text-base font-semibold text-slate-900 hover:text-brand-700">
                {user.fullName}
              </button> : <h3 className="truncate text-base font-semibold text-slate-900">{user.fullName}</h3>}

            {matchScore !== undefined ? <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${SCORE_BUCKET_CLASSES[matchScoreBucket(matchScore)]}`}>
                {matchScore}% match
              </span> : null}
          </div>

          <div className="mt-1 space-y-0.5">
            {hometown ? <p className="muted">From {hometown}</p> : null}
            {user.currentCity ? <p className="muted">Lives in {user.currentCity}</p> : null}
            <p className="muted">{formatDistance(user.distanceKm)}</p>
          </div>
        </div>
      </div>

      {user.bio ? <p className="text-sm text-slate-600">{truncate(user.bio, 120)}</p> : null}

      <div className="flex flex-wrap items-center gap-2">
        {matchReasonLabel ? <Badge variant="brand">{matchReasonLabel}</Badge> : null}
        {user.interests.slice(0, 3).map(interest => <Badge key={interest} variant="neutral">
            {interest}
          </Badge>)}
      </div>

      {user.languageNames.length > 0 ? <div className="flex flex-wrap items-center gap-2">
          {user.languageNames.slice(0, 3).map(language => <Badge key={language} variant="success">
              {language}
            </Badge>)}
        </div> : null}

      <div className="mt-1 flex items-center gap-2 border-t border-slate-100 pt-4">
        {connectionStatus === 'ACCEPTED' ? <Button variant="primary" size="sm" onClick={onMessage} disabled={!onMessage}>
            Message
          </Button> : connectionStatus === 'PENDING' ? <Button variant="secondary" size="sm" disabled>
            Request sent
          </Button> : connectionStatus ? <Button variant="secondary" size="sm" disabled>
            Connected
          </Button> : <Button variant="primary" size="sm" isLoading={isBusy} onClick={onSendRequest} disabled={!onSendRequest}>
            Connect
          </Button>}

        {onViewProfile ? <Button variant="ghost" size="sm" onClick={onViewProfile}>
            View profile
          </Button> : null}
      </div>
    </article>;
}
