import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice"; // Make sure this is from the right path
import authSlice from "./authSlice";
import postsSlice from "./postsSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    posts: postsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
