import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { notificationService } from '@/services/notificationService';
import { useAuthContext } from './AuthContext';
const NotificationContext = createContext(undefined);
export function NotificationProvider({
  children
}) {
  const {
    user
  } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = user?.id;
  const refresh = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setNotifications(await notificationService.getForUser(userId));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const markRead = useCallback(async id => {
    await notificationService.markRead(id);
    setNotifications(rows => rows.map(row => row.id === id ? {
      ...row,
      isRead: true
    } : row));
  }, []);
  const markAllRead = useCallback(async () => {
    if (!userId) return;
    setNotifications(await notificationService.markAllRead(userId));
  }, [userId]);
  const clearAll = useCallback(async () => {
    if (!userId) return;
    await notificationService.clear(userId);
    setNotifications([]);
  }, [userId]);
  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter(row => !row.isRead).length,
    isLoading,
    refresh,
    markRead,
    markAllRead,
    clearAll
  }), [clearAll, isLoading, markAllRead, markRead, notifications, refresh]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used inside a NotificationProvider');
  }
  return context;
}
