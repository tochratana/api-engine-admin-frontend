"use client";

import { useState, useMemo } from "react";
import {
  useFetchUsersPaginatedQuery,
  useDeleteUserMutation,
  useAddRoleToUserMutation,
  useRemoveRoleFromUserMutation,
  useUpdateUserMutation,
} from "@/lib/features/users/usersApi";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  UserPlus,
  RefreshCw,
  Trash2,
  Edit,
  UserCog,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function UsersPage() {
  const { toast } = useToast();

  // Local state for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // RTK Query hooks
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useFetchUsersPaginatedQuery({
    page: currentPage,
    search: searchTerm,
  });

  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const [addRoleToUser, { isLoading: addRoleLoading }] =
    useAddRoleToUserMutation();
  const [removeRoleFromUser, { isLoading: removeRoleLoading }] =
    useRemoveRoleFromUserMutation();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  // Extract data from response
  const users = usersResponse?.content || usersResponse?.users || [];
  const totalUsers = usersResponse?.totalElements || usersResponse?.total || 0;
  const totalPages = usersResponse?.totalPages || Math.ceil(totalUsers / 10);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    enabled: true,
  });

  const [roleForm, setRoleForm] = useState({
    action: "add" as "add" | "remove",
    roleName: "",
  });

  // Computed values
  const activeUsers = useMemo(
    () => users.filter((u) => u.enabled).length,
    [users]
  );
  const adminUsers = useMemo(
    () => users.filter((u) => u.roles.includes("ADMIN")).length,
    [users]
  );
  const verifiedUsers = useMemo(
    () => users.filter((u) => u.emailVerified).length,
    [users]
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleView = (user: User) => {
    toast({
      title: "User Details",
      description: `Viewing details for ${
        user.displayName || `${user.firstName} ${user.lastName}`
      }`,
    });
  };

  const handleEdit = (user: User) => {
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      enabled: user.enabled,
    });
    setEditDialog({ open: true, user });
  };

  const handleDelete = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const handleManageRoles = (user: User) => {
    setRoleDialog({ open: true, user });
    setRoleForm({ action: "add", roleName: "" });
  };

  const confirmDelete = async () => {
    if (deleteDialog.user) {
      try {
        await deleteUser(deleteDialog.user.keycloakUserId).unwrap();
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        setDeleteDialog({ open: false, user: null });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const saveEdit = async () => {
    if (editDialog.user) {
      try {
        await updateUser({
          keycloakUserId: editDialog.user.keycloakUserId,
          userData: editForm,
        }).unwrap();
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        setEditDialog({ open: false, user: null });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update user",
          variant: "destructive",
        });
      }
    }
  };

  const manageRole = async () => {
    if (roleDialog.user && roleForm.roleName) {
      try {
        if (roleForm.action === "add") {
          await addRoleToUser({
            keycloakUserId: roleDialog.user.keycloakUserId,
            roleName: roleForm.roleName,
          }).unwrap();
        } else {
          await removeRoleFromUser({
            keycloakUserId: roleDialog.user.keycloakUserId,
            roleName: roleForm.roleName,
          }).unwrap();
        }
        toast({
          title: "Success",
          description: `Role ${
            roleForm.action === "add" ? "added" : "removed"
          } successfully`,
        });
        setRoleDialog({ open: false, user: null });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to ${roleForm.action} role`,
          variant: "destructive",
        });
      }
    }
  };

  const columns = [
    {
      key: "displayName" as keyof User,
      label: "Name",
      render: (value: string | null, user: User) => (
        <div>
          <div className="font-medium">
            {value || `${user.firstName} ${user.lastName}`}
          </div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
        </div>
      ),
    },
    {
      key: "email" as keyof User,
      label: "Email",
      render: (value: string, user: User) => (
        <div>
          <div>{value}</div>
          {user.emailVerified && (
            <Badge variant="outline" className="text-xs">
              Verified
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "roles" as keyof User,
      label: "Roles",
      // render: (value: string[]) => (
      //   <div className="flex flex-wrap gap-1">
      //     {value.slice(0, 2).map((role, index) => (
      //       <Badge key={index} variant="secondary" className="text-xs">
      //         {role === "ADMIN"
      //           ? "Admin"
      //           : role.replace("default-roles-", "").replace("_", " ")}
      //       </Badge>
      //     ))}
      //     {value.length > 2 && (
      //       <Badge variant="outline" className="text-xs">
      //         +{value.length - 2}
      //       </Badge>
      //     )}
      //   </div>
      // ),
      render: (value: string[]) => {
        let roleLabel = "User"; // default

        if (value.includes("ADMIN")) {
          roleLabel = "Admin";
        } else if (value.includes("USER")) {
          roleLabel = "User";
        }

        return (
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {roleLabel}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "enabled" as keyof User,
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Active" : "Disabled"}
        </Badge>
      ),
    },
    {
      key: "createdTimestamp" as keyof User,
      label: "Created",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "lastLogin" as keyof User,
      label: "Last Login",
      render: (value: string | null) => (
        <span className="text-sm text-muted-foreground">
          {value ? new Date(value).toLocaleDateString() : "Never"}
        </span>
      ),
    },
    {
      key: "actions" as keyof User,
      label: "Actions",
      render: (value: any, user: User) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleManageRoles(user)}
            disabled={addRoleLoading || removeRoleLoading}
          >
            {addRoleLoading || removeRoleLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <UserCog className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(user)}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Edit className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(user)}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all users in your system
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
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Enabled accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              Administrator accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Emails
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              Email verified users
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {typeof error === "object" && "data" in error
              ? String(error.data)
              : String(error)}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            searchPlaceholder="Search users..."
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

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              {deleteDialog.user?.displayName ||
                `${deleteDialog.user?.firstName} ${deleteDialog.user?.lastName}`}
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, user: null })}
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for{" "}
              {editDialog.user?.displayName ||
                `${editDialog.user?.firstName} ${editDialog.user?.lastName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={editForm.firstName}
                onChange={(e) =>
                  setEditForm({ ...editForm, firstName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={editForm.lastName}
                onChange={(e) =>
                  setEditForm({ ...editForm, lastName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enabled" className="text-right">
                Enabled
              </Label>
              <Switch
                id="enabled"
                checked={editForm.enabled}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, enabled: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={updateLoading}>
              {updateLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Management Dialog */}
      <Dialog
        open={roleDialog.open}
        onOpenChange={(open) => setRoleDialog({ open, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Roles</DialogTitle>
            <DialogDescription>
              Add or remove roles for{" "}
              {roleDialog.user?.displayName ||
                `${roleDialog.user?.firstName} ${roleDialog.user?.lastName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="action" className="text-right">
                Action
              </Label>
              <Select
                value={roleForm.action}
                onValueChange={(value: "add" | "remove") =>
                  setRoleForm({ ...roleForm, action: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Role</SelectItem>
                  <SelectItem value="remove">Remove Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                Role
              </Label>
              <Select
                value={roleForm.roleName}
                onValueChange={(value) =>
                  setRoleForm({ ...roleForm, roleName: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {roleDialog.user && (
              <div className="col-span-4">
                <Label>Current Roles:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {roleDialog.user.roles.map((role, index) => (
                    <Badge key={index} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialog({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={manageRole}
              disabled={
                addRoleLoading || removeRoleLoading || !roleForm.roleName
              }
            >
              {addRoleLoading || removeRoleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {roleForm.action === "add" ? "Add Role" : "Remove Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
