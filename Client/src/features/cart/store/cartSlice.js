// src/features/cart/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const recalcTotals = (state) => {
  if (!state.items) state.items = [];
  state.totalQty   = state.items.reduce((sum, i) => sum + i.quantity, 0);
  state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:       [],   // [{ _id, productId, variantSku, title, image, price, size, color, quantity }]
    totalQty:    0,
    totalPrice:  0,
    coupon:      null, // { code, discount, type }
    couponError: null,
  },
  reducers: {
    addToCartLocal(state, action) {
      const item = action.payload;
      const key  = `${item.productId}_${item.variantSku}`;
      const existing = state.items.find(
        (i) => `${i.productId}_${i.variantSku}` === key,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      recalcTotals(state);
    },

    removeFromCartLocal(state, action) {
      const key = action.payload; // `${productId}_${variantSku}`
      state.items = state.items.filter(
        (i) => `${i.productId}_${i.variantSku}` !== key,
      );
      recalcTotals(state);
    },

    updateQtyLocal(state, action) {
      const { key, quantity } = action.payload;
      const item = state.items.find(
        (i) => `${i.productId}_${i.variantSku}` === key,
      );
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      recalcTotals(state);
    },

    clearCartLocal(state) {
      state.items      = [];
      state.totalQty   = 0;
      state.totalPrice = 0;
      state.coupon     = null;
      state.couponError = null;
    },

    applyCoupon(state, action) {
      state.coupon      = action.payload;
      state.couponError = null;
    },

    setCouponError(state, action) {
      state.couponError = action.payload;
      state.coupon      = null;
    },

    removeCoupon(state) {
      state.coupon      = null;
      state.couponError = null;
    },

    // Sync cart from server response (replaces local state)
    syncCart(state, action) {
      state.items = action.payload.items ?? [];
      recalcTotals(state);
    },
  },
});

export const {
  addToCartLocal,
  removeFromCartLocal,
  updateQtyLocal,
  clearCartLocal,
  applyCoupon,
  setCouponError,
  removeCoupon,
  syncCart,
} = cartSlice.actions;

import { cartApi } from '../api/cartApi';

export const addToCart = (item) => async (dispatch) => {
  dispatch(addToCartLocal(item));
  try {
    await dispatch(cartApi.endpoints.addToCartRemote.initiate(item)).unwrap();
  } catch (err) {
    console.error('Failed to add to remote cart', err);
  }
};

export const removeFromCart = (key) => async (dispatch) => {
  dispatch(removeFromCartLocal(key));
  try {
    await dispatch(cartApi.endpoints.removeCartItem.initiate(key)).unwrap();
  } catch (err) {
    console.error('Failed to remove from remote cart', err);
  }
};

export const updateQty = (payload) => async (dispatch) => {
  dispatch(updateQtyLocal(payload));
  try {
    await dispatch(cartApi.endpoints.updateCartItem.initiate(payload)).unwrap();
  } catch (err) {
    console.error('Failed to update remote cart qty', err);
  }
};

export const clearCart = () => async (dispatch) => {
  dispatch(clearCartLocal());
  try {
    await dispatch(cartApi.endpoints.clearCartRemote.initiate()).unwrap();
  } catch (err) {
    console.error('Failed to clear remote cart', err);
  }
};

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCartItems      = (state) => state.cart?.items ?? [];
export const selectCartTotalQty   = (state) => state.cart.totalQty;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCoupon         = (state) => state.cart.coupon;
export const selectCouponError    = (state) => state.cart.couponError;

export const selectDiscountedTotal = (state) => {
  const { totalPrice, coupon } = state.cart;
  if (!coupon) return totalPrice;
  const type = coupon.type || coupon.discountType;
  const discount = coupon.discount !== undefined ? coupon.discount : coupon.discountValue;
  if (type === 'percent' || type === 'percentage') {
    return totalPrice * (1 - (discount || 0) / 100);
  }
  return Math.max(0, totalPrice - (discount || 0));
};

export default cartSlice.reducer;
