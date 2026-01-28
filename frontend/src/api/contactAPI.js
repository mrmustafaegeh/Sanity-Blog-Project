// frontend/src/api/contactAPI.js
import { apiSlice } from "../store/apiSlice";

export const contactAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new contact message
    createContact: builder.mutation({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data,
      }),
      // No need to invalidate tags unless we want Admin UI to auto-update immediately for the sender (unlikely)
      // But if we are admin and testing, it helps.
      invalidatesTags: ["Contacts"],
    }),

    // Get all contact messages (Admin)
    getContacts: builder.query({
      query: ({ page = 1, limit = 10, read } = {}) => ({
        url: "/contact",
        params: { page, limit, read },
      }),
      providesTags: ["Contacts"],
    }),

    // Delete contact message
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contacts"],
    }),

    // Mark as read
    markContactAsRead: builder.mutation({
      query: (id) => ({
        url: `/contact/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetContactsQuery,
  useDeleteContactMutation,
  useMarkContactAsReadMutation,
} = contactAPI;
