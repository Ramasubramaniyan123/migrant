import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { connectionService } from '@/services/connectionService';
import { useAuthContext } from './AuthContext';
const ConnectionContext = createContext(undefined);
export function ConnectionProvider({
  children
}) {
  const {
    user
  } = useAuthContext();
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = user?.id;
  const refresh = useCallback(async () => {
    if (!userId) {
      setConnections([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setConnections(await connectionService.getForUser(userId));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const receivedRequests = useMemo(() => userId ? connections.filter(row => row.receiverId === userId && row.status === 'PENDING') : [], [connections, userId]);
  const sentRequests = useMemo(() => userId ? connections.filter(row => row.requesterId === userId && row.status === 'PENDING') : [], [connections, userId]);
  const accepted = useMemo(() => connections.filter(row => row.status === 'ACCEPTED'), [connections]);
  const acceptedUserIds = useMemo(() => userId ? accepted.map(row => row.requesterId === userId ? row.receiverId : row.requesterId) : [], [accepted, userId]);
  const sendRequest = useCallback(async (receiverId, matchScore, matchedBy) => {
    if (!userId) return;
    await connectionService.sendRequest(userId, receiverId, matchScore, matchedBy);
    await refresh();
  }, [refresh, userId]);
  const accept = useCallback(async connectionId => {
    await connectionService.acceptRequest(connectionId);
    await refresh();
  }, [refresh]);
  const reject = useCallback(async connectionId => {
    await connectionService.rejectRequest(connectionId);
    await refresh();
  }, [refresh]);
  const cancel = useCallback(async connectionId => {
    await connectionService.cancelRequest(connectionId);
    await refresh();
  }, [refresh]);
  const remove = useCallback(async connectionId => {
    await connectionService.removeConnection(connectionId);
    await refresh();
  }, [refresh]);
  const getStatus = useCallback(otherUserId => {
    if (!userId) return null;
    return connectionService.statusBetween(userId, otherUserId)?.status ?? null;
  }, [userId]);
  const value = useMemo(() => ({
    connections,
    receivedRequests,
    sentRequests,
    accepted,
    incomingCount: receivedRequests.length,
    isLoading,
    refresh,
    sendRequest,
    accept,
    reject,
    cancel,
    remove,
    getStatus,
    isConnected: otherUserId => acceptedUserIds.includes(otherUserId),
    acceptedUserIds
  }), [accept, accepted, acceptedUserIds, cancel, connections, getStatus, isLoading, receivedRequests, refresh, reject, remove, sendRequest, sentRequests]);
  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}
export function useConnectionContext() {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error('useConnectionContext must be used inside a ConnectionProvider');
  return context;
}
