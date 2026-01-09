// frontend/src/api/commentsAPI.js
import { apiSlice } from "../store/apiSlice";

export const commentsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (postId) => `/comments/post/${postId}`,
      providesTags: (result, error, postId) => [
        { type: "Comments", id: postId },
      ],
    }),

    addComment: builder.mutation({
      query: ({ postId, content, parentCommentId }) => ({
        url: `/comments/post/${postId}`,
        method: "POST",
        body: { content, parentCommentId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: postId },
      ],
    }),

    updateComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: (result, error, { id }) => ["Comments"],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),

    likeComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = commentsAPI;
