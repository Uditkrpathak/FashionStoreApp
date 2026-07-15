// src/features/profile/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile:    null, // { name, avatar, dob, gender }
    addresses:  [],   // Address[]
    savedCards: [],   // Card[]
  },
  reducers: {
    setProfile(state, action)   { state.profile    = action.payload; },
    setAddresses(state, action) { state.addresses  = action.payload; },
    setSavedCards(state, action){ state.savedCards = action.payload; },

    addAddress(state, action) {
      state.addresses.push(action.payload);
    },
    updateAddress(state, action) {
      const idx = state.addresses.findIndex((a) => a._id === action.payload._id);
      if (idx >= 0) state.addresses[idx] = action.payload;
    },
    removeAddress(state, action) {
      state.addresses = state.addresses.filter((a) => a._id !== action.payload);
    },
    clearUserData(state) {
      state.profile    = null;
      state.addresses  = [];
      state.savedCards = [];
    },
  },
});

export const {
  setProfile,
  setAddresses,
  setSavedCards,
  addAddress,
  updateAddress,
  removeAddress,
  clearUserData,
} = userSlice.actions;

export const selectProfile    = (state) => state.user.profile;
export const selectAddresses  = (state) => state.user.addresses;
export const selectSavedCards = (state) => state.user.savedCards;

export default userSlice.reducer;
