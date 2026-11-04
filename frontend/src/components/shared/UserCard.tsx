import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { ConnectionButton } from './ConnectionButton';
import type { User, UserSummary, UserCardData } from '@/types';

interface ExtendedUserCardProps {
  user: User | UserSummary | UserCardData | any;
  showLocation?: boolean;
  onConnect?: (userId: string) => void;
  onAccept?: (userId: string) => void;
  onReject?: (userId: string) => void;
  className?: string;
}

export const UserCard: React.FC<ExtendedUserCardProps> = ({
  user,
  showLocation = true,
  onConnect,
  onAccept,
  onReject,
  className = '',
}) => {
  const id = user.id;
  const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Member';
  const avatar = user.avatar || user.photo;
  const motherTongue = user.motherTongue?.name || (typeof user.motherTongue === 'string' ? user.motherTongue : undefined);
  const profession = user.profession;
  const hometown = user.hometown
    ? typeof user.hometown === 'string'
      ? user.hometown
      : `${user.hometown.city || ''}${user.hometown.state ? `, ${user.hometown.state}` : ''}`
    : undefined;
  const locationText = user.currentLocation
    ? typeof user.currentLocation === 'string'
      ? user.currentLocation
      : `${user.currentLocation.locality || user.currentLocation.city || ''}${user.currentLocation.city && user.currentLocation.locality ? `, ${user.currentLocation.city}` : ''}`
    : user.currentCity || (user.locality ? `${user.locality}, Gurugram` : undefined);
  const distance = user.approximateDistance || (user.distanceFromCurrentUser ? `${user.distanceFromCurrentUser} km away` : undefined);
  const interests: string[] = user.interests || user.sharedInterests || [];
  const connectionStatus = user.connectionStatus || 'none';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <Link to={`/profile/${id}`} className="flex items-center space-x-3 group">
            <Avatar src={avatar} name={fullName} size="lg" />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                {fullName}
              </h3>
              {profession && (
                <p className="text-xs text-gray-500 truncate">{profession}</p>
              )}
            </div>
          </Link>
          {motherTongue && (
            <Badge variant="primary" size="sm" className="bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
              {motherTongue}
            </Badge>
          )}
        </div>

        {/* Location & Hometown */}
        <div className="mt-3 space-y-1 text-xs text-gray-600">
          {hometown && (
            <div className="flex items-center text-gray-500">
              <Compass className="w-3.5 h-3.5 mr-1 text-indigo-500 shrink-0" />
              <span className="truncate">From <strong className="text-gray-700 font-medium">{hometown}</strong></span>
            </div>
          )}
          {showLocation && (locationText || distance) && (
            <div className="flex items-center text-gray-500">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500 shrink-0" />
              <span className="truncate">{locationText || distance} {distance && locationText ? `(${distance})` : ''}</span>
            </div>
          )}
        </div>

        {/* Shared interests */}
        {interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {interests.slice(0, 3).map((interest, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal bg-gray-100 text-gray-600">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-500" />
                {interest}
              </span>
            ))}
            {interests.length > 3 && (
              <span className="text-[11px] text-gray-400 self-center">
                +{interests.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <Link
          to={`/profile/${id}`}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
        >
          View Profile
        </Link>
        <ConnectionButton
          status={connectionStatus}
          onConnect={onConnect ? () => onConnect(id) : undefined}
          onAccept={onAccept ? () => onAccept(id) : undefined}
          onReject={onReject ? () => onReject(id) : undefined}
        />
      </div>
    </div>
  );
};
