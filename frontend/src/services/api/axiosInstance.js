import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const TOKEN_KEY = 'mcp_auth'

export const tokenStore = {
  get() {
    try {
      const raw = localStorage.getItem(TOKEN_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(session) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(session))
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
  },
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const session = tokenStore.get()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

let refreshing = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    if (status === 401 && !original._retried && !original.url?.includes('/v1/auth/')) {
      original._retried = true
      const session = tokenStore.get()
      if (session?.refreshToken) {
        try {
          refreshing = refreshing || axios.post(`${BASE_URL}/v1/auth/refresh`, {
            refreshToken: session.refreshToken,
          })
          const { data } = await refreshing
          refreshing = null
          const payload = data?.data ?? data
          tokenStore.set({
            ...session,
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken ?? session.refreshToken,
          })
          original.headers.Authorization = `Bearer ${payload.accessToken}`
          return api(original)
        } catch {
          refreshing = null
          tokenStore.clear()
          if (!window.location.pathname.startsWith('/login')) {
            window.location.assign('/login')
          }
        }
      } else {
        tokenStore.clear()
      }
    }

    return Promise.reject(error)
  }
)

export default api
