// frontend/src/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const baseQuery = fetchBaseQuery({
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
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    // Try to parse the error message
    const errorMessage = result.error.data?.message;

    // Only auto-logout for token issues, not just any 401/403 (though usually 401 IS token issue)
    if (errorMessage === "Token has expired" || errorMessage === "Invalid token" || errorMessage === "No token provided") {
         api.dispatch(logout());
    } else if (result.error.status === 401) {
         // Default 401 behavior: logout
         api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
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
    "Contacts",
  ],
  endpoints: () => ({}),
});

export default apiSlice;
