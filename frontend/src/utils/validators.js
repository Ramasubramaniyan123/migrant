const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email.trim());
}
export function isStrongPassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
export function validateLogin(email, password) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
}
export function validateRegister(fullName, email, password, confirmPassword) {
  const errors = {};
  if (!fullName.trim()) errors.fullName = 'Name is required';
  if (!email.trim()) errors.email = 'Email is required';else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';else if (!isStrongPassword(password)) {
    errors.password = 'Use at least 8 characters with letters and numbers';
  }
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
}
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
