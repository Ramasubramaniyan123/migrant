import apiClient from './api/apiClient';

const connectionService = {
  // Send connection request
  sendRequest: async (receiverId) => {
    const response = await apiClient.post('/connections/request', { receiverId });
    return response.data;
  },

  // Accept connection request
  acceptRequest: async (connectionId) => {
    const response = await apiClient.post(`/connections/${connectionId}/accept`);
    return response.data;
  },

  // Reject connection request
  rejectRequest: async (connectionId) => {
    const response = await apiClient.post(`/connections/${connectionId}/reject`);
    return response.data;
  },

  // Cancel sent connection request
  cancelRequest: async (connectionId) => {
    const response = await apiClient.delete(`/connections/${connectionId}/cancel`);
    return response.data;
  },

  // Remove connection
  removeConnection: async (connectionId) => {
    const response = await apiClient.delete(`/connections/${connectionId}`);
    return response.data;
  },

  // Get connections
  getConnections: async (status = '', page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    if (status) params.append('status', status);
    
    const response = await apiClient.get(`/connections?${params.toString()}`);
    return response.data;
  },

  // Get pending requests (received)
  getPendingRequests: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/connections/pending?${params.toString()}`);
    return response.data;
  },

  // Get sent requests
  getSentRequests: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/connections/sent?${params.toString()}`);
    return response.data;
  },

  // Get connection count
  getConnectionCount: async () => {
    const response = await apiClient.get('/connections/count');
    return response.data;
  },

  // Check if connected with user
  checkConnection: async (userId) => {
    const response = await apiClient.get(`/connections/check/${userId}`);
    return response.data;
  },

  // Block user
  blockUser: async (userId, reason = '') => {
    const response = await apiClient.post('/blocks', { userId, reason });
    return response.data;
  },

  // Unblock user
  unblockUser: async (userId) => {
    const response = await apiClient.delete(`/blocks/${userId}`);
    return response.data;
  },

  // Get blocked users
  getBlockedUsers: async () => {
    const response = await apiClient.get('/blocks');
    return response.data;
  },
};

export default connectionService;
