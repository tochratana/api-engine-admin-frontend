import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Updated Rating interface to match your API response
interface Rating {
  id: number; // Changed from string to number
  username: string; // Your API uses 'username' instead of nested user object
  content: string; // Your API uses 'content' instead of 'comment'
  star: number; // Your API uses 'star' instead of 'rating'
  // Optional fields that might come from other endpoints
  user?: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
  };
  sentiment?: "positive" | "neutral" | "negative";
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
  respondedAt?: string;
  adminResponse?: string;
}

// Updated to match your API's paginated response structure
interface ApiPaginatedResponse {
  content: Rating[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// Transform the API response to match what your component expects
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
  size?: number; // Changed from 'limit' to 'size' to match your API
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
      query: ({ page = 1, search, rating, sentiment, status, size = 10 }) => {
        const params = new URLSearchParams({
          page: (page - 1).toString(), // Convert to 0-based pagination
          size: size.toString(),
          sortBy: "id",
          sortDir: "desc",
        });

        if (search && search !== "") params.append("search", search);
        if (rating && rating !== "all") params.append("rating", rating);
        if (sentiment && sentiment !== "all")
          params.append("sentiment", sentiment);
        if (status && status !== "all") params.append("status", status);

        return `/reviews?${params.toString()}`;
      },
      transformResponse: (response: ApiPaginatedResponse): RatingsResponse => {
        // Transform the API response to match what your component expects
        const transformedRatings = response.content.map((item) => ({
          ...item,
          // Map API fields to component expected fields
          rating: item.star,
          comment: item.content,
          // Create mock user and project objects if they don't exist
          user: item.user || {
            id: item.id.toString(),
            name: item.username,
            email: `${item.username}@example.com`,
          },
          project: item.project || {
            id: "1",
            name: "Default Project",
          },
          // Set default values for missing fields
          sentiment: item.sentiment || "neutral",
          status: item.status || "approved",
          createdAt: item.createdAt || new Date().toISOString(),
        }));

        return {
          ratings: transformedRatings,
          totalPages: response.totalPages,
          totalRatings: response.totalElements,
          currentPage: response.number + 1, // Convert back to 1-based pagination
        };
      },
      providesTags: ["Rating"],
    }),

    // NEW: Fetch reviews by star rating
    fetchReviewsByStar: builder.query<
      RatingsResponse,
      { star: number; page?: number; size?: number }
    >({
      query: ({ star, page = 1, size = 10 }) => {
        const params = new URLSearchParams({
          page: (page - 1).toString(),
          size: size.toString(),
          sortBy: "id",
          sortDir: "desc",
        });

        return `/reviews/star/${star}?${params.toString()}`;
      },
      transformResponse: (response: ApiPaginatedResponse): RatingsResponse => {
        const transformedRatings = response.content.map((item) => ({
          ...item,
          rating: item.star,
          comment: item.content,
          user: item.user || {
            id: item.id.toString(),
            name: item.username,
            email: `${item.username}@example.com`,
          },
          project: item.project || {
            id: "1",
            name: "Default Project",
          },
          sentiment: item.sentiment || "neutral",
          status: item.status || "approved",
          createdAt: item.createdAt || new Date().toISOString(),
        }));

        return {
          ratings: transformedRatings,
          totalPages: response.totalPages,
          totalRatings: response.totalElements,
          currentPage: response.number + 1,
        };
      },
      providesTags: ["Rating"],
    }),

    // Fetch ratings by project
    fetchRatingsByProject: builder.query<Rating[], string>({
      query: (projectId) => `/reviews/project/${projectId}`,
      providesTags: ["Rating"],
    }),

    // Fetch reviews by username
    fetchReviewsByUsername: builder.query<Rating[], string>({
      query: (username) => `/reviews/user/${encodeURIComponent(username)}`,
      transformResponse: (response: Rating[] | ApiPaginatedResponse) => {
        // Handle both direct array response and paginated response
        let reviews: Rating[] = [];

        if (Array.isArray(response)) {
          reviews = response;
        } else if (
          response &&
          typeof response === "object" &&
          "content" in response
        ) {
          reviews = response.content || [];
        } else {
          // If response is not in expected format, return empty array
          console.warn(
            "Unexpected response format for fetchReviewsByUsername:",
            response
          );
          reviews = [];
        }

        return reviews.map((item) => ({
          ...item,
          rating: item.star,
          comment: item.content,
          user: item.user || {
            id: item.id.toString(),
            name: item.username,
            email: `${item.username}@example.com`,
          },
          project: item.project || {
            id: "1",
            name: "Default Project",
          },
          sentiment: item.sentiment || "neutral",
          status: item.status || "approved",
          createdAt: item.createdAt || new Date().toISOString(),
        }));
      },
      providesTags: ["UserReviews"],
    }),

    // Create rating
    createRating: builder.mutation<Rating, Partial<Rating>>({
      query: (ratingData) => ({
        url: "/reviews",
        method: "POST",
        body: {
          ...ratingData,
          star: ratingData.rating, // Transform rating to star
          content: ratingData.comment, // Transform comment to content
        },
      }),
      invalidatesTags: ["Rating"],
    }),

    // Update rating (for admin responses)
    updateRating: builder.mutation<
      Rating,
      { id: string | number; data: Partial<Rating> }
    >({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: {
          ...data,
          star: data.rating, // Transform rating to star
          content: data.comment, // Transform comment to content
        },
      }),
      invalidatesTags: ["Rating"],
    }),

    // Delete rating
    deleteRating: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rating", "UserReviews"],
    }),

    // Approve rating
    approveRating: builder.mutation<Rating, string | number>({
      query: (id) => ({
        url: `/reviews/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Rating"],
    }),

    // Reject rating
    rejectRating: builder.mutation<Rating, string | number>({
      query: (id) => ({
        url: `/reviews/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Rating"],
    }),
  }),
});

export const {
  useFetchRatingsQuery,
  useFetchReviewsByStarQuery,
  useLazyFetchReviewsByStarQuery,
  useFetchRatingsByProjectQuery,
  useFetchReviewsByUsernameQuery,
  useLazyFetchReviewsByUsernameQuery,
  useCreateRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useApproveRatingMutation,
  useRejectRatingMutation,
} = ratingsApi;
