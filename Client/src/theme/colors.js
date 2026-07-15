// src/theme/colors.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the entire color palette.
// NEVER hardcode hex values in components — always import from here.
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  primary:      '#704F38',   // Rich brown (from Style Guide)
  primaryDark:  '#1F2029',   // Dark (from Style Guide)
  primaryLight: '#8C6244',

  // Backgrounds
  background:   '#FFFFFF',   // Clean white background for most screens
  surface:      '#FDFBF9',   // Very subtle off-white/cream for cards
  surfaceAlt:   '#EDEDED',   // Light gray for borders, shapes (from Style Guide)

  // Text
  text:         '#1F2029',   // Dark for headings (from Style Guide)
  textMuted:    '#797979',   // Gray for secondary text (from Style Guide)
  textInverse:  '#FFFFFF',

  // Borders
  border:       '#EDEDED',
  divider:      '#EDEDED',

  // Accent
  white:        '#FFFFFF',
  accent:       '#D4C4B7',   // Muted tan for chips/tags
  gold:         '#E8B84E',   // Soft gold for star ratings

  // Semantic
  success:      '#4CAF50',
  error:        '#E57373',
  warning:      '#FFB74D',
  info:         '#64B5F6',

  // UI States
  disabled:     '#D7CCC8',
  placeholder:  '#A1887F',
  overlay:      'rgba(31, 32, 41, 0.6)',

  // Tab Bar
  tabBackground:'#1F2029',
  tabActive:    '#FFFFFF',
  tabInactive:  '#797979',

  // Sale / Badge
  sale:         '#E57373',
  badge:        '#E57373',
};
