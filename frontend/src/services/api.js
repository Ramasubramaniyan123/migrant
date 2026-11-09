import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants';

export class ApiError extends Error {
  status;
  data;
  constructor(message, status = 500, data = undefined) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/* ------------------------------------------------------------------ *
 * Token storage — the single place that knows where credentials live. *
 * ------------------------------------------------------------------ */

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.authToken);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.authRefresh);
}

export function setTokens({ accessToken, refreshToken } = {}) {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.authToken, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.authRefresh, refreshToken);
}

/** Removes every credential and the cached user profile from storage. */
export function clearSessionStorage() {
  localStorage.removeItem(STORAGE_KEYS.authUser);
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.authRefresh);
}

/* ------------------------------------------------------------------ *
 * Refresh-token flow (single-flight so parallel 401s share one call). *
 * ------------------------------------------------------------------ */

let refreshPromise = null;

async function tryRefreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  refreshPromise ??= (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (!response.ok) return false;
      const body = await response.json();
      const data = body?.data ?? body;
      if (!data?.accessToken) return false;
      setTokens(data);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

/** Auth endpoints must never trigger a refresh attempt themselves. */
function canAttemptRefresh(path) {
  if (path.startsWith('/v1/auth/')) {
    return path.startsWith('/v1/auth/me');
  }
  return true;
}

function buildHeaders(options, token) {
  const headers = new Headers(options.headers ?? {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return headers;
}

function serializeBody(body) {
  if (body === undefined || body === null) return undefined;
  if (typeof body === 'string' || (typeof FormData !== 'undefined' && body instanceof FormData)) {
    return body;
  }
  return JSON.stringify(body);
}

async function parseBody(response, path) {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(`Unexpected response from ${path}`, response.status);
  }
}

function extractErrorMessage(body, fallback) {
  if (body && typeof body === 'object') {
    return body.message || body.error || fallback;
  }
  return fallback;
}

/**
 * Thin wrapper around `fetch` for the Spring Boot backend.
 *
 * - Prefixes every call with `API_BASE_URL` (`/api` in dev, proxied to :8080).
 * - Attaches `Authorization: Bearer <accessToken>` when a session exists.
 * - Unwraps the `ApiResponse<T>` envelope (`{ success, message, data }`) and
 *   returns `data`. Endpoints that return a raw payload (e.g. the language
 *   list) are returned untouched.
 * - On 401, performs a single refresh-token rotation and retries once.
 * - Throws `ApiError` carrying the server's `message` when present.
 */
export async function request(path, options = {}) {
  const send = token =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: buildHeaders(options, token),
      body: serializeBody(options.body)
    });

  let response = await send(getAccessToken());

  if (response.status === 401 && canAttemptRefresh(path)) {
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      response = await send(getAccessToken());
    } else if (getRefreshToken() === null && getAccessToken() !== null) {
      // Refresh token was rejected — drop the dead session.
      clearSessionStorage();
    }
  }

  const body = await parseBody(response, path);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(body, `Request to ${path} failed`),
      response.status,
      body?.data
    );
  }

  // ApiResponse envelope: { success, message, data, timestamp, path }
  if (body && typeof body === 'object' && !Array.isArray(body) && 'success' in body) {
    if (body.success === false) {
      throw new ApiError(body.message || 'Request failed', response.status, body.data);
    }
    return body.data;
  }

  return body;
}

/** Uploads an image through `POST /v1/uploads` (multipart `file` field). */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/v1/uploads', { method: 'POST', body: formData });
}
