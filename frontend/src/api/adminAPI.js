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
      query: ({ id, token }) => ({
        url: `/posts/${id}/summary`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useGetAdminTokenMutation,
  useGetAdminAnalyticsQuery,
  useRegenerateSummaryMutation,
} = adminAPI;
