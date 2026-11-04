import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { LANGUAGES, LOCALITIES } from '@/data/constants';
import { Button } from '@/components/common/Button';
import type { DiscoveryFiltersState } from '@/hooks/useDiscovery';

interface DiscoveryFiltersProps {
  filters: DiscoveryFiltersState;
  onFilterChange: (filters: Partial<DiscoveryFiltersState>) => void;
  onReset: () => void;
  resultCount: number;
}

export const DiscoveryFilters: React.FC<DiscoveryFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  resultCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          placeholder="Search by name, profession, or keywords (e.g. Tenkasi, React, Doctor)..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Language */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Mother Tongue</label>
          <select
            value={filters.language}
            onChange={(e) => onFilterChange({ language: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Hometown query */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Hometown / State</label>
          <input
            type="text"
            value={filters.hometown}
            onChange={(e) => onFilterChange({ hometown: e.target.value })}
            placeholder="e.g. Madurai, Kerala"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
          </input>
        </div>

        {/* Locality */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Locality in Gurugram</label>
          <select
            value={filters.locality}
            onChange={(e) => onFilterChange({ locality: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Gurugram Localities</option>
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Range */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-gray-700">Radius</label>
            <span className="text-xs font-bold text-indigo-600">Within {filters.maxDistance} km</span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            value={filters.maxDistance}
            onChange={(e) => onFilterChange({ maxDistance: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
          />
        </div>
      </div>

      {/* Footer info & reset */}
      <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs">
        <span className="text-gray-500 font-medium">
          Showing <strong className="text-gray-900">{resultCount}</strong> members nearby
        </span>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset filters
        </button>
      </div>
    </div>
  );
};
