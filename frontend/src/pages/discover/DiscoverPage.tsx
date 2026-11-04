import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Map } from 'lucide-react';
import { DiscoveryFilters } from './DiscoveryFilters';
import { PeopleGrid } from './PeopleGrid';
import { NearbyMap } from './NearbyMap';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useConnectionContext } from '@/context/ConnectionContext';
import { useAuth } from '@/hooks/useAuth';

export const DiscoverPage: React.FC = () => {
  const { user } = useAuth();
  const { users, filters, updateFilters, resetFilters } = useDiscovery();
  const { sendRequest, acceptRequest, rejectRequest } = useConnectionContext();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Discover Migrants Nearby
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Connect with people from your state or speaking your language across Gurugram.
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Proximity Map</span>
          </button>
        </div>
      </div>

      {/* Discovery Filters Bar */}
      <DiscoveryFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
        resultCount={users.length}
      />

      {/* Content: Map or Grid */}
      {viewMode === 'map' ? (
        <NearbyMap
          users={users}
          currentLocality={user?.currentLocation?.locality || 'Cyber City'}
          onSelectUser={(userId) => navigate(`/profile/${userId}`)}
        />
      ) : (
        <PeopleGrid
          users={users}
          onConnect={(id) => sendRequest(id)}
          onAccept={(id) => acceptRequest(id)}
          onReject={(id) => rejectRequest(id)}
        />
      )}
    </div>
  );
};
