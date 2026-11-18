import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export const CommunityCard = ({ community }) => (
  <Link
    to={`/app/communities/${community.id}`}
    className="card group flex flex-col p-5 transition-shadow hover:shadow-lift"
  >
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
      <Users className="h-5 w-5" />
    </div>
    <h3 className="font-display text-lg font-semibold line-clamp-2">{community.name}</h3>
    {community.languageCode && (
      <p className="mt-1 text-xs uppercase tracking-wide text-ink-3">{community.languageCode}</p>
    )}
    <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-2">
      <Users className="h-3.5 w-3.5" /> {community.memberCount ?? 0} members
    </p>
  </Link>
)
