// src/theme/spacing.js


export const spacing = {
  0:    0,
  0.5:  2,
  1:    4,
  1.5:  6,
  2:    8,
  2.5:  10,
  3:    12,
  3.5:  14,
  4:    16,
  5:    20,
  6:    24,
  7:    28,
  8:    32,
  9:    36,
  10:   40,
  11:   44,
  12:   48,
  14:   56,
  16:   64,
  20:   80,
  24:   96,
  28:   112,
  32:   128,
};

// ── Semantic aliases ───────────────────────────────────────────────────────────
export const layout = {
  screenPaddingH:   spacing[4],   // 16 — horizontal screen padding
  screenPaddingV:   spacing[5],   // 20 — vertical screen padding
  cardPadding:      spacing[4],   // 16
  cardRadius:       spacing[4],   // 16
  cardRadiusSm:     spacing[3],   // 12
  cardRadiusLg:     spacing[6],   // 24
  inputHeight:      spacing[14],  // 56
  buttonHeight:     spacing[14],  // 56
  buttonHeightSm:   spacing[11],  // 44
  buttonRadius:     spacing[4],   // 16
  tabBarHeight:     spacing[16],  // 64
  headerHeight:     spacing[14],  // 56
  bottomSafeArea:   spacing[8],   // 32
  sectionGap:       spacing[6],   // 24
  itemGap:          spacing[3],   // 12
  chipHeight:       spacing[9],   // 36
  chipRadius:       spacing[5],   // 20 — pill shape
  avatarSm:         40,
  avatarMd:         56,
  avatarLg:         80,
  avatarXl:         100,
  productCardWidth: 160,
  productCardHeight: 220,
  bannerHeight:     200,
};

export const shadows = {
  sm: {
    shadowColor: '#543C29',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#543C29',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#543C29',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
};
