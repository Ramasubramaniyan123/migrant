import { languageById } from '@/services/userService';
import { formatCount, truncate } from '@/utils/formatters';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import LocationBadge from '@/components/shared/LocationBadge';
/** Summary card for a single community with quick join/leave control. */
export default function CommunityCard({
  community,
  isMember = false,
  onOpen,
  onToggleMembership
}) {
  const language = languageById(community.languageId);
  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };
  return <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={handleKeyDown} className="card flex h-full cursor-pointer flex-col gap-3 transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-500">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">{community.name}</h2>
        {isMember && <Badge variant="brand" size="sm">Member</Badge>}
      </div>

      <p className="text-sm text-slate-600">{truncate(community.description, 130)}</p>

      <div className="flex flex-wrap items-center gap-2">
        {language && <Badge variant="neutral" size="sm">
            {language.name}
          </Badge>}
        <LocationBadge city={community.locationCity} country={community.locationCountry} />
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="text-sm font-medium text-slate-500">
          {formatCount(community.memberCount)} members
        </span>
        {onToggleMembership && <Button size="sm" variant={isMember ? 'secondary' : 'primary'} onClick={event => {
        event.stopPropagation();
        onToggleMembership();
      }}>
            {isMember ? 'Leave' : 'Join'}
          </Button>}
      </div>
    </div>;
}
