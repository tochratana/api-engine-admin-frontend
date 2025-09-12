"use client";

import { useState } from "react";
import {
  useFetchProjectsQuery,
  useGetProjectWithUserQuery,
  useDeleteProjectMutation,
  useCreateProjectMutation,
  useGetProjectStatisticsQuery,
} from "@/lib/features/projects/projectsApi";
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
  FolderOpen,
  Plus,
  RefreshCw,
  Activity,
  Archive,
  CheckCircle,
  Trash2,
  Eye,
  Loader2,
  Calendar,
  Database,
  Server,
  User,
  FileText,
  Cpu,
  HardDrive,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  projectUuid: string;
  projectName: string;
  description: string;
  ownerUserUuid: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  totalStorageBytes: number;
  postgresBytes: number;
  mongoBytes: number;
  totalApiCalls: number;
  restRequests: number;
  authRequests: number;
  lastActivityAt: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "ARCHIVED";
  hasUsageData: boolean;
}

export default function ProjectsPage() {
  const { toast } = useToast();

  // Local state for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    project: Project | null;
  }>({
    open: false,
    project: null,
  });
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    project: Project | null;
  }>({
    open: false,
    project: null,
  });

  // RTK Query hooks
  const {
    data: projectsData,
    error,
    isLoading,
    refetch,
  } = useFetchProjectsQuery({
    page: currentPage,
    search: searchTerm,
    status: statusFilter,
    type: typeFilter,
  });

  // const {
  //   data: projectsData,
  //   error,
  //   isLoading,
  //   refetch,
  // } = useGetProjectStatisticsQuery({
  //   page:currentPage,
  //   search: searchTerm,
  //   status: statusFilter,
  //   type: typeFilter,
  // });

  const { data: projectWithUser, isLoading: projectWithUserLoading } =
    useGetProjectWithUserQuery(viewDialog.project?.projectUuid || "", {
      skip: !viewDialog.project?.projectUuid,
    });

  const [deleteProject, { isLoading: deleteLoading }] =
    useDeleteProjectMutation();
  const [createProject] = useCreateProjectMutation();

  // Extract data from RTK Query response
  const projects = projectsData?.projects || [];
  const totalPages = projectsData?.totalPages || 1;
  const totalProjects = projectsData?.total || 0;

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

  const handleView = (project: Project) => {
    setViewDialog({ open: true, project });
  };

  const handleEdit = (project: Project) => {
    toast({
      title: "Edit Project",
      description: `Editing project ${project.projectName}`,
    });
  };

  const handleDelete = (project: Project) => {
    setDeleteDialog({ open: true, project });
  };

  const confirmDelete = async () => {
    if (deleteDialog.project) {
      try {
        await deleteProject(deleteDialog.project.projectUuid).unwrap();
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        setDeleteDialog({ open: false, project: null });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateProject = async () => {
    try {
      await createProject({
        name: "New Project",
        description: "A new project description",
        type: "web",
      }).unwrap();
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
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
      key: "projectName" as keyof Project,
      label: "Project Name",
      render: (value: string, project: Project) => (
        <div className="min-w-[180px]">
          <p className="font-medium truncate">{value}</p>
          {project.description && (
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {project.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "owner" as keyof Project,
      label: "Owner",
      render: (value: string) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "status" as keyof Project,
      label: "Status",
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value)}>
          {value.charAt(0) + value.slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "totalStorageBytes" as keyof Project,
      label: "Storage",
      render: (value: number) => (
        <div className="flex items-center">
          <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{formatBytes(value)}</span>
        </div>
      ),
    },
    {
      key: "totalApiCalls" as keyof Project,
      label: "API Calls",
      render: (value: number) => (
        <div className="flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{value.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "lastActivityAt" as keyof Project,
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
      key: "actions" as keyof Project,
      label: "Actions",
      render: (value: any, project: Project) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(project)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(project)}
            disabled={deleteLoading}
            title="Delete project"
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
    { value: "web", label: "Web" },
    { value: "mobile", label: "Mobile" },
    { value: "api", label: "API" },
    { value: "database", label: "Database" },
  ];

  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;
  const totalStorage = projects.reduce(
    (sum, p) => sum + p.totalStorageBytes,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Project Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage all user projects
          </p>
        </div>
        <div className="flex items-center space-x-2">
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
          <Button onClick={handleCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
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
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(totalStorage)}
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error && "data" in error
              ? JSON.stringify(error.data)
              : "Failed to fetch projects"}
          </AlertDescription>
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, project: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "
              {deleteDialog.project?.projectName}"? This action cannot be undone
              and will permanently remove all project data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, project: null })}
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
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, project: null })}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FolderOpen className="h-5 w-5 text-primary" />
              {viewDialog.project?.projectName}
            </DialogTitle>
            <DialogDescription className="text-base">
              Project details and usage information
            </DialogDescription>
          </DialogHeader>

          {viewDialog.project && (
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
                        {viewDialog.project.projectUuid}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge
                        variant={getStatusBadgeVariant(
                          viewDialog.project.status
                        )}
                        className="px-2 py-1"
                      >
                        {viewDialog.project.status.charAt(0) +
                          viewDialog.project.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Owner:</span>
                      <span className="text-sm text-muted-foreground">
                        {viewDialog.project.owner}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(
                          viewDialog.project.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Updated:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(
                          viewDialog.project.updatedAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">
                        Last Activity:
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(
                          viewDialog.project.lastActivityAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {viewDialog.project.description && (
                  <div className="pt-4">
                    <span className="text-sm font-medium block mb-2">
                      Description:
                    </span>
                    <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg border">
                      {viewDialog.project.description}
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
                      {formatBytes(viewDialog.project.totalStorageBytes)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Total Storage
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {formatBytes(viewDialog.project.postgresBytes)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      PostgreSQL
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {formatBytes(viewDialog.project.mongoBytes)}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {viewDialog.project.totalApiCalls.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Total API Calls
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {viewDialog.project.restRequests.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      REST Requests
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border text-center transition-colors hover:bg-muted/80">
                    <div className="text-2xl font-bold text-foreground">
                      {viewDialog.project.authRequests.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Auth Requests
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, project: null })}
              className="px-6"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
