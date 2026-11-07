import { useCallback, useEffect, useState } from 'react';
import { discoveryService } from '@/services/discoveryService';
import { useAuthContext } from '@/context/AuthContext';
const EMPTY_FILTERS = {
  sortBy: 'match'
};

/** Filter state + result loading for the Discover and Hometown Match screens. */
export function useDiscovery(initialFilters = EMPTY_FILTERS) {
  const {
    user
  } = useAuthContext();
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const run = useCallback(async nextFilters => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const {
        users
      } = await discoveryService.discoverPeople(user, nextFilters);
      setResults(users);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load people');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  useEffect(() => {
    void run(filters);
  }, [filters, run]);
  const updateFilter = useCallback((key, value) => {
    setFilters(current => ({
      ...current,
      [key]: value
    }));
  }, []);
  const resetFilters = useCallback(() => setFilters(initialFilters), [initialFilters]);
  return {
    filters,
    results,
    isLoading,
    error,
    updateFilter,
    setFilters,
    resetFilters,
    reload: () => run(filters)
  };
}
