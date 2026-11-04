import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Connection, ConnectionUser } from '@/types';
import usersData from '@/data/users.json';

interface ConnectionContextType {
  connections: Connection[];
  receivedRequests: Connection[];
  sentRequests: Connection[];
  pendingRequests: number;
  sendRequest: (targetUserId: string, message?: string) => Promise<void>;
  acceptRequest: (connectionIdOrUserId: string) => Promise<void>;
  rejectRequest: (connectionIdOrUserId: string) => Promise<void>;
  removeConnection: (connectionIdOrUserId: string) => Promise<void>;
  getConnectionStatus: (userId: string) => 'not-connected' | 'pending-sent' | 'pending-received' | 'connected';
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('migrant_connections');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'conn-suresh',
        userId: 'u-suresh',
        requesterId: 'u-suresh',
        receiverId: 'user-demo',
        status: 'accepted',
        connectedDate: '2026-10-20T10:00:00Z',
        createdAt: '2026-10-18T10:00:00Z',
        updatedAt: '2026-10-20T10:00:00Z',
        user: {
          id: 'u-suresh',
          fullName: 'Suresh Varma',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
          motherTongue: 'Telugu',
          hometown: 'Visakhapatnam, Andhra Pradesh',
          profession: 'DevOps Engineer',
          approximateDistance: '2.1 km away',
          sharedInterests: ['Cricket', 'Technology'],
        },
      },
    ];
  });

  const [receivedRequests, setReceivedRequests] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('migrant_received_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'req-priya',
        userId: 'u-priya',
        requesterId: 'u-priya',
        receiverId: 'user-demo',
        status: 'pending',
        requestSentDate: '2026-11-04T08:00:00Z',
        message: 'Hi Arun, saw that we are both from Tamil Nadu and living in DLF Phase 2. Would love to connect!',
        createdAt: '2026-11-04T08:00:00Z',
        updatedAt: '2026-11-04T08:00:00Z',
        user: {
          id: 'u-priya',
          fullName: 'Priya Karthik',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
          motherTongue: 'Tamil',
          hometown: 'Madurai, Tamil Nadu',
          profession: 'Senior Product Designer',
          approximateDistance: '0.8 km away',
          sharedInterests: ['Photography', 'Food'],
        },
      },
    ];
  });

  const [sentRequests, setSentRequests] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('migrant_sent_requests');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('migrant_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('migrant_received_requests', JSON.stringify(receivedRequests));
  }, [receivedRequests]);

  useEffect(() => {
    localStorage.setItem('migrant_sent_requests', JSON.stringify(sentRequests));
  }, [sentRequests]);

  const findUserAsConnectionUser = (userId: string): ConnectionUser => {
    const found = (usersData as any[]).find((u) => u.id === userId);
    return {
      id: userId,
      fullName: found?.fullName || 'Community Member',
      avatar: found?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      motherTongue: typeof found?.motherTongue === 'string' ? found.motherTongue : (found?.motherTongue?.name || 'Language'),
      hometown: found?.hometown?.city ? `${found.hometown.city}, ${found.hometown.state}` : 'Hometown',
      profession: found?.profession || 'Professional',
      approximateDistance: found?.approximateDistance || 'Nearby',
      sharedInterests: found?.interests || [],
    };
  };

  const sendRequest = async (targetUserId: string, message?: string) => {
    const newRequest: Connection = {
      id: `req-${Date.now()}`,
      userId: targetUserId,
      requesterId: 'user-demo',
      receiverId: targetUserId,
      status: 'pending',
      requestSentDate: new Date().toISOString(),
      message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: findUserAsConnectionUser(targetUserId),
    };
    setSentRequests((prev) => [...prev, newRequest]);
  };

  const acceptRequest = async (connectionIdOrUserId: string) => {
    const req = receivedRequests.find((r) => r.id === connectionIdOrUserId || r.userId === connectionIdOrUserId || r.requesterId === connectionIdOrUserId);
    if (!req) return;

    setReceivedRequests((prev) => prev.filter((r) => r.id !== req.id));

    const newConnection: Connection = {
      ...req,
      status: 'accepted',
      connectedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConnections((prev) => [...prev, newConnection]);
  };

  const rejectRequest = async (connectionIdOrUserId: string) => {
    setReceivedRequests((prev) =>
      prev.filter((r) => r.id !== connectionIdOrUserId && r.userId !== connectionIdOrUserId && r.requesterId !== connectionIdOrUserId)
    );
  };

  const removeConnection = async (connectionIdOrUserId: string) => {
    setConnections((prev) =>
      prev.filter((c) => c.id !== connectionIdOrUserId && c.userId !== connectionIdOrUserId)
    );
  };

  const getConnectionStatus = (userId: string): 'not-connected' | 'pending-sent' | 'pending-received' | 'connected' => {
    if (connections.some((c) => c.userId === userId || c.requesterId === userId || c.receiverId === userId)) {
      return 'connected';
    }
    if (receivedRequests.some((r) => r.userId === userId || r.requesterId === userId)) {
      return 'pending-received';
    }
    if (sentRequests.some((s) => s.userId === userId || s.receiverId === userId)) {
      return 'pending-sent';
    }
    return 'not-connected';
  };

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        receivedRequests,
        sentRequests,
        pendingRequests: receivedRequests.length,
        sendRequest,
        acceptRequest,
        rejectRequest,
        removeConnection,
        getConnectionStatus,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionContext = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnectionContext must be used within a ConnectionProvider');
  }
  return context;
};
