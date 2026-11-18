import api from '../api/axiosInstance'
import { unwrap, normalizePage } from '../api/apiClient'

export const discoveryService = {
  suggestions: async (params = {}) => {
    const data = unwrap(await api.get('/v1/discovery/suggestions', { params }))
    return normalizePage(data)
  },
  byHometown: async (hometownCity, { page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/discovery/hometown', { params: { hometownCity, page, size } }))
    return normalizePage(data)
  },
}
