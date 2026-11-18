import api from '../api/axiosInstance'
import { unwrap, normalizePage } from '../api/apiClient'

export const notificationService = {
  list: async ({ page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/notifications', { params: { page, size } }))
    return normalizePage(data)
  },
  unread: async ({ page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/notifications/unread', { params: { page, size } }))
    return normalizePage(data)
  },
  unreadCount: async () => unwrap(await api.get('/v1/notifications/unread/count')),
  markRead: async (id) => unwrap(await api.put(`/v1/notifications/${id}/read`)),
  markAllRead: async () => unwrap(await api.put('/v1/notifications/read-all')),
  remove: async (id) => unwrap(await api.delete(`/v1/notifications/${id}`)),
}
