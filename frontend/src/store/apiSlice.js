// frontend/src/store/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    prepareHeaders: (headers, { getState }) => {
      // Set Content-Type
      headers.set("Content-Type", "application/json");

      // Get token from Redux auth state
      const token = getState().auth.token;

      // If token exists, add it to Authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Posts", "Post", "Comments", "Analytics"],
  endpoints: () => ({}),
});
