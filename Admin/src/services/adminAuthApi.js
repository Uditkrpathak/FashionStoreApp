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
    getTickets: builder.query({
      query: (params) => ({
        url: '/auth/admin/tickets',
        method: 'GET',
        params,
      }),
      providesTags: ['Ticket'],
    }),
    replyToTicket: builder.mutation({
      query: ({ id, text, status, priority }) => ({
        url: `/auth/admin/tickets/${id}/reply`,
        method: 'POST',
        data: { text, status, priority },
      }),
      invalidatesTags: ['Ticket', 'AuditLog'],
    }),
    getSettings: builder.query({
      query: () => ({
        url: '/auth/admin/settings',
        method: 'GET',
      }),
      providesTags: ['Setting'],
    }),
    updateSetting: builder.mutation({
      query: ({ key, value }) => ({
        url: '/auth/admin/settings',
        method: 'PUT',
        data: { key, value },
      }),
      invalidatesTags: ['Setting', 'AuditLog'],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useGetAuditLogsQuery,
  useGetTicketsQuery,
  useReplyToTicketMutation,
  useGetSettingsQuery,
  useUpdateSettingMutation,
} = adminAuthApi;
