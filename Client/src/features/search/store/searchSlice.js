// src/features/search/store/searchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query:         '',
    recentSearches: [],  // string[]
    activeFilters: {
      priceMin:  null,
      priceMax:  null,
      sizes:     [],
      colors:    [],
      brands:    [],
      rating:    null,
    },
    sortBy:   'popularity', // 'popularity' | 'price_asc' | 'price_desc' | 'newest'
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    addRecentSearch(state, action) {
      const term = action.payload.trim();
      if (!term) return;
      state.recentSearches = [
        term,
        ...state.recentSearches.filter((s) => s !== term),
      ].slice(0, 10);
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
    setFilters(state, action) {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    resetFilters(state) {
      state.activeFilters = {
        priceMin: null, priceMax: null,
        sizes: [], colors: [], brands: [], rating: null,
      };
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
  },
});

export const {
  setQuery,
  addRecentSearch,
  clearRecentSearches,
  setFilters,
  resetFilters,
  setSortBy,
} = searchSlice.actions;

export const selectQuery         = (state) => state.search.query;
export const selectRecentSearches = (state) => state.search.recentSearches;
export const selectActiveFilters = (state) => state.search.activeFilters;
export const selectSortBy        = (state) => state.search.sortBy;

export default searchSlice.reducer;
