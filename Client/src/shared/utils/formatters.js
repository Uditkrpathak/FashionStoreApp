// src/shared/utils/formatters.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure utility functions — no React imports, no side effects.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a price as Indian Rupees.
 * @param {number} amount
 * @returns {string}  e.g. "₹1,299"
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Format a percentage discount.
 * @param {number} mrp
 * @param {number} price
 * @returns {string}  e.g. "20% off"
 */
export const formatDiscount = (mrp, price) => {
  if (!mrp || mrp <= price) return null;
  const pct = Math.round(((mrp - price) / mrp) * 100);
  return `${pct}% off`;
};

/**
 * Truncate a string to maxLen characters with ellipsis.
 * @param {string} str
 * @param {number} maxLen
 */
export const truncate = (str, maxLen = 40) => {
  if (!str) return '';
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
};

/**
 * Format a date string to "DD MMM YYYY".
 * @param {string|Date} date
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
};

/**
 * Format a date relative to now (e.g. "2 days ago", "just now").
 * @param {string|Date} date
 */
export const timeAgo = (date) => {
  const now     = Date.now();
  const then    = new Date(date).getTime();
  const diffMs  = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)  return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)  return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7)  return `${diffDay}d ago`;
  return formatDate(date);
};

/**
 * Capitalize first letter of a string.
 * @param {string} str
 */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/**
 * Format order status label.
 * @param {'placed'|'confirmed'|'shipped'|'delivered'|'cancelled'} status
 */
export const formatOrderStatus = (status) => {
  const map = {
    placed:    'Order Placed',
    confirmed: 'Confirmed',
    shipped:   'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned:  'Return Requested',
  };
  return map[status] ?? capitalize(status);
};

/**
 * Get initials from a name (for avatar fallback).
 * @param {string} name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
