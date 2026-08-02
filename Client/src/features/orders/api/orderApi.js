// src/features/orders/api/orderApi.js
import { baseApi } from '../../../shared/services/baseApi';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    placeOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', data: body }),
      invalidatesTags: ['Order', 'Cart'],
    }),

    verifyPayment: builder.mutation({
      query: (body) => ({ url: '/orders/verify-payment', method: 'POST', data: body }),
      invalidatesTags: ['Order'],
    }),

    getOrders: builder.query({
      query: (params) => ({ url: '/orders', params }),
      providesTags: (result) =>
        result?.data?.orders
          ? [
              ...result.data.orders.map(({ _id }) => ({ type: 'Order', id: _id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrderById: builder.query({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    trackOrder: builder.query({
      query: (id) => ({ url: `/orders/${id}/track` }),
      providesTags: (result, error, id) => [{ type: 'Order', id: `track-${id}` }],
    }),

    cancelOrder: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/cancel`, method: 'POST', data: body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    returnOrder: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/return`, method: 'POST', data: body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),

    createTicket: builder.mutation({
      query: (body) => ({ url: '/orders/tickets', method: 'POST', data: body }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    getUserTickets: builder.query({
      query: (params) => ({ url: '/orders/tickets/my', params }),
      providesTags: (result) =>
        result?.tickets
          ? [
              ...result.tickets.map(({ _id }) => ({ type: 'Ticket', id: _id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),

    replyTicket: builder.mutation({
      query: ({ id, message }) => ({
        url: `/orders/tickets/${id}/reply`,
        method: 'POST',
        data: { message },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Ticket', id },
        { type: 'Ticket', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useVerifyPaymentMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useTrackOrderQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useCreateTicketMutation,
  useGetUserTicketsQuery,
  useReplyTicketMutation,
} = orderApi;
