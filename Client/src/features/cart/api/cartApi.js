// src/features/cart/api/cartApi.js
import { baseApi } from '../../../shared/services/baseApi';
import { syncCart } from '../store/cartSlice';
import { setSelectedAddress } from '../../checkout/store/checkoutSlice';

export const cartApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    getCart: builder.query({
      query: () => ({ url: '/cart' }),
      providesTags: ['Cart'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.cart) {
            dispatch(syncCart(data.cart));
          }
        } catch (err) {
          console.error('getCart sync error', err);
        }
      },
    }),

    addToCartRemote: builder.mutation({
      query: (body) => ({ url: '/cart/items', method: 'POST', data: body }),
      invalidatesTags: ['Cart'],
    }),

    updateCartItem: builder.mutation({
      query: ({ key, quantity }) => {
        const [productId, variantSku] = key.split('_');
        return { url: '/cart/items', method: 'PUT', data: { productId, variantSku, quantity } };
      },
      invalidatesTags: ['Cart'],
    }),

    removeCartItem: builder.mutation({
      query: (key) => {
        const [productId, variantSku] = key.split('_');
        return { url: '/cart/items', method: 'DELETE', data: { productId, variantSku } };
      },
      invalidatesTags: ['Cart'],
    }),

    clearCartRemote: builder.mutation({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),

    applyCouponRemote: builder.mutation({
      query: (body) => ({ url: '/cart/coupon/apply', method: 'POST', data: body }),
      invalidatesTags: ['Cart', 'Coupon'],
    }),

    removeCouponRemote: builder.mutation({
      query: () => ({ url: '/cart/coupon/remove', method: 'DELETE' }),
      invalidatesTags: ['Cart', 'Coupon'],
    }),

    // Addresses (managed via Cart Service)
    getAddresses: builder.query({
      query: () => ({ url: '/cart/addresses' }),
      providesTags: ['Address'],
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.addresses && data.addresses.length > 0) {
            const state = getState();
            if (!state.checkout?.selectedAddress) {
              dispatch(setSelectedAddress(data.addresses[0]));
            }
          }
        } catch (err) {
          console.error('getAddresses sync error', err);
        }
      },
    }),

    addAddress: builder.mutation({
      query: (body) => ({ url: '/cart/addresses', method: 'POST', data: body }),
      invalidatesTags: ['Address'],
    }),

    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/cart/addresses/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Address'],
    }),

    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/cart/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartRemoteMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartRemoteMutation,
  useApplyCouponRemoteMutation,
  useRemoveCouponRemoteMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = cartApi;
