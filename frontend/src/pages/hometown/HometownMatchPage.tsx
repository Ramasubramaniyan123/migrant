import React, { useState } from 'react';
import { Compass, MapPin, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserContext } from '@/context/UserContext';
import { useConnectionContext } from '@/context/ConnectionContext';
import { UserCard } from '@/components/shared/UserCard';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { STATES, HOMETOWNS } from '@/data/constants';

export const HometownMatchPage: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUserContext();
  const { sendRequest, acceptRequest, rejectRequest } = useConnectionContext();

  const userHometownCity = user?.hometown?.city || 'Tenkasi';
  const userHometownState = user?.hometown?.state || 'Tamil Nadu';

  const [selectedState, setSelectedState] = useState(userHometownState);
  const [selectedCity, setSelectedCity] = useState(userHometownCity);
  const [matchScope, setMatchScope] = useState<'city' | 'state'>('city');

  const availableCities = HOMETOWNS[selectedState] || [];

  // Filter users based on scope
  const matchedUsers = users.filter((u) => {
    if (u.id === user?.id) return false;

    if (matchScope === 'city') {
      return (
        u.hometown?.city?.toLowerCase() === selectedCity.toLowerCase() &&
        u.hometown?.state?.toLowerCase() === selectedState.toLowerCase()
      );
    } else {
      return u.hometown?.state?.toLowerCase() === selectedState.toLowerCase();
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Roots & Origin Matching Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Connect with people from {selectedCity}, {selectedState}
          </h1>
          <p className="mt-2 text-orange-100 text-sm leading-relaxed">
            Relocating far from home feels easier when you meet folks who know your local bakeries, schools, festivals, and dialect nuances.
          </p>
        </div>
      </div>

      {/* Control / Scope Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Scope switch */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-700">Matching Scope:</span>
            <div className="inline-flex rounded-lg bg-gray-100 p-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setMatchScope('city')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  matchScope === 'city'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Exact City ({selectedCity})
              </button>
              <button
                type="button"
                onClick={() => setMatchScope('state')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  matchScope === 'state'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Entire State ({selectedState})
              </button>
            </div>
          </div>

          {/* Quick origin selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <select
                value={selectedState}
                onChange={(e) => {
                  const newState = e.target.value;
                  setSelectedState(newState);
                  const first = HOMETOWNS[newState]?.[0] || '';
                  setSelectedCity(first);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-800 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t border-gray-100 pt-3 flex items-center justify-between">
          <span>Found <strong className="text-gray-900">{matchedUsers.length}</strong> matching migrants in Gurugram</span>
          {matchScope === 'city' && matchedUsers.length === 0 && (
            <button
              onClick={() => setMatchScope('state')}
              className="text-orange-600 hover:underline font-semibold"
            >
              Switch to Entire State →
            </button>
          )}
        </div>
      </div>

      {/* Grid of Results */}
      {matchedUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedUsers.map((member) => (
            <UserCard
              key={member.id}
              user={member}
              onConnect={(id) => sendRequest(id)}
              onAccept={(id) => acceptRequest(id)}
              onReject={(id) => rejectRequest(id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No exact matches for {selectedCity} yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            You might be one of the pioneering migrants from {selectedCity} here! Try widening the scope to {selectedState}.
          </p>
          <Button
            size="sm"
            onClick={() => setMatchScope('state')}
            className="bg-orange-600 hover:bg-orange-700 text-xs"
          >
            Show All from {selectedState}
          </Button>
        </div>
      )}
    </div>
  );
};
