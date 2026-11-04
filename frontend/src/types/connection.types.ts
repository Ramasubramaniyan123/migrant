export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface ConnectionUser {
  id: string;
  fullName: string;
  avatar: string;
  motherTongue: string;
  hometown: string;
  profession: string;
  approximateDistance: string;
  sharedInterests: string[];
}

export interface Connection {
  id: string;
  userId: string;
  requesterId: string;
  receiverId: string;
  status: ConnectionStatus;
  connectedDate?: string;
  requestSentDate?: string;
  message?: string;
  matchScore?: number;
  matchedBy?: 'HOMETOWN' | 'LANGUAGE' | 'LOCATION' | 'INTERESTS';
  createdAt: string;
  updatedAt: string;
  user?: ConnectionUser;
}

export interface ConnectionRequest {
  id: string;
  requester: ConnectionUser;
  receiver: ConnectionUser;
  status: ConnectionStatus;
  message?: string;
  requestSentDate: string;
  createdAt: string;
}

export interface AcceptedConnection {
  id: string;
  user: ConnectionUser;
  connectedDate: string;
  messageCount?: number;
  lastMessageDate?: string;
}

export interface SendConnectionRequest {
  receiverId: string;
  message?: string;
}

export interface ConnectionStats {
  totalConnections: number;
  pendingReceived: number;
  pendingSent: number;
  connectionsThisMonth: number;
}
