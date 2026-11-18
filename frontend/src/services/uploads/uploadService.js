import api from '../api/axiosInstance'
import { unwrap } from '../api/apiClient'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const uploadService = {
  upload: async (file) => {
    const form = new FormData()
    form.append('file', file)
    return unwrap(await api.post('/v1/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }))
  },
  fileUrl: (filename) => `${BASE_URL}/v1/uploads/files/${encodeURIComponent(filename)}`,
}
