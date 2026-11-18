import api from '../api/axiosInstance'
import { unwrap } from '../api/apiClient'

export const moderationService = {
  report: async (payload) => unwrap(await api.post('/v1/moderation/reports', payload)),
  mine: async () => unwrap(await api.get('/v1/moderation/reports/mine')),
  get: async (id) => unwrap(await api.get(`/v1/moderation/reports/${id}`)),
}
