import { api } from './api';
import type { Connection, SendConnectionRequest } from '@/types';

export const connectionService = {
  async sendConnectionRequest(data: SendConnectionRequest): Promise<Connection> {
    const response = await api.post<Connection>('/connections', data);
    return response.data;
  },

  async acceptConnectionRequest(connectionId: string): Promise<Connection> {
    const response = await api.put<Connection>(`/connections/${connectionId}/accept`);
    return response.data;
  },

  async rejectConnectionRequest(connectionId: string): Promise<Connection> {
    const response = await api.put<Connection>(`/connections/${connectionId}/reject`);
    return response.data;
  },

  async getReceivedRequests(): Promise<Connection[]> {
    const response = await api.get<Connection[]>('/connections/received');
    return response.data;
  },

  async getSentRequests(): Promise<Connection[]> {
    const response = await api.get<Connection[]>('/connections/sent');
    return response.data;
  },

  async getConnections(): Promise<Connection[]> {
    const response = await api.get<Connection[]>('/connections');
    return response.data;
  },

  async removeConnection(connectionId: string): Promise<void> {
    await api.delete(`/connections/${connectionId}`);
  },

  async blockUser(userId: string): Promise<void> {
    await api.post(`/connections/block/${userId}`);
  },
};
