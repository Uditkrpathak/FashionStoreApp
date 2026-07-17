// src/features/products/api/productApi.js
import { baseApi } from '../../../shared/services/baseApi';

export const productApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map(({ _id }) => ({ type: 'Product', id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductById: builder.query({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    getCategories: builder.query({
      query: () => ({ url: '/products/categories' }),
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    searchProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),

    // Wishlist via Auth Service (moved from catalog)
    getWishlist: builder.query({
      query: () => ({ url: '/auth/wishlist' }),
      providesTags: ['Wishlist'],
    }),

    addToWishlist: builder.mutation({
      query: (body) => ({ url: '/auth/wishlist', method: 'POST', data: body }),
      invalidatesTags: ['Wishlist'],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({ url: `/auth/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),

    // Reviews
    getReviews: builder.query({
      query: ({ productId, params }) => ({ url: `/products/${productId}/reviews`, params }),
      providesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
    }),

    addReview: builder.mutation({
      query: ({ productId, ...body }) => ({
        url:    `/products/reviews`,
        method: 'POST',
        data:   { ...body, productId },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: productId },
        { type: 'Product', id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useSearchProductsQuery,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetReviewsQuery,
  useAddReviewMutation,
} = productApi;
