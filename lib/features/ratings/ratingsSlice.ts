import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface Rating {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  project: {
    id: string
    name: string
  }
  rating: number
  comment: string
  sentiment: "positive" | "neutral" | "negative"
  status: "pending" | "approved" | "rejected"
  createdAt: string
  respondedAt?: string
  adminResponse?: string
}

interface RatingsState {
  ratings: Rating[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  ratingFilter: string
  sentimentFilter: string
  statusFilter: string
  currentPage: number
  totalPages: number
  totalRatings: number
}

const initialState: RatingsState = {
  ratings: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  ratingFilter: "all",
  sentimentFilter: "all",
  statusFilter: "all",
  currentPage: 1,
  totalPages: 1,
  totalRatings: 0,
}

const mockRatings: Rating[] = [
  {
    id: "1",
    user: { id: "1", name: "John Doe", email: "john@example.com" },
    project: { id: "1", name: "E-commerce Platform" },
    rating: 5,
    comment: "Excellent platform! Very easy to use and great performance.",
    sentiment: "positive",
    status: "approved",
    createdAt: "2024-01-20T10:30:00Z",
    respondedAt: "2024-01-20T14:15:00Z",
    adminResponse: "Thank you for your positive feedback!",
  },
  {
    id: "2",
    user: { id: "2", name: "Sarah Smith", email: "sarah@example.com" },
    project: { id: "2", name: "Mobile Banking App" },
    rating: 4,
    comment: "Good app overall, but could use some UI improvements.",
    sentiment: "positive",
    status: "approved",
    createdAt: "2024-01-19T15:45:00Z",
    respondedAt: "2024-01-19T16:30:00Z",
    adminResponse: "Thanks for the feedback. UI improvements are in our roadmap.",
  },
  {
    id: "3",
    user: { id: "3", name: "Mike Johnson", email: "mike@example.com" },
    project: { id: "3", name: "Analytics API" },
    rating: 2,
    comment: "API documentation is unclear and response times are slow.",
    sentiment: "negative",
    status: "pending",
    createdAt: "2024-01-18T09:20:00Z",
  },
  {
    id: "4",
    user: { id: "4", name: "Emily Davis", email: "emily@example.com" },
    project: { id: "4", name: "User Database" },
    rating: 3,
    comment: "Average performance, works as expected but nothing special.",
    sentiment: "neutral",
    status: "approved",
    createdAt: "2024-01-17T11:10:00Z",
    respondedAt: "2024-01-17T13:45:00Z",
    adminResponse: "We appreciate your honest feedback and are working on enhancements.",
  },
  {
    id: "5",
    user: { id: "5", name: "Alex Wilson", email: "alex@example.com" },
    project: { id: "1", name: "E-commerce Platform" },
    rating: 1,
    comment: "Terrible experience. The platform crashed multiple times.",
    sentiment: "negative",
    status: "pending",
    createdAt: "2024-01-16T14:25:00Z",
  },
  {
    id: "6",
    user: { id: "6", name: "Lisa Brown", email: "lisa@example.com" },
    project: { id: "2", name: "Mobile Banking App" },
    rating: 5,
    comment: "Amazing security features and very user-friendly interface!",
    sentiment: "positive",
    status: "approved",
    createdAt: "2024-01-15T16:40:00Z",
    respondedAt: "2024-01-15T17:20:00Z",
    adminResponse: "Thank you! Security is our top priority.",
  },
]

export const fetchRatings = createAsyncThunk(
  "ratings/fetchRatings",
  async (
    params: {
      page?: number
      search?: string
      rating?: string
      sentiment?: string
      status?: string
    } = {},
    { rejectWithValue },
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600))

      let filteredRatings = [...mockRatings]

      // Apply filters
      if (params.search) {
        filteredRatings = filteredRatings.filter(
          (rating) =>
            rating.user.name.toLowerCase().includes(params.search!.toLowerCase()) ||
            rating.project.name.toLowerCase().includes(params.search!.toLowerCase()) ||
            rating.comment.toLowerCase().includes(params.search!.toLowerCase()),
        )
      }

      if (params.rating && params.rating !== "all") {
        filteredRatings = filteredRatings.filter((rating) => rating.rating.toString() === params.rating)
      }

      if (params.sentiment && params.sentiment !== "all") {
        filteredRatings = filteredRatings.filter((rating) => rating.sentiment === params.sentiment)
      }

      if (params.status && params.status !== "all") {
        filteredRatings = filteredRatings.filter((rating) => rating.status === params.status)
      }

      // Sort by creation date (newest first)
      filteredRatings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // Simulate pagination
      const page = params.page || 1
      const perPage = 10
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedRatings = filteredRatings.slice(startIndex, endIndex)

      return {
        ratings: paginatedRatings,
        total: filteredRatings.length,
        totalPages: Math.ceil(filteredRatings.length / perPage),
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch ratings")
    }
  },
)

const ratingsSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.currentPage = 1
    },
    setRatingFilter: (state, action) => {
      state.ratingFilter = action.payload
      state.currentPage = 1
    },
    setSentimentFilter: (state, action) => {
      state.sentimentFilter = action.payload
      state.currentPage = 1
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
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
      .addCase(fetchRatings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.isLoading = false
        state.ratings = action.payload.ratings
        state.totalRatings = action.payload.total
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchRatings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSearchTerm, setRatingFilter, setSentimentFilter, setStatusFilter, setCurrentPage, clearError } =
  ratingsSlice.actions
export default ratingsSlice.reducer
