import axios from 'axios';

/**
 * Base URL for the Spring Boot admin API. Defaults to the Vite dev-server
 * proxy path (`/api` -> http://localhost:8080) so no CORS setup is needed in
 * development. Override with VITE_API_BASE_URL for other environments.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

const SESSION_STORAGE_KEY = 'admin_portal_session';
const LOGIN_PATH = '/login';

export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

function readToken() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.token ?? null;
  } catch {
    return null;
  }
}

function clearSessionAndRedirect() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // storage unavailable — still redirect
  }
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH);
  }
}

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

http.interceptors.request.use(config => {
  const token = readToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (data && typeof data === 'object') {
    // ApiResponse error shape: { success:false, message, data? }
    if (typeof data.message === 'string' && data.message) return data.message;
    // Validation errors carry a field->message map in `data`.
    if (data.data && typeof data.data === 'object') {
      const first = Object.values(data.data).find(v => typeof v === 'string');
      if (first) return first;
    }
  }
  if (typeof data === 'string' && data) return data;
  if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (!error.response) return 'Cannot reach the server. Is the backend running?';
  return error.message || 'Request failed';
}

http.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status ?? 0;
    const url = error.config?.url ?? '';
    const isAuthEndpoint = url.includes('/admin/auth/');

    // Expired/revoked admin token — drop the session and send the user to login.
    if (status === 401 && !isAuthEndpoint && readToken()) {
      clearSessionAndRedirect();
    }

    return Promise.reject(new ApiError(extractErrorMessage(error), status));
  }
);

/**
 * Performs an API call and returns the unwrapped payload. Admin endpoints
 * return DTOs directly; if a response is ever ApiResponse-wrapped
 * ({ success, message, data }) the `data` payload is returned instead.
 */
export async function apiRequest(method, url, { params, data } = {}) {
  const response = await http.request({ method, url, params, data });
  const body = response.data;
  if (
    body &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    body.success === true &&
    'data' in body
  ) {
    return body.data;
  }
  return body;
}

export const api = {
  get: (url, config) => apiRequest('get', url, config),
  post: (url, data, config) => apiRequest('post', url, { ...config, data }),
  put: (url, data, config) => apiRequest('put', url, { ...config, data }),
  patch: (url, data, config) => apiRequest('patch', url, { ...config, data }),
  delete: (url, config) => apiRequest('delete', url, config)
};
