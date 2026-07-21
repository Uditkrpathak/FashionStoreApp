import { baseApi } from '../shared/services/baseApi';

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      invalidatesTags: ['Auth'],
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
      invalidatesTags: ['User', 'AuditLog'],
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
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useGetAuditLogsQuery,
} = adminAuthApi;
