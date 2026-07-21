import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('admin_token');
const userStr = localStorage.getItem('admin_user');
let parsedUser = null;
try {
  if (userStr) parsedUser = JSON.parse(userStr);
} catch (e) {
  parsedUser = null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    user: parsedUser || null,
    isAuthenticated: !!token,
  },
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectAdminUser = (state) => state.auth.user;
export const selectIsAdminAuthenticated = (state) => state.auth.isAuthenticated;
export default authSlice.reducer;
