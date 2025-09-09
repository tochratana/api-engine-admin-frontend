import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface User {
  id: string
  email: string
  name: string
  username?: string
  firstName?: string
  lastName?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { usernameOrEmail: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("[v0] Making API call to login endpoint")

      const response = await fetch("https://api.api-ngin.oudom.dev/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[v0] API error response:", errorData)
        return rejectWithValue(errorData.message || "Login failed")
      }

      const data = await response.json()
      console.log("[v0] API success response:", data)

      const userInfo = {
        id: data.user?.id || data.userId || "unknown",
        email: credentials.usernameOrEmail,
        name: data.user?.name || data.user?.displayName || credentials.usernameOrEmail.split("@")[0],
        username: data.user?.username,
        firstName: data.user?.firstName,
        lastName: data.user?.lastName,
      }

      return {
        ...data,
        user: userInfo,
      }
    } catch (error) {
      console.log("[v0] Network error:", error)
      return rejectWithValue("Network error occurred")
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    },
    clearError: (state) => {
      state.error = null
    },
    setUserFromStorage: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token)
          localStorage.setItem("user", JSON.stringify(action.payload.user))
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, setUserFromStorage } = authSlice.actions
export default authSlice.reducer
