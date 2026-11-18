import api from '../api/axiosInstance'
import { unwrap, normalizePage } from '../api/apiClient'

export const connectionService = {
  list: async ({ status, page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/connections', { params: { status, page, size } }))
    return normalizePage(data)
  },
  pending: async ({ page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/connections/pending', { params: { page, size } }))
    return normalizePage(data)
  },
  sent: async ({ page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/connections/sent', { params: { page, size } }))
    return normalizePage(data)
  },
  count: async () => unwrap(await api.get('/v1/connections/count')),
  check: async (userId) => unwrap(await api.get(`/v1/connections/check/${userId}`)),
  sendRequest: async (receiverId) =>
    unwrap(await api.post('/v1/connections/request', { receiverId })),
  accept: async (connectionId) =>
    unwrap(await api.post(`/v1/connections/${connectionId}/accept`)),
  reject: async (connectionId) =>
    unwrap(await api.post(`/v1/connections/${connectionId}/reject`)),
  cancel: async (connectionId) =>
    unwrap(await api.delete(`/v1/connections/${connectionId}/cancel`)),
  remove: async (connectionId) =>
    unwrap(await api.delete(`/v1/connections/${connectionId}`)),
}
