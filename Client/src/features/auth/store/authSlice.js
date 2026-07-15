// src/features/auth/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearTokens, saveTokens } from '../../../shared/utils/storage';

// ── Async thunks ──────────────────────────────────────────────────────────────

/** Called after a successful login response to persist tokens & set state. */
export const loginSuccess = createAsyncThunk(
  'auth/loginSuccess',
  async ({ user, accessToken, refreshToken }) => {
    await saveTokens(accessToken, refreshToken);
    return user;
  },
);

/** Called on logout — clears tokens and resets state. */
export const logout = createAsyncThunk('auth/logout', async () => {
  await clearTokens();
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            null,   // { _id, name, email, phone, role, avatar }
    isAuthenticated: false,
    isLoading:       false,
    error:           null,
  },
  reducers: {
    setUser(state, action) {
      state.user            = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser(state) {
      state.user            = null;
      state.isAuthenticated = false;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // loginSuccess
    builder
      .addCase(loginSuccess.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(loginSuccess.fulfilled, (state, action) => {
        state.isLoading      = false;
        state.user           = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginSuccess.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.error.message;
      });

    // logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user            = null;
        state.isAuthenticated = false;
        state.error           = null;
      });
  },
});

export const { setUser, clearUser, setLoading, setError, clearError } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectUser            = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading     = (state) => state.auth.isLoading;
export const selectAuthError       = (state) => state.auth.error;

export default authSlice.reducer;
