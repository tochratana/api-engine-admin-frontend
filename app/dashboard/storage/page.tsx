"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchStorageData,
  setSearchTerm,
  setTypeFilter,
  setStatusFilter,
  setCurrentPage,
} from "@/lib/features/storage/storageSlice"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { FilterSelect } from "@/components/ui/filter-select"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HardDrive, RefreshCw, Trash2, Archive, AlertTriangle, File, Database, Server, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StorageItem {
  id: string
  name: string
  type: "project" | "user" | "system"
  owner: {
    id: string
    name: string
    email: string
  }
  size: number
  quota: number
  files: number
  lastAccessed: string
  createdAt: string
  status: "active" | "archived" | "cleanup_pending"
}

export default function StoragePage() {
  const dispatch = useAppDispatch()
  const { items, stats, isLoading, error, searchTerm, typeFilter, statusFilter, currentPage, totalPages, totalItems } =
    useAppSelector((state) => state.storage)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(
      fetchStorageData({
        page: currentPage,
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
      }),
    )
  }, [dispatch, currentPage, searchTerm, typeFilter, statusFilter])

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term))
  }

  const handleTypeFilter = (type: string) => {
    dispatch(setTypeFilter(type))
  }

  const handleStatusFilter = (status: string) => {
    dispatch(setStatusFilter(status))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handleRefresh = () => {
    dispatch(
      fetchStorageData({
        page: currentPage,
        search: searchTerm,
        type: typeFilter,
        status: statusFilter,
      }),
    )
  }

  const handleView = (item: StorageItem) => {
    toast({
      title: "Storage Details",
      description: `Viewing storage details for ${item.name}`,
    })
  }

  const handleCleanup = (item: StorageItem) => {
    toast({
      title: "Cleanup Storage",
      description: `Initiating cleanup for ${item.name}`,
    })
  }

  const handleArchive = (item: StorageItem) => {
    toast({
      title: "Archive Storage",
      description: `Archiving ${item.name}`,
    })
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "project":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "user":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "system":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return Database
      case "user":
        return User
      case "system":
        return Server
      default:
        return File
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "archived":
        return "secondary"
      case "cleanup_pending":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const columns = [
    {
      key: "name" as keyof StorageItem,
      label: "Name",
      render: (value: string, item: StorageItem) => {
        const Icon = getTypeIcon(item.type)
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{value}</p>
              <p className="text-sm text-muted-foreground">{item.files.toLocaleString()} files</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "owner" as keyof StorageItem,
      label: "Owner",
      render: (owner: StorageItem["owner"]) => (
        <div>
          <p className="font-medium">{owner.name}</p>
          <p className="text-sm text-muted-foreground">{owner.email}</p>
        </div>
      ),
    },
    {
      key: "type" as keyof StorageItem,
      label: "Type",
      render: (value: string) => <Badge className={getTypeBadgeColor(value)}>{value.toUpperCase()}</Badge>,
    },
    {
      key: "size" as keyof StorageItem,
      label: "Usage",
      render: (value: number, item: StorageItem) => (
        <div className="w-32">
          <ProgressBar value={value} max={item.quota} showLabel size="sm" />
        </div>
      ),
    },
    {
      key: "status" as keyof StorageItem,
      label: "Status",
      render: (value: string) => <Badge variant={getStatusBadgeVariant(value)}>{value.replace("_", " ")}</Badge>,
    },
    {
      key: "lastAccessed" as keyof StorageItem,
      label: "Last Accessed",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{new Date(value).toLocaleDateString()}</span>
      ),
    },
  ]

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "project", label: "Projects" },
    { value: "user", label: "Users" },
    { value: "system", label: "System" },
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
    { value: "cleanup_pending", label: "Cleanup Pending" },
  ]

  const usagePercentage = (stats.totalUsed / stats.totalQuota) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Storage Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage storage usage across all projects</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Cleanup
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5" />
            <span>Overall Storage Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProgressBar value={stats.totalUsed} max={stats.totalQuota} showLabel size="lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Used</p>
                <p className="font-semibold">{stats.totalUsed.toFixed(1)} GB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Available</p>
                <p className="font-semibold">{(stats.totalQuota - stats.totalUsed).toFixed(1)} GB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Files</p>
                <p className="font-semibold">{stats.totalFiles.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Usage</p>
                <p className="font-semibold">{usagePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsed.toFixed(1)} GB</div>
            <p className="text-xs text-muted-foreground">of {stats.totalQuota.toFixed(1)} GB quota</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently using storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived Items</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archivedProjects}</div>
            <p className="text-xs text-muted-foreground">Ready for cleanup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cleanup Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cleanupPending}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
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
            <CardTitle>Storage Items</CardTitle>
            <div className="flex items-center space-x-2">
              <FilterSelect
                placeholder="Filter by type"
                value={typeFilter}
                onValueChange={handleTypeFilter}
                options={typeOptions}
              />
              <FilterSelect
                placeholder="Filter by status"
                value={statusFilter}
                onValueChange={handleStatusFilter}
                options={statusOptions}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={items}
            columns={columns}
            searchPlaceholder="Search storage items..."
            onSearch={handleSearch}
            onView={handleView}
            onEdit={handleCleanup}
            onDelete={handleArchive}
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
