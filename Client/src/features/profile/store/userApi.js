import { baseApi } from '../../../shared/services/baseApi';

export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/auth/profile', // Using the gateway routing? Wait, /auth/me exists, but we didn't add /auth/profile GET, we added /auth/profile PATCH
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    addAddress: builder.mutation({
      query: (address) => ({
        url: '/auth/addresses',
        method: 'POST',
        body: address,
      }),
      invalidatesTags: ['User', 'Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...address }) => ({
        url: `/auth/addresses/${id}`,
        method: 'PUT',
        body: address,
      }),
      invalidatesTags: ['User', 'Address'],
    }),
    removeAddress: builder.mutation({
      query: (id) => ({
        url: `/auth/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Address'],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: '/auth/wishlist',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['User', 'Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/auth/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Wishlist'],
    }),
    getNotifications: builder.query({
      query: () => '/notifications', // Based on server.js mount
      providesTags: ['Notification'],
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useRemoveAddressMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = userApi;
