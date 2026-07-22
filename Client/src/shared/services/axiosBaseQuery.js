// src/shared/services/axiosBaseQuery.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom RTK Query baseQuery using Axios.
// Handles:
//   - Bearer token attachment on every request
//   - 401 → automatic refresh → retry original request once
//   - Logout dispatch if refresh also fails
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  clearTokens,
} from '../utils/storage';
import { logout } from '../../features/auth/store/authSlice';

// Singleton Axios instance shared across all RTK Query calls
export const axiosInstance = axios.create({
  timeout: 15000,
  headers: { 
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true'
  },
});

// Prevent concurrent refresh calls
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else        prom.resolve(token);
  });
  failedQueue = [];
};

// ── Request interceptor — attach access token ─────────────────────────────────
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — 401 refresh flow ───────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      original.url?.includes('/auth/login') ||
      original.url?.includes('/auth/register') ||
      error.response?.status !== 401 ||
      original._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue subsequent 401s until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(original);
      });
    }

    original._retry   = true;
    isRefreshing      = true;

    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(
        `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
        { refreshToken },
      );

      const newAccessToken = data.data.accessToken;
      await updateAccessToken(newAccessToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await clearTokens();
      // The RootNavigator will detect cleared tokens and redirect to AuthStack
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ── RTK Query-compatible baseQuery factory ────────────────────────────────────
/**
 * @param {{ baseUrl: string }} options
 */
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method = 'GET', data, body, params, headers }, api) => {
    try {
      axiosInstance.defaults.baseURL = baseUrl;
      const result = await axiosInstance({
        url,
        method,
        data: data !== undefined ? data : body,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      // Handle unauthorized or stale session (e.g. user deleted/database reset)
      if (status === 401 || (status === 404 && message === 'User not found')) {
        api.dispatch(logout());
      }

      return {
        error: {
          status,
          data:   axiosError.response?.data ?? axiosError.message,
        },
      };
    }
  };

export default axiosBaseQuery;
