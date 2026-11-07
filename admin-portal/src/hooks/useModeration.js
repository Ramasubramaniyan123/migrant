import { useCallback, useEffect, useState } from 'react';
import { moderationService } from '@/services/moderationService';
export function useModerationReports(params = {}) {
  const [result, setResult] = useState({
    items: [],
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await moderationService.listReports(JSON.parse(paramsKey));
      setResult({
        items: res.items,
        total: res.total
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, [paramsKey]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return {
    reports: result.items,
    total: result.total,
    isLoading,
    error,
    refresh
  };
}
