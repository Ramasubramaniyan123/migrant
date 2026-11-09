import { useCallback, useEffect, useState } from 'react';
import { settingsService } from '@/services/settingsService';

/**
 * Loads and saves a page-specific slice of the platform settings map
 * (GET/PUT /admin/settings). `pageKey` namespaces the page's fields inside
 * the flat settings object; `defaults` are merged under saved values.
 */
export function usePageSettings(pageKey, defaults) {
  const [form, setForm] = useState(defaults);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    settingsService
      .getSettings()
      .then(all => {
        if (cancelled) return;
        const slice = all && typeof all === 'object' ? all[pageKey] : null;
        setForm({ ...defaults, ...(slice && typeof slice === 'object' ? slice : {}) });
      })
      .catch(err => {
        if (!cancelled) setError(err?.message ?? 'Failed to load settings');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // defaults is a module-level constant — safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const setField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      await settingsService.updateSettings({ [pageKey]: form });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err?.message ?? 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  }, [pageKey, form]);

  return { form, setField, save, saved, isSaving, isLoading, error };
}
