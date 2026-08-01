// src/features/wishlist/store/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], // [{ _id, productId, title, image, price, mrp }]
  },
  reducers: {
    toggleWishlistLocal(state, action) {
      const product = action.payload;
      const targetId = product.productId || product._id;
      const idx = state.items.findIndex((i) => (i.productId || i._id) === targetId);
      if (idx >= 0) {
        state.items.splice(idx, 1); // optimistic remove
      } else {
        state.items.push(product);  // optimistic add
      }
    },
    setWishlist(state, action) {
      state.items = action.payload || [];
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlistLocal, setWishlist, clearWishlist } = wishlistSlice.actions;

import { productApi } from '../../products/api/productApi';
import { showGlobalToast } from '../../../context/ToastContext';

export const toggleWishlist = (product) => async (dispatch, getState) => {
  if (!product) return;
  const pId = product.productId || product._id;
  if (!pId) {
    console.error('Cannot toggle wishlist: product ID is missing', product);
    return;
  }

  const isWishlisted = getState().wishlist.items.some((i) => (i.productId || i._id) === pId);

  const formattedProduct = {
    productId: pId,
    _id: pId,
    title: product.title || 'Product',
    image: product.image || (product.images && product.images[0]),
    price: product.price || 0,
    mrp: product.mrp || product.originalPrice,
  };

  dispatch(toggleWishlistLocal(formattedProduct));

  // Show visual feedback alert
  if (isWishlisted) {
    showGlobalToast('Removed from wishlist', 'info');
  } else {
    showGlobalToast('Added to wishlist', 'success');
  }
  
  try {
    if (isWishlisted) {
      await dispatch(productApi.endpoints.removeFromWishlist.initiate(pId)).unwrap();
    } else {
      await dispatch(productApi.endpoints.addToWishlist.initiate({ productId: pId })).unwrap();
    }
  } catch (err) {
    console.error('Failed to sync wishlist remote', err);
  }
};

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted  = (productId) => (state) =>
  state.wishlist.items.some((i) => (i.productId || i._id) === productId);

export default wishlistSlice.reducer;
