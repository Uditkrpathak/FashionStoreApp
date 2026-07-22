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
    shipOrder: builder.mutation({
      query: ({ id, courier, trackingId }) => ({
        url: `/orders/admin/orders/${id}/ship`,
        method: 'PATCH',
        data: { courier, trackingId },
      }),
      invalidatesTags: ['Order', 'AuditLog'],
    }),
    processReturn: builder.mutation({
      query: ({ id, status, reason, refundAmount }) => ({
        url: `/orders/admin/orders/${id}/return`,
        method: 'PATCH',
        data: { status, reason, refundAmount },
      }),
      invalidatesTags: ['Order', 'AdminStats', 'AuditLog'],
    }),
    getOrderInvoice: builder.query({
      query: (id) => ({
        url: `/orders/admin/orders/${id}/invoice`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useShipOrderMutation,
  useProcessReturnMutation,
  useGetOrderInvoiceQuery,
  useLazyGetOrderInvoiceQuery,
} = adminOrderApi;
