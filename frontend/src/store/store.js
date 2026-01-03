import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authSlice from "./authSlice";
import postsSlice from "./postsSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    posts: postsSlice,
  },

  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});

export default store;
