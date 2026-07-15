// src/features/products/store/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    selectedProduct: null,  // full product object when viewing ProductDetail
    selectedVariant: null,  // { size, color, sku, stock, price }
  },
  reducers: {
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
      // Auto-select first variant
      state.selectedVariant = action.payload?.variants?.[0] ?? null;
    },
    setSelectedVariant(state, action) {
      state.selectedVariant = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.selectedVariant = null;
    },
  },
});

export const {
  setSelectedProduct,
  setSelectedVariant,
  clearSelectedProduct,
} = productSlice.actions;

export const selectSelectedProduct = (state) => state.product.selectedProduct;
export const selectSelectedVariant = (state) => state.product.selectedVariant;

export default productSlice.reducer;
