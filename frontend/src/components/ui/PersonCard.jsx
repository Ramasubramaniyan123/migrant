import { Link } from 'react-router-dom'
import { MapPin, Languages, Ruler } from 'lucide-react'
import { Avatar } from '../ui/Avatar'

export const PersonCard = ({ person, action }) => {
  const location = [person.currentCity, person.hometownCity && `from ${person.hometownCity}`]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-center gap-3">
        <Avatar name={person.displayName} src={person.avatarUrl} size="lg" />
        <div className="min-w-0">
          <h3 className="truncate font-medium">{person.displayName || 'Community member'}</h3>
          {person.matchReason && (
            <p className="truncate text-xs text-accent">{person.matchReason}</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-ink-2">
        {location && (
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ink-3" /> {location}
          </p>
        )}
        {person.languages?.length > 0 && (
          <p className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5 text-ink-3" /> {person.languages.join(', ')}
          </p>
        )}
        {person.distanceKm != null && (
          <p className="flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5 text-ink-3" /> {person.distanceKm.toFixed(1)} km away
          </p>
        )}
      </div>

      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
