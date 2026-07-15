// src/shared/utils/storage.js
// ─────────────────────────────────────────────────────────────────────────────
// Unified storage utility.
// Secure tokens  → expo-secure-store  (iOS Keychain / Android Keystore)
// Non-sensitive  → @react-native-async-storage/async-storage
//
// Install:
//   npx expo install expo-secure-store @react-native-async-storage/async-storage
// ─────────────────────────────────────────────────────────────────────────────
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Keys ──────────────────────────────────────────────────────────────────────
const KEYS = {
  ACCESS_TOKEN:   'fashion_access_token',
  REFRESH_TOKEN:  'fashion_refresh_token',
  ONBOARDING:     'fashion_onboarding_seen',
  THEME:          'fashion_theme',
  RECENT_SEARCH:  'fashion_recent_searches',
};

// ── Secure Storage (expo-secure-store) ───────────────────────────────────────

/**
 * Save access + refresh tokens in OS-encrypted secure storage.
 * @param {string} accessToken
 * @param {string} refreshToken
 */
export const saveTokens = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN,  accessToken);
  await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
};

/**
 * Retrieve stored tokens.
 * @returns {{ accessToken: string, refreshToken: string } | null}
 */
export const getTokens = async () => {
  const accessToken  = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  if (!accessToken) return null;
  return { accessToken, refreshToken };
};

/**
 * Delete both tokens (call on logout).
 */
export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
};

/**
 * Get only the access token (for Axios interceptor).
 * @returns {string | null}
 */
export const getAccessToken = async () => {
  return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
};

/**
 * Get only the refresh token.
 * @returns {string | null}
 */
export const getRefreshToken = async () => {
  return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
};

/**
 * Update only the access token (after a successful token refresh).
 * @param {string} newAccessToken
 */
export const updateAccessToken = async (newAccessToken) => {
  await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, newAccessToken);
};

// ── AsyncStorage (non-sensitive) ─────────────────────────────────────────────

/**
 * Generic set — serializes value to JSON.
 * @param {string} key
 * @param {*} value
 */
export const setItem = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

/**
 * Generic get — parses JSON.
 * @param {string} key
 * @returns {* | null}
 */
export const getItem = async (key) => {
  const raw = await AsyncStorage.getItem(key);
  return raw !== null ? JSON.parse(raw) : null;
};

/**
 * Remove a key from AsyncStorage.
 * @param {string} key
 */
export const removeItem = async (key) => {
  await AsyncStorage.removeItem(key);
};

// ── Semantic helpers ──────────────────────────────────────────────────────────

export const setOnboardingSeen = ()        => setItem(KEYS.ONBOARDING, true);
export const getOnboardingSeen = ()        => getItem(KEYS.ONBOARDING);

export const setTheme          = (theme)   => setItem(KEYS.THEME, theme);
export const getTheme          = ()        => getItem(KEYS.THEME);

export const setRecentSearches = (list)    => setItem(KEYS.RECENT_SEARCH, list);
export const getRecentSearches = ()        => getItem(KEYS.RECENT_SEARCH);

export { KEYS };
