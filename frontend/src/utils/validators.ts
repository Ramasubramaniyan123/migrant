const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
}

export interface FieldErrors {
  [field: string]: string
}

export function validateLogin(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!email.trim()) errors.email = 'Email is required'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  return errors
}

export function validateRegister(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): FieldErrors {
  const errors: FieldErrors = {}
  if (!fullName.trim()) errors.fullName = 'Name is required'
  if (!email.trim()) errors.email = 'Email is required'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  else if (!isStrongPassword(password)) {
    errors.password = 'Use at least 8 characters with letters and numbers'
  }
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
