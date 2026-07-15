// src/features/notifications/store/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list:        [],  // Notification[]
    unreadCount: 0,
  },
  reducers: {
    setNotifications(state, action) {
      state.list        = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    markAllRead(state) {
      state.list        = state.list.map((n) => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
    markRead(state, action) {
      const n = state.list.find((n) => n._id === action.payload);
      if (n) {
        n.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearNotifications(state) {
      state.list        = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  markAllRead,
  markRead,
  clearNotifications,
} = notificationSlice.actions;

export const selectNotifications = (state) => state.notifications.list;
export const selectUnreadCount   = (state) => state.notifications.unreadCount;

export default notificationSlice.reducer;
