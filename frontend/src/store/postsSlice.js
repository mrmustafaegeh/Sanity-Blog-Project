// src/features/posts/postsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPostId: null,
  filters: {
    category: null,
    sort: "latest",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSelectedPost(state, action) {
      state.selectedPostId = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const { setSelectedPost, setFilters, resetFilters } = postsSlice.actions;

export default postsSlice.reducer;
