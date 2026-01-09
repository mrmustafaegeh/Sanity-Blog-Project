// frontend/src/api/adminAPI.js
import { apiSlice } from "../store/apiSlice";

export const adminAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminToken: builder.mutation({
      query: (apiKey) => ({
        url: "/admin/login",
        method: "POST",
        body: { apiKey },
      }),
    }),

    getAdminAnalytics: builder.query({
      query: () => "/admin/analytics",
      providesTags: ["AdminAnalytics"],
    }),

    regenerateSummary: builder.mutation({
      query: (id) => ({
        url: `/ai-summary/${id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // Admin posts management
    getAdminPosts: builder.query({
      query: ({ page = 1, limit = 10, status, search, author }) => ({
        url: "/admin/posts",
        method: "GET",
        params: { page, limit, status, search, author },
      }),
      providesTags: ["Post"],
    }),

    updatePostStatus: builder.mutation({
      query: ({ id, status, rejectionReason }) => ({
        url: `/admin/posts/${id}/status`,
        method: "PATCH",
        body: { status, rejectionReason },
      }),
      invalidatesTags: ["Post"],
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAdminTokenMutation,
  useGetAdminAnalyticsQuery,
  useRegenerateSummaryMutation,
  useGetAdminPostsQuery,
  useUpdatePostStatusMutation,
  useUpdateUserRoleMutation,
} = adminAPI;
