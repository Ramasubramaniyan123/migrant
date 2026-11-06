const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function isStrongPassword(value: string): boolean {
  // Min 8 chars, at least one letter and one number
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value)
}

export function passwordError(value: string): string | null {
  if (!value) return 'Password is required'
  if (!isStrongPassword(value)) return 'Use at least 8 characters with a letter and a number'
  return null
}

export function emailError(value: string): string | null {
  if (!value.trim()) return 'Email is required'
  if (!isValidEmail(value)) return 'Enter a valid email address'
  return null
}
