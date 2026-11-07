import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminAuthService } from '@/services/adminAuthService';
import { hasPermission, hasAnyPermission } from '@/utils/permissions';
import { ApiError } from '@/services/api';
const STORAGE_KEY = 'admin_portal_session';
const AdminAuthContext = createContext(null);
function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function AdminAuthProvider({
  children
}) {
  const [session, setSession] = useState(() => readSession());
  const [isLoading, setIsLoading] = useState(false);
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const result = await adminAuthService.login({
        email,
        password
      });
      const next = {
        admin: result.admin,
        token: result.token
      };
      setSession(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      throw err instanceof Error ? err : new ApiError('Login failed');
    } finally {
      setIsLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    await adminAuthService.logout();
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Keep session fresh if admin record changed (e.g. suspended)
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    adminAuthService.listAdmins().then(admins => {
      if (cancelled) return;
      const fresh = admins.find(a => a.id === session.admin.id);
      if (!fresh || fresh.status === 'SUSPENDED') {
        setSession(null);
        localStorage.removeItem(STORAGE_KEY);
      } else if (fresh !== session.admin) {
        const next = {
          ...session,
          admin: fresh
        };
        setSession(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    }).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [session]);
  const value = useMemo(() => ({
    admin: session?.admin ?? null,
    token: session?.token ?? null,
    isAuthenticated: !!session,
    isLoading,
    login,
    logout,
    can: permission => hasPermission(session?.admin.role, permission),
    canAny: permissions => hasAnyPermission(session?.admin.role, permissions),
    role: session?.admin.role ?? null
  }), [session, isLoading, login, logout]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
export function useAdminAuthContext() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
  return ctx;
}
