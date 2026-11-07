import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toUserSummary, userService } from '@/services/userService';
import { useAuthContext } from './AuthContext';
const UserContext = createContext(undefined);
export function UserProvider({
  children
}) {
  const {
    user
  } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await userService.getUsers();
      setUsers(rows);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const summaries = useMemo(() => {
    const origin = user?.profile.latitude !== undefined && user?.profile.longitude !== undefined ? {
      latitude: user.profile.latitude,
      longitude: user.profile.longitude
    } : undefined;
    return users.map(row => toUserSummary(row, origin ? {
      from: origin
    } : {}));
  }, [user, users]);
  const value = useMemo(() => ({
    users,
    isLoading,
    refresh,
    getUserById: id => users.find(row => row.id === id),
    getSummaryById: id => summaries.find(row => row.id === id)
  }), [isLoading, refresh, summaries, users]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used inside a UserProvider');
  return context;
}
