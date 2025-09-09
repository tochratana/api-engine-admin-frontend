"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderOpen, Star, HardDrive, TrendingUp, Activity } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"
import { UserGrowthChart } from "@/components/charts/user-growth-chart"
import { ProjectStatusChart } from "@/components/charts/project-status-chart"
import { RatingTrendsChart } from "@/components/charts/rating-trends-chart"
import { StorageUsageChart } from "@/components/charts/storage-usage-chart"
import { ActivityHeatmap } from "@/components/charts/activity-heatmap"

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Projects",
      value: "856",
      icon: FolderOpen,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: Star,
      change: "+0.2",
      changeType: "positive" as const,
    },
    {
      title: "Storage Used",
      value: "2.4 TB",
      icon: HardDrive,
      change: "+15%",
      changeType: "neutral" as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || "Admin"}!</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
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
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
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
              {[
                { action: "New user registered", time: "2 minutes ago", user: "john@example.com" },
                { action: "Project created", time: "15 minutes ago", user: "sarah@example.com" },
                { action: "Rating submitted", time: "1 hour ago", user: "mike@example.com" },
                { action: "Storage quota updated", time: "2 hours ago", user: "admin" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-foreground">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <Users className="h-6 w-6 text-accent mb-2" />
                <p className="font-medium text-foreground">Manage Users</p>
                <p className="text-xs text-muted-foreground">View and edit users</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <FolderOpen className="h-6 w-6 text-accent mb-2" />
                <p className="font-medium text-foreground">View Projects</p>
                <p className="text-xs text-muted-foreground">Browse all projects</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <Star className="h-6 w-6 text-accent mb-2" />
                <p className="font-medium text-foreground">Check Ratings</p>
                <p className="text-xs text-muted-foreground">Review feedback</p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <HardDrive className="h-6 w-6 text-accent mb-2" />
                <p className="font-medium text-foreground">Storage Stats</p>
                <p className="text-xs text-muted-foreground">Monitor usage</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
