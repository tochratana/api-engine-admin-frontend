"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchUsers, setSearchTerm, setCurrentPage } from "@/lib/features/users/usersSlice"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, UserPlus, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const { users, isLoading, error, searchTerm, currentPage, totalPages, totalUsers } = useAppSelector(
    (state) => state.users,
  )
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, search: searchTerm }))
  }, [dispatch, currentPage, searchTerm])

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handleRefresh = () => {
    dispatch(fetchUsers({ page: currentPage, search: searchTerm }))
  }

  const handleView = (user: User) => {
    toast({
      title: "User Details",
      description: `Viewing details for ${user.displayName || `${user.firstName} ${user.lastName}`}`,
    })
  }

  const handleEdit = (user: User) => {
    toast({
      title: "Edit User",
      description: `Editing user ${user.displayName || `${user.firstName} ${user.lastName}`}`,
    })
  }

  const handleDelete = (user: User) => {
    toast({
      title: "Delete User",
      description: `Are you sure you want to delete ${user.displayName || `${user.firstName} ${user.lastName}`}?`,
      variant: "destructive",
    })
  }

  const columns = [
    {
      key: "displayName" as keyof User,
      label: "Name",
      render: (value: string | null, user: User) => (
        <div>
          <div className="font-medium">{value || `${user.firstName} ${user.lastName}`}</div>
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
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((role, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {role === "ADMIN" ? "Admin" : role.replace("default-roles-", "").replace("_", " ")}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "enabled" as keyof User,
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "destructive"}>{value ? "Active" : "Disabled"}</Badge>
      ),
    },
    {
      key: "createdTimestamp" as keyof User,
      label: "Created",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: "lastLogin" as keyof User,
      label: "Last Login",
      render: (value: string | null) => (
        <span className="text-sm text-muted-foreground">{value ? new Date(value).toLocaleDateString() : "Never"}</span>
      ),
    },
  ]

  const activeUsers = users.filter((u) => u.enabled).length
  const adminUsers = users.filter((u) => u.roles.includes("ADMIN")).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all users in your system</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
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
            <p className="text-xs text-muted-foreground">All registered users</p>
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
            <p className="text-xs text-muted-foreground">Administrator accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Emails</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.emailVerified).length}</div>
            <p className="text-xs text-muted-foreground">Email verified users</p>
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
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
