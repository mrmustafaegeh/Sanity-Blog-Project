// frontend/src/api/likesAPI.js
import { apiSlice } from "../store/apiSlice";

export const likesAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Toggle like on post
    toggleLike: builder.mutation({
      query: (postId) => ({
        url: `/likes/post/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const { useToggleLikeMutation } = likesAPI;
