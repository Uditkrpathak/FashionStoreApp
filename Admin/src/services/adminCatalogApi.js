import { baseApi } from '../shared/services/baseApi';

export const adminCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query({
      query: (params) => ({
        url: '/products',
        method: 'GET',
        params,
      }),
      providesTags: ['Product'],
    }),
    getAdminCategories: builder.query({
      query: () => ({
        url: '/products/categories',
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products/admin/products',
        method: 'POST',
        data: productData,
      }),
      invalidatesTags: ['Product', 'Category', 'AdminStats'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/admin/products/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'Category', 'AuditLog', 'AdminStats'],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/products/admin/categories',
        method: 'POST',
        data: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),
    getAdminReviews: builder.query({
      query: (params) => ({
        url: '/products/admin/reviews',
        method: 'GET',
        params,
      }),
      providesTags: ['Review'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/products/admin/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
  }),
});

export const {
  useGetAdminProductsQuery,
  useGetAdminCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateCategoryMutation,
  useGetAdminReviewsQuery,
  useDeleteReviewMutation,
} = adminCatalogApi;
