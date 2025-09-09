import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface Project {
  id: string
  name: string
  description: string
  owner: {
    id: string
    name: string
    email: string
  }
  status: "active" | "inactive" | "completed" | "archived"
  type: "web" | "mobile" | "api" | "database"
  createdAt: string
  updatedAt: string
  storageUsed: number
  apiCalls: number
}

interface ProjectsState {
  projects: Project[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  statusFilter: string
  typeFilter: string
  currentPage: number
  totalPages: number
  totalProjects: number
}

const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  statusFilter: "all",
  typeFilter: "all",
  currentPage: 1,
  totalPages: 1,
  totalProjects: 0,
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    owner: { id: "1", name: "John Doe", email: "john@example.com" },
    status: "active",
    type: "web",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    storageUsed: 2.5,
    apiCalls: 15420,
  },
  {
    id: "2",
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric auth",
    owner: { id: "2", name: "Sarah Smith", email: "sarah@example.com" },
    status: "completed",
    type: "mobile",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-25T16:45:00Z",
    storageUsed: 1.8,
    apiCalls: 8750,
  },
  {
    id: "3",
    name: "Analytics API",
    description: "RESTful API for data analytics and reporting",
    owner: { id: "3", name: "Mike Johnson", email: "mike@example.com" },
    status: "active",
    type: "api",
    createdAt: "2024-01-05T11:30:00Z",
    updatedAt: "2024-01-22T13:15:00Z",
    storageUsed: 0.9,
    apiCalls: 25600,
  },
  {
    id: "4",
    name: "User Database",
    description: "Scalable user management database system",
    owner: { id: "4", name: "Emily Davis", email: "emily@example.com" },
    status: "inactive",
    type: "database",
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-18T10:20:00Z",
    storageUsed: 5.2,
    apiCalls: 3200,
  },
]

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (params: { page?: number; search?: string; status?: string; type?: string } = {}, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      let filteredProjects = [...mockProjects]

      // Apply filters
      if (params.search) {
        filteredProjects = filteredProjects.filter(
          (project) =>
            project.name.toLowerCase().includes(params.search!.toLowerCase()) ||
            project.description.toLowerCase().includes(params.search!.toLowerCase()) ||
            project.owner.name.toLowerCase().includes(params.search!.toLowerCase()),
        )
      }

      if (params.status && params.status !== "all") {
        filteredProjects = filteredProjects.filter((project) => project.status === params.status)
      }

      if (params.type && params.type !== "all") {
        filteredProjects = filteredProjects.filter((project) => project.type === params.type)
      }

      // Simulate pagination
      const page = params.page || 1
      const perPage = 10
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

      return {
        projects: paginatedProjects,
        total: filteredProjects.length,
        totalPages: Math.ceil(filteredProjects.length / perPage),
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch projects")
    }
  },
)

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.currentPage = 1
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
      state.currentPage = 1
    },
    setTypeFilter: (state, action) => {
      state.typeFilter = action.payload
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
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload.projects
        state.totalProjects = action.payload.total
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSearchTerm, setStatusFilter, setTypeFilter, setCurrentPage, clearError } = projectsSlice.actions
export default projectsSlice.reducer
