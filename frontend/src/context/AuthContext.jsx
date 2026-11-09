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
  const [verificationRequired, setVerificationRequired] = useState(false);
  useEffect(() => {
    const session = authService.getCurrentSession();
    const stored = session?.user ?? null;
    setUser(stored);
    setVerificationRequired(stored?.isVerified === false);
    setIsLoading(false);
    // Refresh the profile from the API so a session restored after email
    // verification (or profile edits on another device) stays accurate.
    if (stored) {
      authService.fetchCurrentUser().then(fresh => {
        authService.updateStoredUser(fresh);
        setUser(fresh);
        setVerificationRequired(fresh.isVerified === false);
      }).catch(() => {
        // Keep the stored session — individual screens surface API errors.
      });
    }
    void userService.loadLanguages();
  }, []);
  const persist = useCallback(next => {
    authService.updateStoredUser(next);
    setUser(next);
    setVerificationRequired(next?.isVerified === false);
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
    setVerificationRequired(false);
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
    verificationRequired,
    login,
    register,
    logout,
    updateProfile,
    completeOnboarding,
    clearError: () => setError(null)
  }), [completeOnboarding, error, isLoading, login, logout, register, updateProfile, user, verificationRequired]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used inside an AuthProvider');
  return context;
}
