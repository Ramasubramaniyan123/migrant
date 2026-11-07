import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
const AuthContext = createContext(undefined);
export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const session = authService.getCurrentSession();
    setUser(session?.user ?? null);
    setIsLoading(false);
  }, []);
  const persist = useCallback(next => {
    authService.updateStoredUser(next);
    setUser(next);
  }, []);
  const login = useCallback(async payload => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await authService.login(payload);
      persist(session.user);
      return session.user;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to sign in';
      setError(message);
      throw cause;
    } finally {
      setIsLoading(false);
    }
  }, [persist]);
  const register = useCallback(async payload => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await authService.register(payload);
      persist(session.user);
      return session.user;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to create account';
      setError(message);
      throw cause;
    } finally {
      setIsLoading(false);
    }
  }, [persist]);
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);
  const updateProfile = useCallback(async patch => {
    if (!user) return;
    const updated = await userService.updateProfile(user.id, patch);
    persist(updated);
  }, [persist, user]);
  const completeOnboarding = useCallback(async patch => {
    if (!user) return;
    const updated = await userService.completeOnboarding(user.id, patch);
    persist(updated);
  }, [persist, user]);
  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    completeOnboarding,
    clearError: () => setError(null)
  }), [completeOnboarding, error, isLoading, login, logout, register, updateProfile, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used inside an AuthProvider');
  return context;
}
