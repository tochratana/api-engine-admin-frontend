import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Rating {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
  };
  rating: number;
  comment: string;
  sentiment: "positive" | "neutral" | "negative";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  respondedAt?: string;
  adminResponse?: string;
}

interface RatingsResponse {
  ratings: Rating[];
  totalPages: number;
  totalRatings: number;
  currentPage: number;
}

interface FetchRatingsParams {
  page?: number;
  search?: string;
  rating?: string;
  sentiment?: string;
  status?: string;
  limit?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.api-ngin.oudom.dev/api";

export const ratingsApi = createApi({
  reducerPath: "ratingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      headers.set("content-type", "application/json");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Rating", "UserReviews"],
  endpoints: (builder) => ({
    // Fetch all ratings with filtering and pagination
    fetchRatings: builder.query<RatingsResponse, FetchRatingsParams>({
      query: ({ page = 1, search, rating, sentiment, status, limit = 10 }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search && search !== "") params.append("search", search);
        if (rating && rating !== "all") params.append("rating", rating);
        if (sentiment && sentiment !== "all")
          params.append("sentiment", sentiment);
        if (status && status !== "all") params.append("status", status);

        return `/ratings?${params.toString()}`;
      },
      providesTags: ["Rating"],
    }),

    // Fetch ratings by project
    fetchRatingsByProject: builder.query<Rating[], string>({
      query: (projectId) => `/ratings/project/${projectId}`,
      providesTags: ["Rating"],
    }),

    // Fetch reviews by username
    fetchReviewsByUsername: builder.query<Rating[], string>({
      query: (username) => `/ratings/user/${encodeURIComponent(username)}`,
      providesTags: ["UserReviews"],
    }),

    // Create rating
    createRating: builder.mutation<Rating, Partial<Rating>>({
      query: (ratingData) => ({
        url: "/ratings",
        method: "POST",
        body: ratingData,
      }),
      invalidatesTags: ["Rating"],
    }),

    // Update rating (for admin responses)
    updateRating: builder.mutation<
      Rating,
      { id: string; data: Partial<Rating> }
    >({
      query: ({ id, data }) => ({
        url: `/ratings/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Rating"],
    }),

    // Delete rating
    deleteRating: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ratings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rating", "UserReviews"],
    }),

    // Approve rating
    approveRating: builder.mutation<Rating, string>({
      query: (id) => ({
        url: `/ratings/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Rating"],
    }),

    // Reject rating
    rejectRating: builder.mutation<Rating, string>({
      query: (id) => ({
        url: `/ratings/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Rating"],
    }),
  }),
});

export const {
  useFetchRatingsQuery,
  useFetchRatingsByProjectQuery,
  useFetchReviewsByUsernameQuery,
  useLazyFetchReviewsByUsernameQuery,
  useCreateRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useApproveRatingMutation,
  useRejectRatingMutation,
} = ratingsApi;
