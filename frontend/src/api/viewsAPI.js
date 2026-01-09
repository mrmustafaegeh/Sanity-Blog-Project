// frontend/src/api/viewsAPI.js
import { apiSlice } from "../store/apiSlice";

export const viewsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Increment view count
    incrementView: builder.mutation({
      query: (postId) => ({
        url: `/views/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const { useIncrementViewMutation } = viewsAPI;
