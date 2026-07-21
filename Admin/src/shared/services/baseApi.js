import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './axiosBaseQuery';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const baseApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Auth', 'User', 'Product', 'Category', 'Cart', 'Order', 'Review', 'Coupon', 'AuditLog', 'AdminStats'],
  endpoints: () => ({}),
});
