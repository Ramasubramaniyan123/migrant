import api from '../api/axiosInstance'
import { unwrap, normalizePage } from '../api/apiClient'

export const communityService = {
  list: async ({ query, page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/communities', { params: { query, page, size } }))
    return normalizePage(data)
  },
  mine: async ({ page = 0, size = 50 } = {}) => {
    const data = unwrap(await api.get('/v1/communities/mine', { params: { page, size } }))
    return normalizePage(data)
  },
  get: async (id) => unwrap(await api.get(`/v1/communities/${id}`)),
  members: async (id, { page = 0, size = 50 } = {}) => {
    const data = unwrap(await api.get(`/v1/communities/${id}/members`, { params: { page, size } }))
    return normalizePage(data)
  },
  create: async (payload) => unwrap(await api.post('/v1/communities', payload)),
  update: async (id, payload) => unwrap(await api.put(`/v1/communities/${id}`, payload)),
  archive: async (id) => unwrap(await api.post(`/v1/communities/${id}/archive`)),
  remove: async (id) => unwrap(await api.delete(`/v1/communities/${id}`)),
  join: async (id) => unwrap(await api.post(`/v1/communities/${id}/join`)),
  leave: async (id) => unwrap(await api.post(`/v1/communities/${id}/leave`)),
  removeMember: async (id, userId) => unwrap(await api.delete(`/v1/communities/${id}/members/${userId}`)),
  setMemberRole: async (id, userId, role) =>
    unwrap(await api.patch(`/v1/communities/${id}/members/${userId}/role`, null, { params: { role } })),
  invitations: async () => unwrap(await api.get('/v1/communities/invitations')),
  invite: async (communityId, email) =>
    unwrap(await api.post(`/v1/communities/${communityId}/invitations`, { email })),
  acceptInvitation: async (invitationId) =>
    unwrap(await api.post(`/v1/communities/invitations/${invitationId}/accept`)),
  declineInvitation: async (invitationId) =>
    unwrap(await api.post(`/v1/communities/invitations/${invitationId}/decline`)),
}
