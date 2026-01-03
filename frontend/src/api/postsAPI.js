// frontend/src/api/postsAPI.js (or features/posts/postsAPI.js)
import { apiSlice } from "../store/apiSlice";

export const postsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all posts with pagination
    getPosts: builder.query({
      query: ({ page = 1, limit = 10, category, sort = "newest" } = {}) => {
        let url = `/posts?page=${page}&limit=${limit}&sort=${sort}`;
        if (category) url += `&category=${category}`;
        return url;
      },
      transformResponse: (response) => {
        console.log("✅ getPosts response:", response);
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    // Get single post by slug
    getPostBySlug: builder.query({
      query: (slug) => `/posts/${slug}`,
      transformResponse: (response) => {
        console.log("✅ getPostBySlug response:", response);
        return response;
      },
      providesTags: (result) =>
        result?._id ? [{ type: "Post", id: result._id }] : [],
    }),

    // Search posts
    searchPosts: builder.query({
      query: (q) => `/search?q=${encodeURIComponent(q)}`,
      transformResponse: (response) => {
        console.log("✅ searchPosts response:", response);
        return response.posts || [];
      },
      // Cache search results separately
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Search", id: "LIST" },
            ]
          : [{ type: "Search", id: "LIST" }],
    }),

    // Get recent posts
    getRecentPosts: builder.query({
      query: (limit = 3) => `/posts/recent?limit=${limit}`,
      transformResponse: (response) => {
        console.log("✅ getRecentPosts response:", response);
        return response.posts || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Recent", id: "LIST" },
            ]
          : [{ type: "Recent", id: "LIST" }],
    }),

    // Get categories
    getCategories: builder.query({
      query: () => `/categories`,
      transformResponse: (response) => {
        console.log("✅ getCategories response:", response);
        return response.categories || [];
      },
      providesTags: ["Categories"],
    }),

    // Get related posts (NEW)
    getRelatedPosts: builder.query({
      query: ({ excludeId, categoryIds = [], limit = 3 }) => {
        const params = new URLSearchParams({
          excludeId,
          limit,
        });

        if (categoryIds.length > 0) {
          params.append("categories", categoryIds.join(","));
        }

        return `/posts/related?${params.toString()}`;
      },
      transformResponse: (response) => {
        console.log("✅ getRelatedPosts response:", response);
        return response.posts || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Related", id: "LIST" },
            ]
          : [{ type: "Related", id: "LIST" }],
    }),

    // Get posts by category (NEW)
    getPostsByCategory: builder.query({
      query: ({ categoryId, page = 1, limit = 10 }) =>
        `/posts/category/${categoryId}?page=${page}&limit=${limit}`,
      transformResponse: (response) => {
        console.log("✅ getPostsByCategory response:", response);
        return response;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "CategoryPosts", id: arg.categoryId },
            ]
          : [{ type: "CategoryPosts", id: arg?.categoryId }],
    }),

    // Get featured posts (NEW)
    getFeaturedPosts: builder.query({
      query: (limit = 1) => `/posts/featured?limit=${limit}`,
      transformResponse: (response) => {
        console.log("✅ getFeaturedPosts response:", response);
        return response.posts || [];
      },
      providesTags: ["Featured"],
    }),

    // Get popular posts (NEW)
    getPopularPosts: builder.query({
      query: (limit = 5) => `/posts/popular?limit=${limit}`,
      transformResponse: (response) => {
        console.log("✅ getPopularPosts response:", response);
        return response.posts || [];
      },
      providesTags: ["Popular"],
    }),

    // Get posts by author (NEW)
    getPostsByAuthor: builder.query({
      query: ({ authorId, page = 1, limit = 10 }) =>
        `/posts/author/${authorId}?page=${page}&limit=${limit}`,
      transformResponse: (response) => {
        console.log("✅ getPostsByAuthor response:", response);
        return response;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "AuthorPosts", id: arg.authorId },
            ]
          : [{ type: "AuthorPosts", id: arg?.authorId }],
    }),

    // Create new post (NEW - for admin)
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Posts", "Recent", "Featured"],
    }),

    // Update post (NEW - for admin)
    updatePost: builder.mutation({
      query: ({ id, ...postData }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.id },
        "Posts",
        "Recent",
        "Featured",
      ],
    }),

    // Delete post (NEW - for admin)
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "Recent", "Featured"],
    }),

    // Increment view count (NEW)
    incrementViewCount: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/views`,
        method: "POST",
      }),
      // Don't invalidate cache, just update view count in background
    }),
    // ❤️ LIKE / UNLIKE
    toggleLike: builder.mutation({
      query: (postId) => ({
        url: `/likes/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostBySlugQuery,
  useSearchPostsQuery,
  useGetRecentPostsQuery,
  useGetCategoriesQuery,
  useGetRelatedPostsQuery,
  useGetPostsByCategoryQuery,
  useGetFeaturedPostsQuery,
  useGetPopularPostsQuery,
  useGetPostsByAuthorQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useIncrementViewCountMutation,
  useToggleLikeMutation,
} = postsAPI;
