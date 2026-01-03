import { apiSlice } from "../store/apiSlice";

export const commentsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (postId) => `/comments/${postId}`,
      providesTags: ["Comments"],
    }),

    addComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/comments/${postId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = commentsAPI;
