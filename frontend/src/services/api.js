import { API_BASE_URL } from '@/utils/constants';
import { clone, sleep } from '@/utils/helpers';
export class ApiError extends Error {
  status;
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Simulates network latency and returns a defensive copy of mock data. */
export async function mockResponse(data, latencyMs = 250) {
  await sleep(latencyMs);
  return clone(data);
}

/**
 * Thin wrapper around `fetch` for when the Spring Boot backend is available.
 * Services fall back to mock data while `VITE_USE_MOCK_DATA` is true.
 */
export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });
  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed`, response.status);
  }
  if (response.status === 204) {
    return undefined;
  }
  return await response.json();
}
export function nextId(rows) {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
}
