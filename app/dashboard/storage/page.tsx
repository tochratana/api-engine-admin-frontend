"use client";

import { useState } from "react";
import {
  useGetStorageStatisticsQuery,
  useFetchStorageDataQuery,
  useGetStorageItemByUuidQuery,
  useDeleteStorageItemMutation,
  useArchiveStorageItemMutation,
  useRefreshStorageItemMutation,
  useRefreshAllStorageMutation,
  useCleanupStorageItemsMutation,
} from "@/lib/features/storage/storageApi";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { FilterSelect } from "@/components/ui/filter-select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HardDrive,
  RefreshCw,
  Activity,
  Archive,
  Trash2,
  Eye,
  Loader2,
  Calendar,
  Database,
  Server,
  User,
  FileText,
  Cpu,
  AlertTriangle,
  BarChart3,
  Settings,
  Clock,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StorageProject {
  projectUuid: string;
  projectName: string;
  description: string;
  ownerUserUuid: string;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
  usageCurrent?: {
    id: string;
    projectId: string;
    postgresBytes: number;
    mongoBytes: number;
    restRequestsTotal: number;
    restRead: number;
    restWrite: number;
    authRequests: number;
    errorCount: number;
    totalLatencyMs: number;
    samples: number;
    updatedAt: string;
  };
  totalApiCalls: number;
  totalStorageBytes: number;
  lastActivityAt: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "ARCHIVED";
  hasUsageData: boolean;
}

export default function StorageManagementPage() {
  const { toast } = useToast();

  // Local state for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: StorageProject | null;
  }>({
    open: false,
    item: null,
  });

  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    item: StorageProject | null;
  }>({
    open: false,
    item: null,
  });

  const [cleanupDialog, setCleanupDialog] = useState({
    open: false,
  });

  // RTK Query hooks - using the corrected hook names
  const {
    data: storageData,
    error,
    isLoading,
    refetch,
  } = useFetchStorageDataQuery({
    page: currentPage,
    search: searchTerm,
    status: statusFilter,
    type: typeFilter,
  });

  const { data: statisticsData, isLoading: statisticsLoading } =
    useGetStorageStatisticsQuery();

  const { data: itemDetail, isLoading: itemDetailLoading } =
    useGetStorageItemByUuidQuery(viewDialog.item?.projectUuid || "", {
      skip: !viewDialog.item?.projectUuid,
    });

  console.log("This is a data for storage : ", storageData);

  // Mutation hooks
  const [deleteItem, { isLoading: deleteLoading }] =
    useDeleteStorageItemMutation();
  const [archiveItem, { isLoading: archiveLoading }] =
    useArchiveStorageItemMutation();
  const [refreshItem, { isLoading: refreshLoading }] =
    useRefreshStorageItemMutation();
  const [refreshAll, { isLoading: refreshAllLoading }] =
    useRefreshAllStorageMutation();
  const [cleanupItems, { isLoading: cleanupLoading }] =
    useCleanupStorageItemsMutation();

  // Extract data from RTK Query response
  const items = storageData?.projects || [];
  const totalPages = storageData?.totalPages || 1;
  const totalItems = storageData?.total || 0;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleRefreshAll = async () => {
    try {
      await refreshAll().unwrap();
      toast({
        title: "Success",
        description: "All storage data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh storage data",
        variant: "destructive",
      });
    }
  };

  const handleView = (item: StorageProject) => {
    setViewDialog({ open: true, item });
  };

  const handleDelete = (item: StorageProject) => {
    setDeleteDialog({ open: true, item });
  };

  const handleArchive = async (item: StorageProject) => {
    try {
      await archiveItem({
        uuid: item.projectUuid,
        status: item.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE",
      }).unwrap();
      toast({
        title: "Success",
        description: `Storage item ${
          item.status === "ACTIVE" ? "archived" : "activated"
        } successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update storage item status",
        variant: "destructive",
      });
    }
  };

  const handleRefreshItem = async (item: StorageProject) => {
    try {
      await refreshItem(item.projectUuid).unwrap();
      toast({
        title: "Success",
        description: "Storage item refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh storage item",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (deleteDialog.item) {
      try {
        await deleteItem(deleteDialog.item.projectUuid).unwrap();
        toast({
          title: "Success",
          description: "Storage item deleted successfully",
        });
        setDeleteDialog({ open: false, item: null });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete storage item",
          variant: "destructive",
        });
      }
    }
  };

  const handleCleanup = async () => {
    try {
      await cleanupItems(selectedItems).unwrap();
      toast({
        title: "Success",
        description: `${selectedItems.length} items cleaned up successfully`,
      });
      setSelectedItems([]);
      setCleanupDialog({ open: false });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cleanup storage items",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "INACTIVE":
        return "destructive";
      case "ARCHIVED":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const columns = [
    {
      key: "select" as keyof StorageProject,
      label: "",
      render: (value: any, item: StorageProject) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(item.projectUuid)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, item.projectUuid]);
            } else {
              setSelectedItems(
                selectedItems.filter((id) => id !== item.projectUuid)
              );
            }
          }}
          className="rounded border-gray-300"
        />
      ),
    },
    {
      key: "projectName" as keyof StorageProject,
      label: "Project Name",
      render: (value: string, item: StorageProject) => (
        <div className="min-w-[180px]">
          <p className="font-medium truncate">{value}</p>
          {item.description && (
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {item.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "owner" as keyof StorageProject,
      label: "Owner",
      render: (value: string | null) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{value || "Unknown"}</span>
        </div>
      ),
    },
    {
      key: "status" as keyof StorageProject,
      label: "Status",
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value)}>
          {value.charAt(0) + value.slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "totalStorageBytes" as keyof StorageProject,
      label: "Storage Used",
      render: (value: number) => (
        <div className="flex items-center">
          <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{formatBytes(value)}</span>
        </div>
      ),
    },
    {
      key: "totalApiCalls" as keyof StorageProject,
      label: "API Calls",
      render: (value: number) => (
        <div className="flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{value.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "lastActivityAt" as keyof StorageProject,
      label: "Last Activity",
      render: (value: string) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: "actions" as keyof StorageProject,
      label: "Actions",
      render: (value: any, item: StorageProject) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(item)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRefreshItem(item)}
            disabled={refreshLoading}
            title="Refresh storage data"
          >
            {refreshLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleArchive(item)}
            disabled={archiveLoading}
            title={item.status === "ACTIVE" ? "Archive" : "Activate"}
          >
            {archiveLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item)}
            disabled={deleteLoading}
            title="Delete item"
          >
            {deleteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "project", label: "Project" },
    { value: "user", label: "User" },
    { value: "system", label: "System" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Storage Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage storage usage across all projects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedItems.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setCleanupDialog({ open: true })}
              disabled={cleanupLoading}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Cleanup ({selectedItems.length})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleRefreshAll}
            disabled={refreshAllLoading}
          >
            <Zap
              className={`h-4 w-4 mr-2 ${
                refreshAllLoading ? "animate-spin" : ""
              }`}
            />
            Refresh All
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Storage Used
            </CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisticsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                formatBytes(statisticsData?.totalStorageUsed || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {statisticsData?.totalProjects || 0} projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisticsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                statisticsData?.activeProjects || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {statisticsData?.recentProjects || 0} recent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls Today
            </CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisticsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                statisticsData?.totalApiCallsToday?.toLocaleString() || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Today's requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usage Tracking
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statisticsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                statisticsData?.projectsWithUsageData || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {statisticsData?.projectsWithoutUsageData || 0} without data
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error && "data" in error
              ? JSON.stringify(error.data)
              : "Failed to fetch storage data. Please check your authentication."}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Storage Items</CardTitle>
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
            data={items}
            columns={columns}
            searchPlaceholder="Search storage items..."
            onSearch={handleSearch}
            onView={handleView}
            onEdit={() => {}} // Not implemented for storage
            onDelete={handleDelete}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, item: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Storage Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.item?.projectName}
              "? This action cannot be undone and will permanently remove all
              storage data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, item: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cleanup Confirmation Dialog */}
      <Dialog
        open={cleanupDialog.open}
        onOpenChange={(open) => setCleanupDialog({ open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cleanup Storage Items</DialogTitle>
            <DialogDescription>
              Are you sure you want to cleanup {selectedItems.length} selected
              items? This will remove unused data and optimize storage usage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCleanupDialog({ open: false })}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleCleanup}
              disabled={cleanupLoading}
            >
              {cleanupLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Cleanup Items
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, item: null })}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Database className="h-5 w-5 text-primary" />
              {viewDialog.item?.projectName}
            </DialogTitle>
            <DialogDescription className="text-base">
              Storage details and usage information
            </DialogDescription>
          </DialogHeader>

          {viewDialog.item && (
            <div className="space-y-8 py-4">
              {/* Project Information Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Project Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Project ID:</span>
                      <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                        {viewDialog.item.projectUuid}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge
                        variant={getStatusBadgeVariant(viewDialog.item.status)}
                        className="px-2 py-1"
                      >
                        {viewDialog.item.status.charAt(0) +
                          viewDialog.item.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Owner:</span>
                      <span className="text-sm text-muted-foreground">
                        {viewDialog.item.owner || "Unknown"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">
                        Has Usage Data:
                      </span>
                      <Badge
                        variant={
                          viewDialog.item.hasUsageData
                            ? "default"
                            : "destructive"
                        }
                      >
                        {viewDialog.item.hasUsageData ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(viewDialog.item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Updated:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(viewDialog.item.updatedAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">
                        Last Activity:
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(
                          viewDialog.item.lastActivityAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {viewDialog.item.description && (
                  <div className="pt-4">
                    <span className="text-sm font-medium block mb-2">
                      Description:
                    </span>
                    <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg border">
                      {viewDialog.item.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Storage Information Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <Database className="h-5 w-5 text-primary" />
                  Storage Usage
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {formatBytes(viewDialog.item.totalStorageBytes)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Total Storage
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {formatBytes(
                        viewDialog.item.usageCurrent?.postgresBytes || 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      PostgreSQL
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {formatBytes(
                        viewDialog.item.usageCurrent?.mongoBytes || 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      MongoDB
                    </div>
                  </div>
                </div>
              </div>

              {/* API Usage Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <Server className="h-5 w-5 text-primary" />
                  API Usage
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {viewDialog.item.totalApiCalls.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Total API Calls
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {(
                        viewDialog.item.usageCurrent?.restRequestsTotal || 0
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      REST Requests
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {(
                        viewDialog.item.usageCurrent?.authRequests || 0
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Auth Requests
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {viewDialog.item.usageCurrent?.errorCount || 0}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Error Count
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Section */}
              {viewDialog.item.usageCurrent && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Performance Metrics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                      <div className="text-2xl font-bold text-foreground">
                        {viewDialog.item.usageCurrent.totalLatencyMs}ms
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total Latency
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                      <div className="text-2xl font-bold text-foreground">
                        {viewDialog.item.usageCurrent.samples}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Samples
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                      <div className="text-2xl font-bold text-foreground">
                        {viewDialog.item.usageCurrent.samples > 0
                          ? Math.round(
                              viewDialog.item.usageCurrent.totalLatencyMs /
                                viewDialog.item.usageCurrent.samples
                            )
                          : 0}
                        ms
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Avg Latency
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Read/Write Breakdown */}
              {viewDialog.item.usageCurrent && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                    <Settings className="h-5 w-5 text-primary" />
                    Request Breakdown
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                      <div className="text-2xl font-bold text-green-600">
                        {(
                          viewDialog.item.usageCurrent.restRead || 0
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        REST Read Operations
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                      <div className="text-2xl font-bold text-blue-600">
                        {(
                          viewDialog.item.usageCurrent.restWrite || 0
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        REST Write Operations
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Updated Information */}
              {viewDialog.item.usageCurrent && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    Usage Data Information
                  </h3>

                  <div className="bg-muted p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Usage Data ID:
                      </span>
                      <span className="text-sm text-muted-foreground font-mono">
                        {viewDialog.item.usageCurrent.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium">Last Updated:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(
                          viewDialog.item.usageCurrent.updatedAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, item: null })}
              className="px-6"
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (viewDialog.item) {
                  handleRefreshItem(viewDialog.item);
                }
              }}
              disabled={refreshLoading}
              className="px-6"
            >
              {refreshLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Refresh Data
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (viewDialog.item) {
                  handleArchive(viewDialog.item);
                  setViewDialog({ open: false, item: null });
                }
              }}
              disabled={archiveLoading}
              className="px-6"
            >
              {archiveLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Archive className="h-4 w-4 mr-2" />
              )}
              {viewDialog.item?.status === "ACTIVE" ? "Archive" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
