import { describe, it, expect } from 'vitest'
import { normalizePage, unwrap, errorMessage, ApiError } from '../api/apiClient'

describe('normalizePage', () => {
  it('handles PageResult shape', () => {
    const r = normalizePage({ items: [1, 2], total: 5, page: 0, pageSize: 2 })
    expect(r.items).toEqual([1, 2])
    expect(r.total).toBe(5)
    expect(r.totalPages).toBe(3)
  })
  it('handles Spring Page shape', () => {
    const r = normalizePage({ content: ['a'], number: 1, size: 10, totalElements: 25 })
    expect(r.items).toEqual(['a'])
    expect(r.page).toBe(1)
    expect(r.totalPages).toBe(3)
  })
  it('handles null/empty', () => {
    expect(normalizePage(null).items).toEqual([])
    expect(normalizePage({}).total).toBe(0)
  })
})

describe('unwrap', () => {
  it('returns data on success', () => {
    expect(unwrap({ data: { success: true, data: { x: 1 } } })).toEqual({ x: 1 })
  })
  it('throws ApiError on failure', () => {
    expect(() => unwrap({ data: { success: false, message: 'nope' }, status: 400 }))
      .toThrowError(ApiError)
  })
  it('passes through non-envelope bodies', () => {
    expect(unwrap({ data: [1, 2] })).toEqual([1, 2])
  })
})

describe('errorMessage', () => {
  it('prefers body message', () => {
    expect(errorMessage({ response: { data: { message: 'bad' } } })).toBe('bad')
  })
  it('handles error object', () => {
    expect(errorMessage({ response: { data: { error: 'denied' } } })).toBe('denied')
  })
  it('falls back on network error', () => {
    expect(errorMessage({ message: 'Network Error' })).toBe('Something went wrong. Please try again.')
  })
})
