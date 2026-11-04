import { useState, useMemo } from 'react';
import { useUserContext } from '@/context/UserContext';

export interface DiscoveryFiltersState {
  searchQuery: string;
  language: string;
  hometown: string;
  locality: string;
  maxDistance: number;
  livingSituation?: string;
}

export const useDiscovery = () => {
  const { users } = useUserContext();
  const [filters, setFilters] = useState<DiscoveryFiltersState>({
    searchQuery: '',
    language: 'All',
    hometown: '',
    locality: 'All',
    maxDistance: 25,
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Exclude self (e.g. demo user if current)
      if (u.id === 'user-demo') return false;

      // Text search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = u.fullName.toLowerCase().includes(q);
        const matchesBio = u.bio?.toLowerCase().includes(q);
        const matchesProf = u.profession?.toLowerCase().includes(q);
        const matchesHometown = u.hometown?.city?.toLowerCase().includes(q) || u.hometown?.state?.toLowerCase().includes(q);
        if (!matchesName && !matchesBio && !matchesProf && !matchesHometown) {
          return false;
        }
      }

      // Language filter
      if (filters.language && filters.language !== 'All') {
        const langStr = typeof u.motherTongue === 'string' ? u.motherTongue : (u.motherTongue as any)?.name;
        const additional = u.additionalLanguages?.map((l) => l.name) || [];
        const legacy = u.languages || [];
        const speaks = langStr === filters.language || additional.includes(filters.language) || legacy.includes(filters.language as any);
        if (!speaks) return false;
      }

      // Hometown filter
      if (filters.hometown.trim()) {
        const htCity = u.hometown?.city?.toLowerCase() || '';
        const htState = u.hometown?.state?.toLowerCase() || '';
        const target = filters.hometown.toLowerCase();
        if (!htCity.includes(target) && !htState.includes(target)) return false;
      }

      // Locality filter
      if (filters.locality && filters.locality !== 'All') {
        const loc = u.currentLocation?.locality || '';
        if (loc !== filters.locality) return false;
      }

      // Distance filter
      if (filters.maxDistance && u.distanceFromCurrentUser) {
        if (u.distanceFromCurrentUser > filters.maxDistance) return false;
      }

      return true;
    });
  }, [users, filters]);

  const updateFilters = (newFilters: Partial<DiscoveryFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      language: 'All',
      hometown: '',
      locality: 'All',
      maxDistance: 25,
    });
  };

  return {
    users: filteredUsers,
    allUsers: users,
    filters,
    updateFilters,
    resetFilters,
  };
};
