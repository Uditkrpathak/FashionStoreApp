// src/shared/services/baseApi.js
// ─────────────────────────────────────────────────────────────────────────────
// THE single RTK Query API instance for the entire app.
//
// Rules:
//   1. Only ONE createApi call exists in the entire codebase — this file.
//   2. Feature modules call baseApi.injectEndpoints(...) — never createApi again.
//   3. tagTypes covers all cacheable entities for cross-feature invalidation.
//
// Usage in feature modules:
//   import { baseApi } from '../../../shared/services/baseApi';
//   export const cartApi = baseApi.injectEndpoints({ endpoints: (b) => ({ ... }) });
// ─────────────────────────────────────────────────────────────────────────────
import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './axiosBaseQuery';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:5000/api/v1';

export const baseApi = createApi({
  reducerPath: 'api',

  baseQuery: axiosBaseQuery({ baseUrl: BASE_URL }),

  // ── Shared tag types for cross-feature cache invalidation ──────────────────
  tagTypes: [
    'Auth',
    'User',
    'Product',
    'Category',
    'Cart',
    'Wishlist',
    'Order',
    'Review',
    'Address',
    'Notification',
    'Coupon',
  ],

  // Endpoints injected by feature modules — do not define here
  endpoints: () => ({}),
});
