// frontend/src/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth?.token;

      // If we have a token, add it to headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Post",
    "Posts",
    "Category",
    "Categories",
    "Comment",
    "Comments",
    "Submission",
    "UserSubmissions",
    "PendingSubmissions",
    "AdminAnalytics",
    "User",
  ],
  endpoints: () => ({}),
});

export default apiSlice;
