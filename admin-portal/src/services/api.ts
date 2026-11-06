import { sleep } from '@/utils/helpers'

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

/** Simulated network latency for prototype mode. */
const MOCK_LATENCY_MS = 350

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Wraps a mock operation with simulated latency. When the real Spring Boot
 * backend is ready, services can call axios against API_BASE_URL instead.
 */
export async function mockRequest<T>(fn: () => T | Promise<T>, latency = MOCK_LATENCY_MS): Promise<T> {
  await sleep(latency)
  return fn()
}

/**
 * localStorage-backed collection store. Seed data is cloned on first read so
 * mutations stay isolated and persist across reloads during the prototype.
 */
export class MockStore<T extends { id: string }> {
  private cache: T[] | null = null

  constructor(
    private readonly key: string,
    private readonly seed: () => T[],
  ) {}

  private load(): T[] {
    if (this.cache) return this.cache
    try {
      const raw = localStorage.getItem(this.key)
      if (raw) {
        this.cache = JSON.parse(raw) as T[]
        return this.cache
      }
    } catch {
      // corrupted storage — fall through to seed
    }
    this.cache = this.seed()
    this.persist()
    return this.cache
  }

  private persist() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.cache ?? []))
    } catch {
      // storage full or unavailable — prototype continues in-memory
    }
  }

  all(): T[] {
    return [...this.load()]
  }

  find(id: string): T | undefined {
    return this.load().find((item) => item.id === id)
  }

  findMany(predicate: (item: T) => boolean): T[] {
    return this.load().filter(predicate)
  }

  create(data: Omit<T, 'id'> & { id?: string }): T {
    const items = this.load()
    const record = { id: data.id ?? this.nextId(items), ...data } as T
    items.push(record)
    this.persist()
    return record
  }

  update(id: string, patch: Partial<T>): T | undefined {
    const items = this.load()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return undefined
    items[index] = { ...items[index], ...patch }
    this.persist()
    return items[index]
  }

  remove(id: string): boolean {
    const items = this.load()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return false
    items.splice(index, 1)
    this.persist()
    return true
  }

  private nextId(items: T[]): string {
    const prefix = items.length > 0 ? items[items.length - 1].id.replace(/\d+$/, '') : ''
    const max = items.reduce((acc, item) => {
      const n = parseInt(item.id.replace(/\D/g, ''), 10)
      return Number.isNaN(n) ? acc : Math.max(acc, n)
    }, 0)
    return `${prefix}${max + 1}`
  }
}
