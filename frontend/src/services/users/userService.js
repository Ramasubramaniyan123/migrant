import api from '../api/axiosInstance'
import { unwrap, normalizePage } from '../api/apiClient'

export const profileService = {
  me: async () => unwrap(await api.get('/v1/profile/me')),
  details: async () => unwrap(await api.get('/v1/profile/details')),
  update: async (data) => unwrap(await api.put('/v1/profile/me', data)),
  updatePrivacy: async (data) => unwrap(await api.put('/v1/profile/privacy', data)),
  updateLocation: async (data) => unwrap(await api.put('/v1/profile/location', data)),
  addLanguage: async (languageId, proficiency, primary) =>
    unwrap(await api.post(`/v1/profile/languages/${languageId}`, null, {
      params: { proficiency, primary },
    })),
  removeLanguage: async (languageId) =>
    unwrap(await api.delete(`/v1/profile/languages/${languageId}`)),
  addInterest: async (interest) =>
    unwrap(await api.post('/v1/profile/interests', null, { params: { interest } })),
  removeInterest: async (interest) =>
    unwrap(await api.delete(`/v1/profile/interests/${encodeURIComponent(interest)}`)),
  deactivate: async () => unwrap(await api.post('/v1/profile/deactivate')),
  setProfilePicture: async (imageUrl) =>
    unwrap(await api.post('/v1/profile/profile-picture', { imageUrl })),
}

export const userService = {
  me: async () => unwrap(await api.get('/v1/users/me')),
}

export const languageService = {
  list: async () => unwrap(await api.get('/v1/languages/list')),
}

export const locationService = {
  nearby: async (params) => unwrap(await api.get('/v1/locations/nearby', { params })),
}
