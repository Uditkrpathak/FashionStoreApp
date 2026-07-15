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
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } = notificationApi;
