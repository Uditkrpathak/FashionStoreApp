// src/app/store/rootReducer.js
// ─────────────────────────────────────────────────────────────────────────────
// Combines all slice reducers + the single RTK Query API reducer.
// Import this in store/index.js.
// ─────────────────────────────────────────────────────────────────────────────
import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '../../shared/services/baseApi';
import authReducer from '../../features/auth/store/authSlice';
import userReducer from '../../features/profile/store/userSlice';
import productReducer from '../../features/products/store/productSlice';
import searchReducer from '../../features/search/store/searchSlice';
import wishlistReducer from '../../features/wishlist/store/wishlistSlice';
import cartReducer from '../../features/cart/store/cartSlice';
import checkoutReducer from '../../features/checkout/store/checkoutSlice';
import orderReducer from '../../features/orders/store/orderSlice';
import notificationReducer from '../../features/notifications/store/notificationSlice';

const appReducer = combineReducers({
  // RTK Query — single API cache
  [baseApi.reducerPath]: baseApi.reducer,

  // Domain slices
  auth: authReducer,
  user: userReducer,
  product: productReducer,
  search: searchReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  orders: orderReducer,
  notifications: notificationReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout/fulfilled') {
    // Clear all state on logout to prevent data leaks between users
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
