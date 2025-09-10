import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "completed";
  owner: {
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  storageUsed?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.api-ngin.oudom.dev/api";

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
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    // Fetch all projects
    fetchProjects: builder.query<Project[], void>({
      query: () => "/projects",
      providesTags: ["Project"],
    }),

    // Create project
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (projectData) => ({
        url: "/projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Project"],
    }),

    // Update project
    updateProject: builder.mutation<
      Project,
      { id: string; data: Partial<Project> }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),

    // Delete project
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    // Get project with user
    getProjectWithUser: builder.query<void, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/with-user`,
        method: "GET",
      }),
      // invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useFetchProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectWithUserQuery
} = projectsApi;
