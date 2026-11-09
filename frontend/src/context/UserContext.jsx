import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { memberToUser, toUserSummary, userService } from '@/services/userService';
import { connectionService } from '@/services/connectionService';
import { messageService } from '@/services/messageService';
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
  const userId = user?.id;
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await userService.getUsers();
      // Merge lightweight directory entries for people the discovery feed does
      // not surface (connections, conversation peers) so name/avatar lookups
      // keep working across the app.
      const known = new Set(rows.map(row => String(row.id)));
      const extras = [];
      if (userId) {
        const [connections, conversations] = await Promise.allSettled([
          connectionService.getForUser(userId),
          messageService.getConversations(userId)
        ]);
        if (connections.status === 'fulfilled') {
          connections.value.forEach(connection => {
            const otherId = connection.requesterId === Number(userId) ? connection.receiverId : connection.requesterId;
            const name = connection.requesterId === Number(userId) ? connection.receiverName : connection.requesterName;
            if (!known.has(String(otherId))) extras.push(memberToUser({ userId: otherId, displayName: name }));
          });
        }
        if (conversations.status === 'fulfilled') {
          conversations.value.forEach(summary => {
            if (summary.peerId && !known.has(String(summary.peerId))) {
              extras.push(memberToUser({ userId: summary.peerId, displayName: summary.peer?.displayName, avatarUrl: summary.peer?.avatarUrl }));
            }
          });
        }
      }
      setUsers([...rows, ...extras]);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const summaries = useMemo(() => {
    const origin = user?.profile?.latitude !== undefined && user?.profile?.longitude !== undefined ? {
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
    getUserById: id => users.find(row => row.id === Number(id)),
    getSummaryById: id => summaries.find(row => row.id === Number(id))
  }), [isLoading, refresh, summaries, users]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used inside a UserProvider');
  return context;
}
