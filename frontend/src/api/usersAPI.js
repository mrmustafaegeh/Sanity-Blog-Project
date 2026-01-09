// frontend/src/api/usersAPI.js
import { apiSlice } from "../store/apiSlice";

export const usersAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get public author profile
    getAuthorProfile: builder.query({
      query: (username) => `/users/author/${username}`,
      providesTags: (result, error, username) => [
        { type: "User", id: username },
      ],
    }),

    // Get user profile
    getUserProfile: builder.query({
      query: (userId) => `/users/${userId}/profile`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    // Get current user's profile
    getMyProfile: builder.query({
      query: () => "/users/me/profile",
      providesTags: ["User"],
    }),

    // Get user's posts
    getUserPosts: builder.query({
      query: ({ userId, page = 1, limit = 10, status } = {}) => {
        const endpoint = userId ? `/users/${userId}/posts` : "/users/me/posts";
        return {
          url: endpoint,
          params: { page, limit, status },
        };
      },
      providesTags: ["Posts"],
    }),

    // Get user's liked posts
    getUserLikedPosts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/users/me/likes",
        params: { page, limit },
      }),
      providesTags: ["Posts"],
    }),

    // Get user's bookmarks
    getUserBookmarks: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/users/me/bookmarks",
        params: { page, limit },
      }),
      providesTags: ["Posts"],
    }),

    // Toggle bookmark
    toggleBookmark: builder.mutation({
      query: (postId) => ({
        url: `/users/me/bookmark/${postId}`,
        method: "POST",
      }),
      invalidatesTags: ["Posts", "User"],
    }),

    // Get user stats
    getUserStats: builder.query({
      query: () => "/users/me/stats",
      providesTags: ["User"],
    }),

    // Follow user
    followUser: builder.mutation({
      query: (userId) => ({
        url: `/users/me/follow/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Unfollow user
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `/users/me/unfollow/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Get followers
    getFollowers: builder.query({
      query: (userId) => `/users/${userId}/followers`,
      providesTags: ["User"],
    }),

    // Get following
    getFollowing: builder.query({
      query: (userId) => `/users/${userId}/following`,
      providesTags: ["User"],
    }),

    // Check if following
    checkFollowing: builder.query({
      query: (userId) => `/users/me/check-follow/${userId}`,
      providesTags: ["User"],
    }),

    // Update profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/me/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAuthorProfileQuery,
  useGetUserProfileQuery,
  useGetMyProfileQuery,
  useGetUserPostsQuery,
  useGetUserLikedPostsQuery,
  useGetUserBookmarksQuery,
  useToggleBookmarkMutation,
  useGetUserStatsQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useCheckFollowingQuery,
  useUpdateProfileMutation,
} = usersAPI;
