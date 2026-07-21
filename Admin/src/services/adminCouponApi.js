import { baseApi } from '../shared/services/baseApi';

export const adminCouponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCoupons: builder.query({
      query: () => ({
        url: '/cart/admin/coupons',
        method: 'GET',
      }),
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: '/cart/admin/coupons',
        method: 'POST',
        data: couponData,
      }),
      invalidatesTags: ['Coupon', 'AuditLog'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/cart/admin/coupons/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Coupon', 'AuditLog'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/cart/admin/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon', 'AuditLog'],
    }),
  }),
});

export const {
  useGetAdminCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = adminCouponApi;
