import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Compass,
  Languages,
  Sparkles,
  Edit,
  Home,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/utils/constants';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  const motherTongue = typeof user.motherTongue === 'string' ? user.motherTongue : (user.motherTongue as any)?.name || 'Tamil';
  const hometownCity = user.hometown?.city || 'Tenkasi';
  const hometownState = user.hometown?.state || 'Tamil Nadu';
  const locality = user.currentLocation?.locality || 'Cyber City';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="h-36 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700" />
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
                    {user.role === 'admin' ? 'Community Admin' : 'Verified Migrant'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{user.profession || 'Professional'}</p>
              </div>
            </div>

            <Link to={ROUTES.EDIT_PROFILE}>
              <Button size="sm" variant="outline" className="border-gray-300 text-xs text-gray-700 shadow-xs">
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mt-4">
            {user.bio || 'New member building community connections in Gurugram.'}
          </p>

          {/* Key Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Hometown: <strong className="text-gray-900 font-semibold">{hometownCity}, {hometownState}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Current: <strong className="text-gray-900 font-semibold">{locality}, Gurugram</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Mother Tongue: <strong className="text-gray-900 font-semibold">{motherTongue}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Languages & Dialects */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center">
            <Languages className="w-4 h-4 mr-2 text-indigo-600" />
            Languages Spoken
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-xs font-bold text-indigo-950">{motherTongue}</span>
              <span className="text-[11px] font-semibold text-indigo-700">Native Tongue</span>
            </div>
            {user.additionalLanguages?.map((l) => (
              <div key={l.name} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-xs font-medium text-gray-800">{l.name}</span>
                <span className="text-[11px] text-gray-500 capitalize">{l.proficiency || 'fluent'}</span>
              </div>
            ))}
            {(!user.additionalLanguages || user.additionalLanguages.length === 0) && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-xs font-medium text-gray-800">English</span>
                <span className="text-[11px] text-gray-500">Professional</span>
              </div>
            )}
          </div>
        </div>

        {/* Living & Relocation Status */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center">
            <Home className="w-4 h-4 mr-2 text-emerald-600" />
            Relocation & Housing
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-500">Living Arrangement:</span>
              <span className="font-semibold text-gray-900">{user.livingSituation || 'Rented Apartment'}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-500">District Origin:</span>
              <span className="font-semibold text-gray-900">{user.hometown?.district || hometownCity}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
              <span className="text-gray-500">Member Since:</span>
              <span className="font-semibold text-gray-900">{user.joinedDate || '2024'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interests Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-gray-900 text-sm flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
          Passions & Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.interests?.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium"
            >
              {interest}
            </span>
          ))}
          {(!user.interests || user.interests.length === 0) && (
            <span className="text-xs text-gray-400">No interests added yet.</span>
          )}
        </div>
      </div>
    </div>
  );
};

