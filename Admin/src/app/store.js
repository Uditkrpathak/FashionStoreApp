import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../shared/services/baseApi';
import authReducer from './authSlice';
import adminUiReducer from './adminUiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminUi: adminUiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
