// frontend/src/api/submissionsAPI.js
import { apiSlice } from "../store/apiSlice";

export const submissionsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit post for review
    submitPost: builder.mutation({
      query: (postData) => ({
        url: "/submissions",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["UserSubmissions"],
    }),

    // Get user's submissions
    getUserSubmissions: builder.query({
      query: ({ page = 1, limit = 10, status } = {}) => ({
        url: "/submissions/user",
        params: { page, limit, status },
      }),
      transformResponse: (response) => {
        // Extract array from response
        if (response && response.submissions) {
          return response.submissions;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: ["UserSubmissions"],
    }),

    // Get pending submissions (admin only)
    getPendingSubmissions: builder.query({
      query: () => "/submissions/admin/pending",
      transformResponse: (response) => {
        // Extract array from response
        if (response && response.submissions) {
          return response.submissions;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: ["PendingSubmissions"],
    }),

    // Get single submission by ID
    getSubmissionById: builder.query({
      query: (id) => `/submissions/${id}`,
      providesTags: (result, error, id) => [{ type: "Submission", id }],
    }),

    // Update submission
    updateSubmission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/submissions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserSubmissions", "Submission"],
    }),

    // Delete submission
    deleteSubmission: builder.mutation({
      query: (id) => ({
        url: `/submissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserSubmissions"],
    }),

    // Approve submission (admin only)
    approveSubmission: builder.mutation({
      query: (id) => ({
        url: `/submissions/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["PendingSubmissions", "Posts", "UserSubmissions"],
    }),

    // Reject submission (admin only)
    rejectSubmission: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/submissions/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["PendingSubmissions", "UserSubmissions"],
    }),
  }),
});

export const {
  useSubmitPostMutation,
  useGetUserSubmissionsQuery,
  useGetPendingSubmissionsQuery,
  useGetSubmissionByIdQuery,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
} = submissionsAPI;
