import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  id: number | null;
  keycloakUserId: string;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  enabled: boolean;
  createdTimestamp: string;
  roles: string[];
  realmRoles: string[];
  clientRoles: string[];
  displayName: string | null;
  profileImage: string | null;
  preferences: any;
  lastLogin: string | null;
  status: string | null;
}

interface PaginatedUsersResponse {
  content?: User[];
  users?: User[];
  totalElements?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

interface PaginatedUsersParams {
  page: number;
  size?: number;
  search?: string;
}

interface RoleParams {
  keycloakUserId: string;
  roleName: string;
}

interface UpdateUserParams {
  keycloakUserId: string;
  userData: Partial<User>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.api-ngin.oudom.dev/api";

export const usersApi = createApi({
  reducerPath: "usersApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Fetch all users
    fetchUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      providesTags: ["User"],
    }),

    // Fetch users with pagination
    fetchUsersPaginated: builder.query<
      PaginatedUsersResponse,
      PaginatedUsersParams
    >({
      query: ({ page, size = 10, search }) => {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
          ...(search && { search }),
        });
        return `/admin/users/paginated?${queryParams}`;
      },
      providesTags: ["User"],
    }),

    // Delete user
    deleteUser: builder.mutation<void, string>({
      query: (keycloakUserId) => ({
        url: `/admin/users/${keycloakUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Add role to user
    addRoleToUser: builder.mutation<void, RoleParams>({
      query: ({ keycloakUserId, roleName }) => ({
        url: `/admin/users/${keycloakUserId}/roles/${roleName}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Remove role from user
    removeRoleFromUser: builder.mutation<void, RoleParams>({
      query: ({ keycloakUserId, roleName }) => ({
        url: `/admin/users/${keycloakUserId}/roles/${roleName}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Update user
    updateUser: builder.mutation<User, UpdateUserParams>({
      query: ({ keycloakUserId, userData }) => ({
        url: "/admin/users",
        method: "PUT",
        body: {
          keycloakUserId,
          ...userData,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useFetchUsersPaginatedQuery,
  useDeleteUserMutation,
  useAddRoleToUserMutation,
  useRemoveRoleFromUserMutation,
  useUpdateUserMutation,
} = usersApi;
