import { useCallback, useEffect, useState } from 'react';
import { analyticsService } from '@/services/analyticsService';
export function useAnalytics() {
  const [userGrowth, setUserGrowth] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [cities, setCities] = useState([]);
  const [engagement, setEngagement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [growth, lang, city, eng] = await Promise.all([analyticsService.getUserGrowth(), analyticsService.getLanguageDistribution(), analyticsService.getCityDistribution(), analyticsService.getEngagement()]);
      setUserGrowth(growth);
      setLanguages(lang);
      setCities(city);
      setEngagement(eng);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return {
    userGrowth,
    languages,
    cities,
    engagement,
    isLoading,
    error,
    refresh
  };
}
