import apiClient from './api/apiClient';

const communityService = {
  // List public communities
  listCommunities: async (query = '', page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    if (query) params.append('query', query);
    
    const response = await apiClient.get(`/communities?${params.toString()}`);
    return response.data;
  },

  // Get my communities
  getMyCommunities: async (page = 0, size = 50) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/communities/mine?${params.toString()}`);
    return response.data;
  },

  // Get pending invitations
  getInvitations: async () => {
    const response = await apiClient.get('/communities/invitations');
    return response.data;
  },

  // Get community details
  getCommunityDetails: async (id) => {
    const response = await apiClient.get(`/communities/${id}`);
    return response.data;
  },

  // Get community members
  getCommunityMembers: async (id, page = 0, size = 50) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/communities/${id}/members?${params.toString()}`);
    return response.data;
  },

  // Create community
  createCommunity: async (data) => {
    const response = await apiClient.post('/communities', data);
    return response.data;
  },

  // Update community
  updateCommunity: async (id, data) => {
    const response = await apiClient.put(`/communities/${id}`, data);
    return response.data;
  },

  // Archive community
  archiveCommunity: async (id) => {
    const response = await apiClient.post(`/communities/${id}/archive`);
    return response.data;
  },

  // Delete community
  deleteCommunity: async (id) => {
    const response = await apiClient.delete(`/communities/${id}`);
    return response.data;
  },

  // Join community
  joinCommunity: async (id) => {
    const response = await apiClient.post(`/communities/${id}/join`);
    return response.data;
  },

  // Leave community
  leaveCommunity: async (id) => {
    const response = await apiClient.post(`/communities/${id}/leave`);
    return response.data;
  },

  // Remove member
  removeMember: async (communityId, userId) => {
    const response = await apiClient.delete(`/communities/${communityId}/members/${userId}`);
    return response.data;
  },

  // Set member role
  setMemberRole: async (communityId, userId, role) => {
    const response = await apiClient.patch(`/communities/${communityId}/members/${userId}/role`, { role });
    return response.data;
  },

  // Invite user
  inviteUser: async (communityId, userId) => {
    const response = await apiClient.post(`/communities/${communityId}/invitations`, { userId });
    return response.data;
  },

  // Accept invitation
  acceptInvitation: async (invitationId) => {
    const response = await apiClient.post(`/communities/invitations/${invitationId}/accept`);
    return response.data;
  },

  // Decline invitation
  declineInvitation: async (invitationId) => {
    const response = await apiClient.post(`/communities/invitations/${invitationId}/decline`);
    return response.data;
  },
};

export default communityService;
