import apiClient from './api/apiClient';

const messageService = {
  // Get conversations
  getConversations: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/messaging/conversations?${params.toString()}`);
    return response.data;
  },

  // Create or get conversation
  createConversation: async (participantIds) => {
    const response = await apiClient.post('/messaging/conversations', { participantIds });
    return response.data;
  },

  // Get message history
  getMessages: async (conversationId, page = 0, size = 50) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/messaging/conversations/${conversationId}/messages?${params.toString()}`);
    return response.data;
  },

  // Send message
  sendMessage: async (conversationId, content) => {
    const response = await apiClient.post('/messaging/send', { conversationId, content });
    return response.data;
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    const response = await apiClient.post(`/messaging/conversations/${conversationId}/read`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await apiClient.get('/messaging/unread/count');
    return response.data;
  },
};

export default messageService;
