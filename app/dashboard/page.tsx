"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FolderOpen,
  Star,
  HardDrive,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useFetchUsersQuery } from "@/lib/features/users/usersApi";
// You'll need to create these RTK Query APIs similar to usersApi
import { useFetchProjectsQuery } from "@/lib/features/projects/projectsApi";
import { useFetchRatingsQuery } from "@/lib/features/ratings/ratingsApi";
import { UserGrowthChart } from "@/components/charts/user-growth-chart";
import { ProjectStatusChart } from "@/components/charts/project-status-chart";
import { RatingTrendsChart } from "@/components/charts/rating-trends-chart";
import { StorageUsageChart } from "@/components/charts/storage-usage-chart";
import { ActivityHeatmap } from "@/components/charts/activity-heatmap";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  // RTK Query hooks - these will automatically fetch data and handle caching
  const { data: users = [], isLoading: usersLoading } = useFetchUsersQuery();
  const { data: projects = [], isLoading: projectsLoading } =
    useFetchProjectsQuery();

  // Fixed: Use the correct data structure from ratingsApi
  const { data: ratingsData, isLoading: ratingsLoading } = useFetchRatingsQuery(
    { size: 100 }
  ); // Fetch more data for better stats

  // Extract ratings array from the API response structure
  const ratings = ratingsData?.ratings || [];

  // Calculate stats from the fetched data
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.enabled).length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;

  // Fixed: Use the correct field names and handle the transformed data
  const totalRatings = ratingsData?.totalRatings || ratings.length;
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => {
          // Handle both 'rating' (transformed) and 'star' (original API) fields
          const ratingValue = r.rating || r.star || 0;
          return sum + ratingValue;
        }, 0) / ratings.length
      : 0;

  const totalStorage = projects.reduce(
    (sum, p) => sum + (p.storageUsed || 0),
    0
  );

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      change: `${activeUsers} active`,
      changeType: "positive" as const,
      isLoading: usersLoading,
    },
    {
      title: "Active Projects",
      value: activeProjects.toLocaleString(),
      icon: FolderOpen,
      change: `${totalProjects} total`,
      changeType: "positive" as const,
      isLoading: projectsLoading,
    },
    {
      title: "Average Rating",
      value: averageRating.toFixed(1),
      icon: Star,
      change: `${totalRatings} reviews`,
      changeType:
        averageRating >= 4.0
          ? "positive"
          : averageRating >= 3.0
          ? "neutral"
          : ("negative" as const),
      isLoading: ratingsLoading,
    },
    {
      title: "Storage Used",
      value: `${totalStorage.toFixed(1)} GB`,
      icon: HardDrive,
      change: `${projects.length} projects`,
      changeType: "neutral" as const,
      isLoading: projectsLoading,
    },
  ];

  // Generate recent activity from all data sources
  const recentActivity = [
    // Add user activities
    ...users.slice(0, 2).map((user) => ({
      action: "New user registered",
      time: user.createdTimestamp
        ? new Date(user.createdTimestamp).toLocaleDateString()
        : "Recently",
      user: user.email || user.username || "Unknown user",
    })),

    // Add project activities
    ...projects.slice(0, 2).map((project) => ({
      action: "Project created",
      time: project.createdAt
        ? new Date(project.createdAt).toLocaleDateString()
        : "Recently",
      user: project.owner?.email || project.owner?.username || "Unknown",
    })),

    // Add rating activities - Fixed to handle the correct data structure
    ...ratings.slice(0, 3).map((rating) => ({
      action: `${rating.rating || rating.star}-star rating submitted`,
      time: rating.createdAt
        ? new Date(rating.createdAt).toLocaleDateString()
        : "Recently",
      user:
        rating.user?.email ||
        rating.user?.name ||
        rating.username ||
        "Unknown user",
    })),
  ]
    .sort((a, b) => {
      // Sort by most recent first (if dates are available)
      const dateA = new Date(a.time === "Recently" ? Date.now() : a.time);
      const dateB = new Date(b.time === "Recently" ? Date.now() : b.time);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 6); // Show top 6 activities

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name || "Admin"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.isLoading ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                ) : (
                  stat.value
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="h-3 w-3 text-accent" />
                <span
                  className={`${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.isLoading ? (
                    <div className="h-3 w-12 bg-muted animate-pulse rounded"></div>
                  ) : (
                    stat.change
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart />
        <ProjectStatusChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingTrendsChart />
        <StorageUsageChart />
      </div>

      <ActivityHeatmap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usersLoading || projectsLoading || ratingsLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-muted animate-pulse rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-sm"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground truncate">
                        {activity.action}
                      </p>
                      <p className="text-muted-foreground text-xs truncate">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    No recent activity found
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Activity will appear here as users interact with your system
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left group">
                <Users className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-foreground">Manage Users</p>
                <p className="text-xs text-muted-foreground">
                  View and edit users
                </p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left group">
                <FolderOpen className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-foreground">View Projects</p>
                <p className="text-xs text-muted-foreground">
                  Browse all projects
                </p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left group">
                <Star className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-foreground">Check Ratings</p>
                <p className="text-xs text-muted-foreground">
                  Review feedback ({totalRatings})
                </p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left group">
                <HardDrive className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-foreground">Storage Stats</p>
                <p className="text-xs text-muted-foreground">
                  {totalStorage.toFixed(1)} GB used
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug info - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border-dashed border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10">
          <CardHeader>
            <CardTitle className="text-yellow-600">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-yellow-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>Ratings Data: {ratingsData ? "Loaded" : "No data"}</p>
                <p>Total Ratings: {totalRatings}</p>
                <p>Ratings Array Length: {ratings.length}</p>
                <p>Average Rating: {averageRating.toFixed(2)}</p>
              </div>
              <div>
                <p>Recent Activity Items: {recentActivity.length}</p>
                <p>Users: {users.length}</p>
                <p>Projects: {projects.length}</p>
                <p>
                  Loading States: U:{usersLoading ? "Y" : "N"} P:
                  {projectsLoading ? "Y" : "N"} R:{ratingsLoading ? "Y" : "N"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
