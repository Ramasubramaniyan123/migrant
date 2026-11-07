import { useCallback, useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
export function useDashboard() {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setOverview(await dashboardService.getOverview());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return {
    overview,
    isLoading,
    error,
    refresh
  };
}
