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

    getAdminUsers: builder.query({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    getAdminComments: builder.query({
      query: (params) => ({
        url: "/admin/comments",
        params,
      }),
      providesTags: ["Comments"],
    }),

    toggleCommentApproval: builder.mutation({
      query: (commentId) => ({
        url: `/admin/comments/${commentId}/toggle-approval`,
        method: "PATCH",
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/admin/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),

    seedData: builder.mutation({
      query: (data) => ({
        url: "/admin/seed",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post", "Comments", "AdminAnalytics"],
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
  useGetAdminUsersQuery,
  useDeleteUserMutation,
  useGetAdminCommentsQuery,
  useToggleCommentApprovalMutation,
  useDeleteCommentMutation,
  useSeedDataMutation,
} = adminAPI;
