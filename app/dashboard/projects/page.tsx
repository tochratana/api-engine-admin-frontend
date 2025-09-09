"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchProjects,
  setSearchTerm,
  setStatusFilter,
  setTypeFilter,
  setCurrentPage,
} from "@/lib/features/projects/projectsSlice"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { FilterSelect } from "@/components/ui/filter-select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FolderOpen, Plus, RefreshCw, Activity, Archive, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export default function ProjectsPage() {
  const dispatch = useAppDispatch()
  const { projects, isLoading, error, searchTerm, statusFilter, typeFilter, currentPage, totalPages, totalProjects } =
    useAppSelector((state) => state.projects)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(
      fetchProjects({
        page: currentPage,
        search: searchTerm,
        status: statusFilter,
        type: typeFilter,
      }),
    )
  }, [dispatch, currentPage, searchTerm, statusFilter, typeFilter])

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term))
  }

  const handleStatusFilter = (status: string) => {
    dispatch(setStatusFilter(status))
  }

  const handleTypeFilter = (type: string) => {
    dispatch(setTypeFilter(type))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handleRefresh = () => {
    dispatch(
      fetchProjects({
        page: currentPage,
        search: searchTerm,
        status: statusFilter,
        type: typeFilter,
      }),
    )
  }

  const handleView = (project: Project) => {
    toast({
      title: "Project Details",
      description: `Viewing details for ${project.name}`,
    })
  }

  const handleEdit = (project: Project) => {
    toast({
      title: "Edit Project",
      description: `Editing project ${project.name}`,
    })
  }

  const handleDelete = (project: Project) => {
    toast({
      title: "Delete Project",
      description: `Are you sure you want to delete ${project.name}?`,
      variant: "destructive",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "inactive":
        return "destructive"
      case "archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "web":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "mobile":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "api":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "database":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const columns = [
    {
      key: "name" as keyof Project,
      label: "Project Name",
      render: (value: string, project: Project) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">{project.description}</p>
        </div>
      ),
    },
    {
      key: "owner" as keyof Project,
      label: "Owner",
      render: (owner: Project["owner"]) => (
        <div>
          <p className="font-medium">{owner.name}</p>
          <p className="text-sm text-muted-foreground">{owner.email}</p>
        </div>
      ),
    },
    {
      key: "type" as keyof Project,
      label: "Type",
      render: (value: string) => <Badge className={getTypeBadgeColor(value)}>{value.toUpperCase()}</Badge>,
    },
    {
      key: "status" as keyof Project,
      label: "Status",
      render: (value: string) => <Badge variant={getStatusBadgeVariant(value)}>{value}</Badge>,
    },
    {
      key: "storageUsed" as keyof Project,
      label: "Storage",
      render: (value: number) => <span className="text-sm">{value} GB</span>,
    },
    {
      key: "apiCalls" as keyof Project,
      label: "API Calls",
      render: (value: number) => <span className="text-sm">{value.toLocaleString()}</span>,
    },
    {
      key: "updatedAt" as keyof Project,
      label: "Last Updated",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{new Date(value).toLocaleDateString()}</span>
      ),
    },
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archived" },
  ]

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "web", label: "Web" },
    { value: "mobile", label: "Mobile" },
    { value: "api", label: "API" },
    { value: "database", label: "Database" },
  ]

  const activeProjects = projects.filter((p) => p.status === "active").length
  const completedProjects = projects.filter((p) => p.status === "completed").length
  const totalStorage = projects.reduce((sum, p) => sum + p.storageUsed, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage all user projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStorage.toFixed(1)} GB</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Projects</CardTitle>
            <div className="flex items-center space-x-2">
              <FilterSelect
                placeholder="Filter by status"
                value={statusFilter}
                onValueChange={handleStatusFilter}
                options={statusOptions}
              />
              <FilterSelect
                placeholder="Filter by type"
                value={typeFilter}
                onValueChange={handleTypeFilter}
                options={typeOptions}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={projects}
            columns={columns}
            searchPlaceholder="Search projects..."
            onSearch={handleSearch}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
