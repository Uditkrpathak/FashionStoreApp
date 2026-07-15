// src/features/checkout/store/checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    selectedAddress:   null,  // Address object
    deliveryOption:    null,  // { id, label, price, estimatedDays }
    paymentMethod:     null,  // { type: 'card'|'upi'|'cod', details: {} }
    orderNote:         '',
  },
  reducers: {
    setSelectedAddress(state, action)  { state.selectedAddress = action.payload; },
    setDeliveryOption(state, action)   { state.deliveryOption  = action.payload; },
    setPaymentMethod(state, action)    { state.paymentMethod   = action.payload; },
    setOrderNote(state, action)        { state.orderNote       = action.payload; },
    resetCheckout(state) {
      state.selectedAddress = null;
      state.deliveryOption  = null;
      state.paymentMethod   = null;
      state.orderNote       = '';
    },
  },
});

export const {
  setSelectedAddress,
  setDeliveryOption,
  setPaymentMethod,
  setOrderNote,
  resetCheckout,
} = checkoutSlice.actions;

export const selectCheckout        = (state) => state.checkout;
export const selectSelectedAddress = (state) => state.checkout.selectedAddress;
export const selectDeliveryOption  = (state) => state.checkout.deliveryOption;
export const selectPaymentMethod   = (state) => state.checkout.paymentMethod;

export default checkoutSlice.reducer;
