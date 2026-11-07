/** Joins truthy class names. Small local replacement for `clsx`. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/** Resolves after `ms` milliseconds. Used to simulate API latency. */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function unique(values) {
  return Array.from(new Set(values));
}
export function groupBy(values, keyFn) {
  return values.reduce((acc, value) => {
    const key = keyFn(value);
    acc[key] = acc[key] ?? [];
    acc[key].push(value);
    return acc;
  }, {});
}

/** Creates a deep copy so mock data mutations never leak between screens. */
export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
export function sortBy(values, keyFn, dir = 'asc') {
  return [...values].sort((a, b) => dir === 'asc' ? keyFn(a) - keyFn(b) : keyFn(b) - keyFn(a));
}
