// src/shared/utils/validators.js
// ─────────────────────────────────────────────────────────────────────────────
// Validation helpers — used with React Hook Form's validate option.
// Each function returns true (valid) or an error string (invalid).
// ─────────────────────────────────────────────────────────────────────────────

export const required = (label = 'This field') => (value) =>
  (value !== null && value !== undefined && String(value).trim() !== '') ||
  `${label} is required`;

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter a valid email address';

export const isPhone = (value) =>
  /^[6-9]\d{9}$/.test(value) || 'Enter a valid 10-digit mobile number';

export const minLength = (min) => (value) =>
  String(value).length >= min || `Minimum ${min} characters required`;

export const maxLength = (max) => (value) =>
  String(value).length <= max || `Maximum ${max} characters allowed`;

export const isStrongPassword = (value) => {
  if (value.length < 8)            return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value))        return 'Include at least one uppercase letter';
  if (!/[0-9]/.test(value))        return 'Include at least one number';
  if (!/[!@#$%^&*]/.test(value))   return 'Include at least one special character';
  return true;
};

export const matchesField = (fieldValue, label = 'Passwords') => (value) =>
  value === fieldValue || `${label} do not match`;

export const isPincode = (value) =>
  /^\d{6}$/.test(value) || 'Enter a valid 6-digit pincode';

export const isOtp = (length = 6) => (value) =>
  new RegExp(`^\\d{${length}}$`).test(value) ||
  `Enter the ${length}-digit code`;
