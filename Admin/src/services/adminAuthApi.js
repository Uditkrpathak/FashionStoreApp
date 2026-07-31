import { baseApi } from '../shared/services/baseApi';

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCaptcha: builder.query({
      query: () => ({
        url: '/auth/captcha',
        method: 'GET',
      }),
    }),
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        data: { email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ email, code }) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        data: { email, code },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, password, resetToken }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        data: { email, password, resetToken },
      }),
    }),
    getAdminUsers: builder.query({
      query: (params) => ({
        url: '/auth/admin/users',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role, permissions }) => ({
        url: `/auth/admin/users/${id}/role`,
        method: 'PATCH',
        data: { role, permissions },
      }),
      invalidatesTags: ['User', 'AuditLog', 'Role'],
    }),
    toggleUserStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/auth/admin/users/${id}/status`,
        method: 'PATCH',
        data: { status, reason },
      }),
      invalidatesTags: ['User', 'AuditLog'],
    }),
    getAuditLogs: builder.query({
      query: (params) => ({
        url: '/auth/admin/audit-logs',
        method: 'GET',
        params,
      }),
      providesTags: ['AuditLog'],
    }),
    verifyAuditIntegrity: builder.query({
      query: () => ({
        url: '/auth/admin/audit-logs/verify-integrity',
        method: 'GET',
      }),
      providesTags: ['AuditLog'],
    }),
    getRoles: builder.query({
      query: () => ({
        url: '/auth/admin/roles',
        method: 'GET',
      }),
      providesTags: ['Role'],
    }),
    createRole: builder.mutation({
      query: (data) => ({
        url: '/auth/admin/roles',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Role', 'AuditLog'],
    }),
    updateRole: builder.mutation({
      query: ({ id, description, permissions }) => ({
        url: `/auth/admin/roles/${id}`,
        method: 'PUT',
        data: { description, permissions },
      }),
      invalidatesTags: ['Role', 'AuditLog'],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/auth/admin/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role', 'AuditLog'],
    }),
    getActiveSessions: builder.query({
      query: (params) => ({
        url: '/auth/admin/sessions',
        method: 'GET',
        params,
      }),
      providesTags: ['Session'],
    }),
    revokeSession: builder.mutation({
      query: (data) => ({
        url: '/auth/admin/sessions/revoke',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Session', 'AuditLog'],
    }),
    getStoreConfig: builder.query({
      query: () => ({
        url: '/auth/admin/settings',
        method: 'GET',
      }),
      providesTags: ['Settings'],
    }),
    updateStoreConfig: builder.mutation({
      query: (data) => ({
        url: '/auth/admin/settings',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Settings', 'AuditLog'],
    }),
  }),
});

export const {
  useGetCaptchaQuery,
  useAdminLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useGetAuditLogsQuery,
  useLazyVerifyAuditIntegrityQuery,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetActiveSessionsQuery,
  useRevokeSessionMutation,
  useGetStoreConfigQuery,
  useUpdateStoreConfigMutation,
} = adminAuthApi;
