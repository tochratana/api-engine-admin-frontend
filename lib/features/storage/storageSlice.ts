import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface StorageItem {
  id: string
  name: string
  type: "project" | "user" | "system"
  owner: {
    id: string
    name: string
    email: string
  }
  size: number // in GB
  quota: number // in GB
  files: number
  lastAccessed: string
  createdAt: string
  status: "active" | "archived" | "cleanup_pending"
}

interface StorageStats {
  totalUsed: number
  totalQuota: number
  totalFiles: number
  activeProjects: number
  archivedProjects: number
  cleanupPending: number
}

interface StorageState {
  items: StorageItem[]
  stats: StorageStats
  isLoading: boolean
  error: string | null
  searchTerm: string
  typeFilter: string
  statusFilter: string
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: StorageState = {
  items: [],
  stats: {
    totalUsed: 0,
    totalQuota: 0,
    totalFiles: 0,
    activeProjects: 0,
    archivedProjects: 0,
    cleanupPending: 0,
  },
  isLoading: false,
  error: null,
  searchTerm: "",
  typeFilter: "all",
  statusFilter: "all",
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
}

const mockStorageItems: StorageItem[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    type: "project",
    owner: { id: "1", name: "John Doe", email: "john@example.com" },
    size: 2.5,
    quota: 5.0,
    files: 1247,
    lastAccessed: "2024-01-20T14:30:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Mobile Banking App",
    type: "project",
    owner: { id: "2", name: "Sarah Smith", email: "sarah@example.com" },
    size: 1.8,
    quota: 3.0,
    files: 892,
    lastAccessed: "2024-01-19T16:45:00Z",
    createdAt: "2024-01-10T09:00:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Analytics API",
    type: "project",
    owner: { id: "3", name: "Mike Johnson", email: "mike@example.com" },
    size: 0.9,
    quota: 2.0,
    files: 456,
    lastAccessed: "2024-01-18T13:15:00Z",
    createdAt: "2024-01-05T11:30:00Z",
    status: "active",
  },
  {
    id: "4",
    name: "User Database",
    type: "project",
    owner: { id: "4", name: "Emily Davis", email: "emily@example.com" },
    size: 5.2,
    quota: 10.0,
    files: 2341,
    lastAccessed: "2024-01-17T10:20:00Z",
    createdAt: "2024-01-01T08:00:00Z",
    status: "archived",
  },
  {
    id: "5",
    name: "Legacy System Backup",
    type: "system",
    owner: { id: "5", name: "System Admin", email: "admin@example.com" },
    size: 12.7,
    quota: 15.0,
    files: 5678,
    lastAccessed: "2024-01-15T08:00:00Z",
    createdAt: "2023-12-01T00:00:00Z",
    status: "cleanup_pending",
  },
  {
    id: "6",
    name: "User Assets - Alex Wilson",
    type: "user",
    owner: { id: "6", name: "Alex Wilson", email: "alex@example.com" },
    size: 0.3,
    quota: 1.0,
    files: 89,
    lastAccessed: "2024-01-20T12:00:00Z",
    createdAt: "2024-01-16T14:25:00Z",
    status: "active",
  },
]

export const fetchStorageData = createAsyncThunk(
  "storage/fetchStorageData",
  async (
    params: {
      page?: number
      search?: string
      type?: string
      status?: string
    } = {},
    { rejectWithValue },
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 700))

      let filteredItems = [...mockStorageItems]

      // Apply filters
      if (params.search) {
        filteredItems = filteredItems.filter(
          (item) =>
            item.name.toLowerCase().includes(params.search!.toLowerCase()) ||
            item.owner.name.toLowerCase().includes(params.search!.toLowerCase()) ||
            item.owner.email.toLowerCase().includes(params.search!.toLowerCase()),
        )
      }

      if (params.type && params.type !== "all") {
        filteredItems = filteredItems.filter((item) => item.type === params.type)
      }

      if (params.status && params.status !== "all") {
        filteredItems = filteredItems.filter((item) => item.status === params.status)
      }

      // Sort by size (largest first)
      filteredItems.sort((a, b) => b.size - a.size)

      // Calculate stats
      const stats: StorageStats = {
        totalUsed: mockStorageItems.reduce((sum, item) => sum + item.size, 0),
        totalQuota: mockStorageItems.reduce((sum, item) => sum + item.quota, 0),
        totalFiles: mockStorageItems.reduce((sum, item) => sum + item.files, 0),
        activeProjects: mockStorageItems.filter((item) => item.status === "active").length,
        archivedProjects: mockStorageItems.filter((item) => item.status === "archived").length,
        cleanupPending: mockStorageItems.filter((item) => item.status === "cleanup_pending").length,
      }

      // Simulate pagination
      const page = params.page || 1
      const perPage = 10
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedItems = filteredItems.slice(startIndex, endIndex)

      return {
        items: paginatedItems,
        stats,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / perPage),
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch storage data")
    }
  },
)

const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.currentPage = 1
    },
    setTypeFilter: (state, action) => {
      state.typeFilter = action.payload
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
      .addCase(fetchStorageData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStorageData.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.items
        state.stats = action.payload.stats
        state.totalItems = action.payload.total
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchStorageData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSearchTerm, setTypeFilter, setStatusFilter, setCurrentPage, clearError } = storageSlice.actions
export default storageSlice.reducer
