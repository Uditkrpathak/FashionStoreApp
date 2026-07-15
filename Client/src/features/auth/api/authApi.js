// src/features/auth/api/authApi.js
// ─────────────────────────────────────────────────────────────────────────────
// Auth endpoints injected into the shared baseApi.
// Public routes: login, register, verify-otp, refresh-token, forgot/reset password
// Protected routes: me, profile update
// ─────────────────────────────────────────────────────────────────────────────
import { baseApi } from '../../../shared/services/baseApi';
import { setUser } from '../store/authSlice';

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', data: body }),
    }),

    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', data: body }),
    }),

    verifyOtp: builder.mutation({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', data: body }),
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', data: body }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', data: body }),
    }),

    refreshToken: builder.mutation({
      query: (body) => ({ url: '/auth/refresh-token', method: 'POST', data: body }),
    }),

    // ── Protected ───────────────────────────────────────────────────────────

    getMe: builder.query({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          }
        } catch (err) {
          console.log('GetMe sync error', err);
        }
      }
    }),

    updateProfile: builder.mutation({
      query: (body) => ({ url: '/auth/profile', method: 'PATCH', data: body }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          }
        } catch (err) {
          console.log('UpdateProfile sync error', err);
        }
      }
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi;
