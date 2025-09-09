import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiRequest } from "@/lib/api"

interface User {
  id: number | null
  keycloakUserId: string
  username: string
  email: string
  emailVerified: boolean
  firstName: string
  lastName: string
  enabled: boolean
  createdTimestamp: string
  roles: string[]
  realmRoles: string[]
  clientRoles: string[]
  displayName: string | null
  profileImage: string | null
  preferences: any
  lastLogin: string | null
  status: string | null
}

interface UsersState {
  users: User[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  currentPage: number
  totalPages: number
  totalUsers: number
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
}

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params: { page?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      console.log("[v0] Fetching users from API")

      const data = await apiRequest("/admin/users")
      console.log("[v0] Users API response:", data)

      return {
        users: data, // API returns array directly
        total: data.length,
        totalPages: Math.ceil(data.length / 10),
      }
    } catch (error) {
      console.log("[v0] Users API error:", error)
      return rejectWithValue("Failed to fetch users")
    }
  },
)

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload.users || []
        state.totalUsers = action.payload.total || 0
        state.totalPages = action.payload.totalPages || 1
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSearchTerm, setCurrentPage, clearError } = usersSlice.actions
export default usersSlice.reducer
