import { StyleSheet } from 'react-native';

// Overwrite StyleSheet.create to dynamically evaluate theme colors on every render access
const originalCreate = StyleSheet.create;
StyleSheet.create = (stylesObj) => {
  return new Proxy(stylesObj, {
    get(target, prop) {
      if (prop in target) {
        const rawStyle = target[prop];
        const resolvedStyle = {};
        for (const key in rawStyle) {
          resolvedStyle[key] = rawStyle[key];
        }
        return resolvedStyle;
      }
      return undefined;
    }
  });
};

let currentTheme = 'light';

export const setThemeColorsMode = (mode) => {
  currentTheme = mode;
};

const lightColors = {
  primary:      '#704F38',
  primaryDark:  '#1F2029',
  primaryLight: '#8C6244',
  background:   '#FFFFFF',
  surface:      '#FDFBF9',
  surfaceAlt:   '#EDEDED',
  text:         '#1F2029',
  textMuted:    '#797979',
  textInverse:  '#FFFFFF',
  border:       '#EDEDED',
  divider:      '#EDEDED',
  white:        '#FFFFFF',
  accent:       '#D4C4B7',
  gold:         '#E8B84E',
  success:      '#4CAF50',
  error:        '#E57373',
  warning:      '#FFB74D',
  info:         '#64B5F6',
  disabled:     '#D7CCC8',
  placeholder:  '#A1887F',
  overlay:      'rgba(31, 32, 41, 0.6)',
  tabBackground:'#1F2029',
  tabActive:    '#FFFFFF',
  tabInactive:  '#797979',
  sale:         '#E57373',
  badge:        '#E57373',
};

const darkColors = {
  primary:      '#704F38',
  primaryDark:  '#0C0D12',
  primaryLight: '#8C6244',
  background:   '#12131A',
  surface:      '#1E1F29',
  surfaceAlt:   '#2C2E3B',
  text:         '#F5F5F7',
  textMuted:    '#9A9A9A',
  textInverse:  '#12131A',
  border:       '#2C2E3B',
  divider:      '#2C2E3B',
  white:        '#1E1F29',
  accent:       '#403D39',
  gold:         '#E8B84E',
  success:      '#4CAF50',
  error:        '#EF9A9A',
  warning:      '#FFCC80',
  info:         '#90CAF9',
  disabled:     '#424242',
  placeholder:  '#757575',
  overlay:      'rgba(0, 0, 0, 0.7)',
  tabBackground:'#0C0D12',
  tabActive:    '#F5F5F7',
  tabInactive:  '#9A9A9A',
  sale:         '#EF9A9A',
  badge:        '#EF9A9A',
};

export const colors = new Proxy({}, {
  get(target, prop) {
    const activePalette = currentTheme === 'dark' ? darkColors : lightColors;
    return activePalette[prop];
  }
});
