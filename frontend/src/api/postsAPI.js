// frontend/src/api/postsAPI.js
import { apiSlice } from "../store/apiSlice";

export const postsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all posts with pagination and filters
    getPosts: builder.query({
      query: ({ page = 1, limit = 10, category, sort = "newest", search }) => ({
        url: "/posts",
        params: { page, limit, category, sort, search },
      }),
      transformResponse: (response) => {
        // Handle paginated response
        if (response && response.posts) {
          return {
            posts: response.posts,
            pagination: response.pagination,
          };
        }
        // If response is already an array, wrap it
        if (Array.isArray(response)) {
          return { posts: response, pagination: null };
        }
        return { posts: [], pagination: null };
      },
      providesTags: ["Posts"],
    }),

    // Get post by slug
    getPostBySlug: builder.query({
      query: (slug) => `/posts/slug/${slug}`,
      transformResponse: (response) => response.post,
      providesTags: (result, error, slug) => [{ type: "Post", id: slug }],
    }),

    // Get recent posts
    getRecentPosts: builder.query({
      query: (limit = 6) => `/posts/recent?limit=${limit}`,
      transformResponse: (response) => {
        // Extract array from response
        if (response && response.posts) {
          return response.posts;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: ["Posts"],
    }),

    // Get featured posts
    getFeaturedPosts: builder.query({
      query: () => "/posts/featured",
      transformResponse: (response) => {
        // Extract array from response
        if (response && response.posts) {
          return response.posts;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: ["Posts"],
    }),

    // Get popular posts
    getPopularPosts: builder.query({
      query: (limit = 3) => `/posts/popular?limit=${limit}`,
      transformResponse: (response) => {
        // Extract array from response
        if (response && response.posts) {
          return response.posts;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: ["Posts"],
    }),

    // Get related posts
    getRelatedPosts: builder.query({
      query: ({ postId, limit = 3 }) =>
        `/posts/related/${postId}?limit=${limit}`,
      transformResponse: (response) => {
        // Extract array from response
        if (response && response.posts) {
          return response.posts;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: ["Posts"],
    }),

    // Get categories
    getCategories: builder.query({
      query: ({ page = 1, limit = 8 } = {}) => ({
        url: "/categories",
        params: { page, limit },
      }),
      transformResponse: (response) => {
        // Extract array from response
        if (response && response.categories) {
          return response.categories;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: ["Categories"],
    }),

    // Get category by slug
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Category", id: slug }],
    }),

    // Increment view count
    incrementViewCount: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/view`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Post", id: postId },
      ],
    }),

    // Create post
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Posts", "Submission"],
    }),

    // Update post
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),

    // Delete post
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),

    toggleLike: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),

    // Search posts
    searchPosts: builder.query({
      query: ({ q, page = 1, limit = 10 }) => ({
        url: "/search",
        params: { q, page, limit },
      }),
      transformResponse: (response) => {
        // Handle search results
        if (response && response.posts) {
          return {
            posts: response.posts,
            pagination: response.pagination,
          };
        }
        if (Array.isArray(response)) {
          return { posts: response, pagination: null };
        }
        return { posts: [], pagination: null };
      },
      providesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostBySlugQuery,
  useGetRecentPostsQuery,
  useGetFeaturedPostsQuery,
  useGetPopularPostsQuery,
  useGetRelatedPostsQuery,
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useIncrementViewCountMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useSearchPostsQuery,
  useToggleLikeMutation,
} = postsAPI;
