import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Updated interfaces to match backend response structure
interface ApiResponse<T> {
  message: string;
  data: T;
}

interface Owner {
  id: string;
  name: string;
  email: string;
}

interface UsageCurrent {
  id: string;
  projectId: string;
  postgresBytes: number;
  mongoBytes: number;
  restRequestsTotal: number;
  restRead: number;
  restWrite: number;
  authRequests: number;
  errorCount: number;
  totalLatencyMs: number;
  samples: number;
  updatedAt: string;
}

interface StorageProject {
  projectUuid: string;
  projectName: string;
  description: string;
  ownerUserUuid: string;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
  usageCurrent?: UsageCurrent;
  totalApiCalls: number;
  totalStorageUsed: number;
  lastActivityAt: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "ARCHIVED";
  hasUsageData: boolean;
}

interface StorageProjectDetailResponse extends StorageProject {
  additionalDetails?: any;
}

interface StorageStatistics {
  totalProjects: number;
  uniqueUsers: number;
  recentProjects: number;
  activeProjects: number;
  totalStorageUsed: number;
  totalApiCallsToday: number;
  projectsWithUsageData: number;
  projectsWithoutUsageData: number;
  averageProjectsPerUser: number;
}

interface FetchStorageParams {
  page?: number;
  search?: string;
  status?: string;
  type?: string;
}

interface StorageResponse {
  projects: StorageProject[];
  totalPages: number;
  total: number;
  currentPage: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL_ADMIN;

export const storageApi = createApi({
  reducerPath: "storageApi",
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
  tagTypes: ["Storage", "StorageStatistics"],
  endpoints: (builder) => ({
    // GET /api/v1/admin/projects - Get all projects for storage management
    fetchStorageData: builder.query<StorageResponse, FetchStorageParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        // Add query parameters if they exist
        if (params.search) searchParams.append("q", params.search);
        if (params.status && params.status !== "all")
          searchParams.append("status", params.status);
        if (params.type && params.type !== "all")
          searchParams.append("type", params.type);
        if (params.page)
          searchParams.append("page", (params.page - 1).toString()); // Backend likely uses 0-based indexing

        const queryString = searchParams.toString();
        return `/projects${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (response: ApiResponse<StorageProject[]>) => {
        // Transform the backend response to match frontend expectations
        return {
          projects: response.data,
          totalPages: Math.ceil(response.data.length / 10), // Assuming 10 items per page
          total: response.data.length,
          currentPage: 1,
        };
      },
      providesTags: ["Storage"],
    }),

    // For search functionality - GET /api/v1/admin/projects/search?q=searchTerm
    searchStorageItems: builder.query<StorageProject[], string>({
      query: (searchTerm) =>
        `/projects/search?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response: ApiResponse<StorageProject[]>) =>
        response.data,
      providesTags: ["Storage"],
    }),

    // GET /api/v1/admin/projects/{projectUuid} - Get project detail for storage view
    getStorageItemByUuid: builder.query<StorageProjectDetailResponse, string>({
      query: (projectUuid) => `/projects/${projectUuid}`,
      transformResponse: (
        response: ApiResponse<StorageProjectDetailResponse>
      ) => response.data,
      providesTags: (_result, _error, projectUuid) => [
        { type: "Storage", id: projectUuid },
      ],
    }),

    // GET /api/v1/admin/projects/statistics - Get storage statistics
    getStorageStatistics: builder.query<StorageStatistics, void>({
      query: () => "/projects/statistics",
      transformResponse: (response: ApiResponse<StorageStatistics>) =>
        response.data,
      providesTags: ["StorageStatistics"],
    }),

    // GET /api/v1/admin/projects/by-user/{userUuid} - Get storage items by user
    getStorageByUser: builder.query<StorageProject[], string>({
      query: (userUuid) => `/projects/by-user/${userUuid}`,
      transformResponse: (response: ApiResponse<StorageProject[]>) =>
        response.data,
      providesTags: ["Storage"],
    }),

    // GET /api/v1/admin/projects/with-usage - Get projects with usage data
    getStorageWithUsage: builder.query<StorageProject[], void>({
      query: () => "/projects/with-usage",
      transformResponse: (response: ApiResponse<StorageProject[]>) =>
        response.data,
      providesTags: ["Storage"],
    }),

    // DELETE /api/v1/admin/projects/{projectUuid} - Delete storage item
    deleteStorageItem: builder.mutation<void, string>({
      query: (projectUuid) => ({
        url: `/projects/${projectUuid}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
      invalidatesTags: ["Storage", "StorageStatistics"],
    }),

    // POST /api/v1/admin/projects/{projectUuid}/refresh-storage - Refresh project storage
    refreshStorageItem: builder.mutation<StorageProjectDetailResponse, string>({
      query: (projectUuid) => ({
        url: `/projects/${projectUuid}/refresh-storage`,
        method: "POST",
      }),
      transformResponse: (
        response: ApiResponse<StorageProjectDetailResponse>
      ) => response.data,
      invalidatesTags: (_result, _error, projectUuid) => [
        { type: "Storage", id: projectUuid },
        "StorageStatistics",
      ],
    }),

    // POST /api/v1/admin/projects/refresh-all-storage - Bulk refresh storage
    refreshAllStorage: builder.mutation<void, void>({
      query: () => ({
        url: "/projects/refresh-all-storage",
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
      invalidatesTags: ["Storage", "StorageStatistics"],
    }),

    // Archive/Activate storage item (PUT /api/v1/admin/projects/{projectUuid}/status)
    archiveStorageItem: builder.mutation<
      StorageProjectDetailResponse,
      { uuid: string; status: string }
    >({
      query: ({ uuid, status }) => ({
        url: `/projects/${uuid}/status`,
        method: "PUT",
        body: { status },
      }),
      transformResponse: (
        response: ApiResponse<StorageProjectDetailResponse>
      ) => response.data,
      invalidatesTags: (_result, _error, { uuid }) => [
        { type: "Storage", id: uuid },
        "StorageStatistics",
      ],
    }),

    // Bulk cleanup storage items (POST /api/v1/admin/projects/cleanup)
    cleanupStorageItems: builder.mutation<void, string[]>({
      query: (projectUuids) => ({
        url: "/projects/cleanup",
        method: "POST",
        body: { projectUuids },
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
      invalidatesTags: ["Storage", "StorageStatistics"],
    }),

    // Get storage usage analytics (GET /api/v1/admin/projects/analytics)
    getStorageAnalytics: builder.query<any, void>({
      query: () => "/projects/analytics",
      transformResponse: (response: ApiResponse<any>) => response.data,
      providesTags: ["StorageStatistics"],
    }),

    // Get low storage projects (GET /api/v1/admin/projects/low-storage)
    getLowStorageProjects: builder.query<StorageProject[], void>({
      query: () => "/projects/low-storage",
      transformResponse: (response: ApiResponse<StorageProject[]>) =>
        response.data,
      providesTags: ["Storage"],
    }),

    // Get high storage projects (GET /api/v1/admin/projects/high-storage)
    getHighStorageProjects: builder.query<StorageProject[], void>({
      query: () => "/projects/high-storage",
      transformResponse: (response: ApiResponse<StorageProject[]>) =>
        response.data,
      providesTags: ["Storage"],
    }),
  }),
});

export const {
  useFetchStorageDataQuery,
  useSearchStorageItemsQuery,
  useGetStorageItemByUuidQuery,
  useGetStorageStatisticsQuery,
  useGetStorageByUserQuery,
  useGetStorageWithUsageQuery,
  useDeleteStorageItemMutation,
  useRefreshStorageItemMutation,
  useRefreshAllStorageMutation,
  useArchiveStorageItemMutation,
  useCleanupStorageItemsMutation,
  useGetStorageAnalyticsQuery,
  useGetLowStorageProjectsQuery,
  useGetHighStorageProjectsQuery,
} = storageApi;
