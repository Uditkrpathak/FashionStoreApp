import { baseApi } from '../shared/services/baseApi';

export const adminOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: '/orders/admin/dashboard/stats',
        method: 'GET',
      }),
      providesTags: ['AdminStats'],
    }),
    getAdminOrders: builder.query({
      query: (params) => ({
        url: '/orders/admin/orders',
        method: 'GET',
        params,
      }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/orders/admin/orders/${id}/status`,
        method: 'PATCH',
        data: { status, reason },
      }),
      invalidatesTags: ['Order', 'AdminStats', 'AuditLog'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} = adminOrderApi;
