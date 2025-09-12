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

interface Project {
  id: string;
  name: string;
  description: string;
  owner: Owner;
  status: "active" | "inactive" | "completed" | "archived";
  type: "web" | "mobile" | "api" | "database";
  createdAt: string;
  updatedAt: string;
  storageUsed: number;
  apiCalls: number;
}

interface AdminProjectDetailResponse extends Project {
  // Add any additional fields that might be in the detail response
  additionalDetails?: any;
}

interface AdminProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalStorage: number;
  // Add other statistics fields as needed
}

interface FetchProjectsParams {
  page?: number;
  search?: string;
  status?: string;
  type?: string;
}

interface ProjectsResponse {
  projects: Project[];
  totalPages: number;
  total: number;
  currentPage: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/admin";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
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
  tagTypes: ["Project", "ProjectStatistics"],
  endpoints: (builder) => ({
    // GET /api/v1/admin/projects - Get all projects
    fetchProjects: builder.query<ProjectsResponse, FetchProjectsParams>({
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
      transformResponse: (response: ApiResponse<Project[]>) => {
        // Transform the backend response to match frontend expectations
        return {
          projects: response.data,
          totalPages: 1, // You'll need to update backend to return pagination info
          total: response.data.length,
          currentPage: 1,
        };
      },
      providesTags: ["Project"],
    }),

    // For search functionality - GET /api/v1/admin/projects/search?q=searchTerm
    searchProjects: builder.query<Project[], string>({
      query: (searchTerm) =>
        `/projects/search?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response: ApiResponse<Project[]>) => response.data,
      providesTags: ["Project"],
    }),

    // GET /api/v1/admin/projects/{projectUuid} - Get project detail
    getProjectWithUser: builder.query<AdminProjectDetailResponse, string>({
      query: (projectUuid) => `/projects/${projectUuid}`,
      transformResponse: (response: ApiResponse<AdminProjectDetailResponse>) =>
        response.data,
      providesTags: (_result, _error, projectUuid) => [
        { type: "Project", id: projectUuid },
      ],
    }),

    // GET /api/v1/admin/projects/statistics - Get project statistics
    getProjectStatistics: builder.query<AdminProjectStatistics, void>({
      query: () => "/projects/statistics",
      transformResponse: (response: ApiResponse<AdminProjectStatistics>) =>
        response.data,
      providesTags: ["ProjectStatistics"],
    }),

    // GET /api/v1/admin/projects/by-user/{userUuid} - Get projects by user
    getProjectsByUser: builder.query<Project[], string>({
      query: (userUuid) => `/projects/by-user/${userUuid}`,
      transformResponse: (response: ApiResponse<Project[]>) => response.data,
      providesTags: ["Project"],
    }),

    // GET /api/v1/admin/projects/with-usage - Get projects with usage data
    getProjectsWithUsage: builder.query<Project[], void>({
      query: () => "/projects/with-usage",
      transformResponse: (response: ApiResponse<Project[]>) => response.data,
      providesTags: ["Project"],
    }),

    // DELETE /api/v1/admin/projects/{projectUuid} - Delete project
    deleteProject: builder.mutation<void, string>({
      query: (projectUuid) => ({
        url: `/projects/${projectUuid}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
      invalidatesTags: ["Project", "ProjectStatistics"],
    }),

    // POST /api/v1/admin/projects/{projectUuid}/refresh-storage - Refresh project storage
    refreshProjectStorage: builder.mutation<AdminProjectDetailResponse, string>(
      {
        query: (projectUuid) => ({
          url: `/projects/${projectUuid}/refresh-storage`,
          method: "POST",
        }),
        transformResponse: (
          response: ApiResponse<AdminProjectDetailResponse>
        ) => response.data,
        invalidatesTags: (_result, _error, projectUuid) => [
          { type: "Project", id: projectUuid },
          "ProjectStatistics",
        ],
      }
    ),

    // POST /api/v1/admin/projects/refresh-all-storage - Bulk refresh storage
    refreshAllProjectsStorage: builder.mutation<void, void>({
      query: () => ({
        url: "/projects/refresh-all-storage",
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<void>) => response.data,
      invalidatesTags: ["Project", "ProjectStatistics"],
    }),

    // Note: Based on your backend controller, there's no CREATE or UPDATE endpoint for projects
    // If you need these, you'll need to add them to your backend controller first

    // Placeholder for create project (you'll need to implement this in backend)
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (projectData) => ({
        url: "/projects",
        method: "POST",
        body: projectData,
      }),
      transformResponse: (response: ApiResponse<Project>) => response.data,
      invalidatesTags: ["Project", "ProjectStatistics"],
    }),

    // Placeholder for update project (you'll need to implement this in backend)
    updateProject: builder.mutation<
      Project,
      { id: string; data: Partial<Project> }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Project>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        "ProjectStatistics",
      ],
    }),
  }),
});

export const {
  useFetchProjectsQuery,
  useSearchProjectsQuery,
  useGetProjectWithUserQuery,
  useGetProjectStatisticsQuery,
  useGetProjectsByUserQuery,
  useGetProjectsWithUsageQuery,
  useDeleteProjectMutation,
  useRefreshProjectStorageMutation,
  useRefreshAllProjectsStorageMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} = projectsApi;
