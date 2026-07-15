// src/features/orders/store/orderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:      [],   // Order[]
    activeOrder: null, // the most recently placed order
  },
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    setActiveOrder(state, action) {
      state.activeOrder = action.payload;
    },
    clearActiveOrder(state) {
      state.activeOrder = null;
    },
  },
});

export const { setOrders, setActiveOrder, clearActiveOrder } = orderSlice.actions;

export const selectOrders      = (state) => state.orders.orders;
export const selectActiveOrder = (state) => state.orders.activeOrder;

export default orderSlice.reducer;
