/** Joins truthy class names. Small local replacement for `clsx`. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Resolves after `ms` milliseconds. Used to simulate API latency. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values))
}

export function groupBy<T, K extends string | number>(
  values: T[],
  keyFn: (value: T) => K,
): Record<K, T[]> {
  return values.reduce<Record<K, T[]>>(
    (acc, value) => {
      const key = keyFn(value)
      acc[key] = acc[key] ?? []
      acc[key].push(value)
      return acc
    },
    {} as Record<K, T[]>,
  )
}

/** Creates a deep copy so mock data mutations never leak between screens. */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function sortBy<T>(values: T[], keyFn: (value: T) => number, dir: 'asc' | 'desc' = 'asc'): T[] {
  return [...values].sort((a, b) => (dir === 'asc' ? keyFn(a) - keyFn(b) : keyFn(b) - keyFn(a)))
}
