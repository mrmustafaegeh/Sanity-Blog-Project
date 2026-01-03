import { apiSlice } from "../store/apiSlice";

export const adminAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminToken: builder.mutation({
      query: (apiKey) => ({
        url: "/admin/token",
        method: "POST",
        headers: {
          "x-admin-key": apiKey,
        },
      }),
    }),

    regenerateSummary: builder.mutation({
      query: ({ id, token }) => ({
        url: `/posts/${id}/summary`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "Post", id }, "Posts"],
    }),
  }),
});

export const { useGetAdminTokenMutation, useRegenerateSummaryMutation } =
  adminAPI;
