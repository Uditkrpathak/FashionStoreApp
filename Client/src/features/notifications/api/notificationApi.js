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
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            if (draft?.notifications) {
              const item = draft.notifications.find((n) => n._id === id);
              if (item) item.isRead = true;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/auth/notifications/read-all',
        method: 'PUT',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            if (draft?.notifications) {
              draft.notifications.forEach((n) => {
                n.isRead = true;
              });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Notification'],
    }),
    registerPushToken: builder.mutation({
      query: (pushToken) => ({
        url: '/auth/notifications/push-token',
        method: 'POST',
        data: { pushToken },
      }),
    }),
    updatePreferences: builder.mutation({
      query: (preferences) => ({
        url: '/auth/notifications/preferences',
        method: 'PUT',
        data: preferences,
      }),
    }),
  }),
});

export const { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation, 
  useMarkAllAsReadMutation,
  useRegisterPushTokenMutation,
  useUpdatePreferencesMutation
} = notificationApi;
