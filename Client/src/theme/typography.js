// src/theme/typography.js
// ─────────────────────────────────────────────────────────────────────────────
// Typography scale — font sizes, weights, line heights.
// All font sizes follow an 8pt grid.
// ─────────────────────────────────────────────────────────────────────────────

export const fontSizes = {
  xs:   11,
  sm:   13,
  md:   15,
  base: 16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const fontWeights = {
  regular:   '400',
  medium:    '500',
  semibold:  '600',
  bold:      '700',
  extrabold: '800',
};

export const lineHeights = {
  tight:    1.2,
  snug:     1.35,
  normal:   1.5,
  relaxed:  1.65,
  loose:    2.0,
};

export const letterSpacing = {
  tighter: -0.5,
  tight:   -0.25,
  normal:   0,
  wide:     0.5,
  wider:    1.0,
  widest:   1.5,
};

// ── Semantic text styles (use these in StyleSheet) ────────────────────────────
export const textStyles = {
  h1: {
    fontSize:     fontSizes['4xl'],
    fontWeight:   fontWeights.bold,
    lineHeight:   fontSizes['4xl'] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize:     fontSizes['3xl'],
    fontWeight:   fontWeights.bold,
    lineHeight:   fontSizes['3xl'] * lineHeights.tight,
  },
  h3: {
    fontSize:     fontSizes['2xl'],
    fontWeight:   fontWeights.semibold,
    lineHeight:   fontSizes['2xl'] * lineHeights.snug,
  },
  h4: {
    fontSize:     fontSizes.xl,
    fontWeight:   fontWeights.semibold,
    lineHeight:   fontSizes.xl * lineHeights.snug,
  },
  h5: {
    fontSize:     fontSizes.lg,
    fontWeight:   fontWeights.semibold,
    lineHeight:   fontSizes.lg * lineHeights.snug,
  },
  body1: {
    fontSize:     fontSizes.base,
    fontWeight:   fontWeights.regular,
    lineHeight:   fontSizes.base * lineHeights.normal,
  },
  body2: {
    fontSize:     fontSizes.md,
    fontWeight:   fontWeights.regular,
    lineHeight:   fontSizes.md * lineHeights.normal,
  },
  caption: {
    fontSize:     fontSizes.sm,
    fontWeight:   fontWeights.regular,
    lineHeight:   fontSizes.sm * lineHeights.normal,
  },
  label: {
    fontSize:     fontSizes.sm,
    fontWeight:   fontWeights.medium,
    letterSpacing: letterSpacing.wide,
  },
  overline: {
    fontSize:     fontSizes.xs,
    fontWeight:   fontWeights.medium,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
  button: {
    fontSize:     fontSizes.base,
    fontWeight:   fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
  },
  price: {
    fontSize:     fontSizes.lg,
    fontWeight:   fontWeights.bold,
  },
  priceLg: {
    fontSize:     fontSizes['2xl'],
    fontWeight:   fontWeights.extrabold,
  },
};
