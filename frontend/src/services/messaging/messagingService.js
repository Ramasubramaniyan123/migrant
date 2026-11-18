import api from '../api/axiosInstance'
import { unwrap, normalizePage } from '../api/apiClient'

export const messagingService = {
  conversations: async ({ page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/messaging/conversations', { params: { page, size } }))
    return normalizePage(data)
  },
  createConversation: async (userId) =>
    unwrap(await api.post('/v1/messaging/conversations', { userId })),
  history: async (conversationId, { page = 0, size = 50 } = {}) => {
    const data = unwrap(await api.get(`/v1/messaging/conversations/${conversationId}/messages`, { params: { page, size } }))
    return normalizePage(data)
  },
  send: async (conversationId, content) =>
    unwrap(await api.post('/v1/messaging/send', { conversationId, content })),
  markRead: async (conversationId) =>
    unwrap(await api.post(`/v1/messaging/conversations/${conversationId}/read`)),
  unreadCount: async () => unwrap(await api.get('/v1/messaging/unread/count')),
}
