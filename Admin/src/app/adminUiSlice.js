import { createSlice } from '@reduxjs/toolkit';

const initialViewMode = localStorage.getItem('admin_user_view_mode') || 'grid';
let initialStarred = [];
try {
  const starredStr = localStorage.getItem('admin_starred_users');
  if (starredStr) initialStarred = JSON.parse(starredStr);
} catch (e) {
  initialStarred = [];
}

const adminUiSlice = createSlice({
  name: 'adminUi',
  initialState: {
    userViewMode: initialViewMode, // 'grid' | 'table'
    starredUsers: initialStarred,
    userSearchQuery: '',
    userRoleFilter: '',
    userPage: 1,
  },
  reducers: {
    setUserViewMode(state, action) {
      state.userViewMode = action.payload;
      localStorage.setItem('admin_user_view_mode', action.payload);
    },
    toggleStarUser(state, action) {
      const userId = action.payload;
      if (state.starredUsers.includes(userId)) {
        state.starredUsers = state.starredUsers.filter((id) => id !== userId);
      } else {
        state.starredUsers.push(userId);
      }
      localStorage.setItem('admin_starred_users', JSON.stringify(state.starredUsers));
    },
    setUserSearch(state, action) {
      state.userSearchQuery = action.payload;
      state.userPage = 1;
    },
    setUserRoleFilter(state, action) {
      state.userRoleFilter = action.payload;
      state.userPage = 1;
    },
    setUserPage(state, action) {
      state.userPage = action.payload;
    },
    resetUserFilters(state) {
      state.userSearchQuery = '';
      state.userRoleFilter = '';
      state.userPage = 1;
    },
  },
});

export const {
  setUserViewMode,
  toggleStarUser,
  setUserSearch,
  setUserRoleFilter,
  setUserPage,
  resetUserFilters,
} = adminUiSlice.actions;

export const selectUserViewMode = (state) => state.adminUi.userViewMode;
export const selectStarredUsers = (state) => state.adminUi.starredUsers;
export const selectUserSearchQuery = (state) => state.adminUi.userSearchQuery;
export const selectUserRoleFilter = (state) => state.adminUi.userRoleFilter;
export const selectUserPage = (state) => state.adminUi.userPage;

export default adminUiSlice.reducer;
