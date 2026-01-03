// src/app/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";

// Feature reducers
import postsReducer from "@/features/posts/postsSlice";
import favoritesReducer from "@/features/favorites/favoritesSlice";
import themeReducer from "@/features/theme/themeSlice";

// RTK Query API reducer
import { apiSlice } from "@/features/api/apiSlice";

const rootReducer = combineReducers({
  posts: postsReducer,
  favorites: favoritesReducer,
  theme: themeReducer,

  // RTK Query
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
