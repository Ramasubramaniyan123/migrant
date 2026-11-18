import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const ADMIN_KEY = 'mcp_admin'

export const adminTokenStore = {
  get() {
    try {
      const raw = localStorage.getItem(ADMIN_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(session) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session))
  },
  clear() {
    localStorage.removeItem(ADMIN_KEY)
  },
}

export const adminApi = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

adminApi.interceptors.request.use((config) => {
  const session = adminTokenStore.get()
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`
  }
  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only clear the session on 401 (expired/invalid). 403 means the token
      // is valid but lacks permission for this resource.
      if (error.response?.status === 401) {
        adminTokenStore.clear()
        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign('/login')
        }
      }
    }
    return Promise.reject(error)
  }
)

export default adminApi
