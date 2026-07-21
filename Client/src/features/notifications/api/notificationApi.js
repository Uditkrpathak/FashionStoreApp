// src/features/notifications/api/notificationApi.js
import { baseApi } from '../../../shared/services/baseApi';

export const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({ url: '/auth/notifications' }),
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/auth/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/auth/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } = notificationApi;
