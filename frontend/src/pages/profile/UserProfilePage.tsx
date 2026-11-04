import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Compass,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Home,
} from 'lucide-react';
import { useUserContext } from '@/context/UserContext';
import { useConnectionContext } from '@/context/ConnectionContext';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ConnectionButton } from '@/components/shared/ConnectionButton';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getUserById } = useUserContext();
  const {
    sendRequest,
    acceptRequest,
    rejectRequest,
    getConnectionStatus,
  } = useConnectionContext();

  const user = getUserById(id || '');

  if (!user) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Member Not Found</h2>
        <p className="text-xs text-gray-500 mb-4">The profile you are looking for may have moved or doesn't exist.</p>
        <Link to="/discover">
          <Button size="sm">Back to Discover</Button>
        </Link>
      </div>
    );
  }

  const motherTongue = typeof user.motherTongue === 'string' ? user.motherTongue : (user.motherTongue as any)?.name || 'Language';
  const hometownCity = user.hometown?.city || 'Hometown';
  const hometownState = user.hometown?.state || 'State';
  const locality = user.currentLocation?.locality || 'Gurugram';
  const distance = user.approximateDistance || (user.distanceFromCurrentUser ? `${user.distanceFromCurrentUser} km away` : 'Nearby');
  const status = getConnectionStatus(user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/discover"
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to People Directory
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="h-36 bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800" />
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-14 mb-4 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="w-24 h-24 rounded-2xl ring-4 ring-white bg-white shadow-md overflow-hidden">
                <Avatar
                  src={user.avatar || user.photo}
                  name={user.fullName}
                  size="xl"
                  className="w-full h-full rounded-2xl"
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{user.fullName}</h1>
                  <Badge variant="primary" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                    {motherTongue}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{user.profession || 'Migrant Member'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ConnectionButton
                status={status}
                onConnect={() => sendRequest(user.id)}
                onAccept={() => acceptRequest(user.id)}
                onReject={() => rejectRequest(user.id)}
              />
              <Link to="/messages">
                <Button size="sm" variant="outline" className="text-xs">
                  <MessageSquare className="w-3.5 h-3.5 mr-1" />
                  Message
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mt-4">
            {user.bio || 'Exploring communities and meeting fellow hometown friends in NCR.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Hometown: <strong className="text-gray-900 font-semibold">{hometownCity}, {hometownState}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Location: <strong className="text-gray-900 font-semibold">{locality} ({distance})</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Living In: <strong className="text-gray-900 font-semibold">{user.livingSituation || 'Rented Apartment'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Interests Card */}
      {user.interests && user.interests.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
            Interests & Hobbies
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

