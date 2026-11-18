import api from '../api/axiosInstance'
import { unwrap, normalizePage } from '../api/apiClient'

export const eventService = {
  list: async ({ communityId, page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/events', { params: { communityId, page, size } }))
    return normalizePage(data)
  },
  mine: async ({ page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/events/mine', { params: { page, size } }))
    return normalizePage(data)
  },
  get: async (id) => unwrap(await api.get(`/v1/events/${id}`)),
  create: async (payload) => unwrap(await api.post('/v1/events', payload)),
  update: async (id, payload) => unwrap(await api.put(`/v1/events/${id}`, payload)),
  cancel: async (id) => unwrap(await api.post(`/v1/events/${id}/cancel`)),
  register: async (id) => unwrap(await api.post(`/v1/events/${id}/register`)),
  unregister: async (id) => unwrap(await api.delete(`/v1/events/${id}/register`)),
  participants: async (id, { page = 0, size = 50 } = {}) => {
    const data = unwrap(await api.get(`/v1/events/${id}/participants`, { params: { page, size } }))
    return normalizePage(data)
  },
}
