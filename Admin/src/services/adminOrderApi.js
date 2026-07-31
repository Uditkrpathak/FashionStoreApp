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
    createShipment: builder.mutation({
      query: ({ id, courierName, trackingNumber, trackingUrl }) => ({
        url: `/orders/admin/orders/${id}/shipment`,
        method: 'POST',
        data: { courierName, trackingNumber, trackingUrl },
      }),
      invalidatesTags: ['Order', 'AdminStats', 'AuditLog'],
    }),
    processReturnAction: builder.mutation({
      query: ({ id, action, returnType, adminNotes }) => ({
        url: `/orders/admin/orders/${id}/return-action`,
        method: 'POST',
        data: { action, returnType, adminNotes },
      }),
      invalidatesTags: ['Order', 'AdminStats', 'AuditLog'],
    }),
    processRefund: builder.mutation({
      query: ({ id, refundMode, notes }) => ({
        url: `/orders/admin/orders/${id}/refund`,
        method: 'POST',
        data: { refundMode, notes },
      }),
      invalidatesTags: ['Order', 'AdminStats', 'AuditLog'],
    }),
    createReplacementOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/admin/orders/${id}/replacement`,
        method: 'POST',
      }),
      invalidatesTags: ['Order', 'AdminStats', 'AuditLog'],
    }),
    getTickets: builder.query({
      query: (params) => ({
        url: '/orders/admin/tickets',
        method: 'GET',
        params,
      }),
      providesTags: ['Order'],
    }),
    replyTicket: builder.mutation({
      query: ({ id, message, isInternalNote, attachments }) => ({
        url: `/orders/admin/tickets/${id}/reply`,
        method: 'POST',
        data: { message, isInternalNote, attachments },
      }),
      invalidatesTags: ['Order'],
    }),
    escalateTicket: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/orders/admin/tickets/${id}/escalate`,
        method: 'POST',
        data: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
    closeTicket: builder.mutation({
      query: ({ id, resolutionNotes }) => ({
        url: `/orders/admin/tickets/${id}/close`,
        method: 'POST',
        data: { resolutionNotes },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useCreateShipmentMutation,
  useProcessReturnActionMutation,
  useProcessRefundMutation,
  useCreateReplacementOrderMutation,
  useGetTicketsQuery,
  useReplyTicketMutation,
  useEscalateTicketMutation,
  useCloseTicketMutation,
} = adminOrderApi;
