/**
 * Shared API helpers.
 *
 * The backend wraps every response in ApiResponse { success, message, data }.
 * Some endpoints return a Spring `Page` ({content, totalElements, ...}) while
 * others return PageResult ({content|items, totalElements|total, ...}).
 * These helpers normalise both shapes.
 */

export function unwrap(response) {
  const body = response?.data
  if (body && typeof body === 'object' && 'success' in body) {
    if (!body.success) {
      throw new ApiError(body.message || 'Request failed', response?.status)
    }
    return body.data
  }
  return body
}

export function normalizePage(data) {
  if (!data) return { items: [], total: 0, page: 0, pageSize: 20, totalPages: 0, last: true }
  const items = data.content ?? data.items ?? (Array.isArray(data) ? data : [])
  const total = data.totalElements ?? data.total ?? items.length
  const page = data.number ?? data.page ?? 0
  const pageSize = data.size ?? data.pageSize ?? (items.length || 20)
  const totalPages = data.totalPages ?? Math.max(1, Math.ceil(total / Math.max(pageSize, 1)))
  const last = data.last ?? (page >= totalPages - 1)
  return { items, total, page, pageSize, totalPages, last }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const body = error?.response?.data
  if (body?.message) return body.message
  if (body?.error) return typeof body.error === 'string' ? body.error : body.error.message || fallback
  if (error?.message && error.message !== 'Network Error') return error.message
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.'
  return fallback
}
