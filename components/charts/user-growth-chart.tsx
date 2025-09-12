"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, UserPlus, Calendar, Activity } from "lucide-react";
import { useFetchUsersQuery } from "@/lib/features/users/usersApi";
import { useState } from "react";

export function UserGrowthChart() {
  const { data: users = [], isLoading } = useFetchUsersQuery();
  const [chartType, setChartType] = useState("line"); // "line" or "area"
  const [timeRange, setTimeRange] = useState(30); // days

  const generateUserGrowthData = () => {
    if (!users.length) return [];

    const dailyData = new Map();
    const now = new Date();

    // Generate data for selected time range
    for (let i = timeRange - 1; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i
      );
      const dayKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const fullDateKey = date.toDateString();

      dailyData.set(fullDateKey, {
        day: dayKey,
        users: 0,
        newUsers: 0,
        date: date,
      });
    }

    // Count users by creation day
    users.forEach((user) => {
      const createdDate = new Date(user.createdTimestamp);
      const fullDateKey = createdDate.toDateString();

      if (dailyData.has(fullDateKey)) {
        const data = dailyData.get(fullDateKey);
        data.newUsers += 1;
      }
    });

    // Calculate cumulative totals
    let cumulativeUsers = 0;
    const result = Array.from(dailyData.values())
      .sort((a, b) => a.date - b.date)
      .map((data) => {
        cumulativeUsers += data.newUsers;
        return {
          day: data.day,
          users: cumulativeUsers,
          newUsers: data.newUsers,
        };
      });

    return result;
  };

  const data = generateUserGrowthData();
  const totalUsers = data.length > 0 ? data[data.length - 1].users : 0;
  const totalNewUsers = data.reduce((sum, day) => sum + day.newUsers, 0);
  const averageDaily =
    totalNewUsers > 0 ? Math.round(totalNewUsers / timeRange) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}:{" "}
                <span className="font-medium text-foreground">
                  {entry.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                User Growth Analytics
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div className="text-muted-foreground">Loading analytics...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ChartComponent = chartType === "area" ? AreaChart : LineChart;
  const LineOrArea = chartType === "area" ? Area : Line;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20 overflow-hidden">
      <CardHeader className="pb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                User Growth Analytics
              </span>
            </CardTitle>

            <div className="flex items-center gap-2">
              {/* Time Range Selector */}
              <div className="flex rounded-lg border border-border/50 bg-muted/30 p-1">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      timeRange === days
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>

              {/* Chart Type Selector */}
              <div className="flex rounded-lg border border-border/50 bg-muted/30 p-1">
                {[
                  { type: "line", icon: TrendingUp },
                  { type: "area", icon: Activity },
                ].map(({ type, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`p-2 rounded-md transition-all ${
                      chartType === type
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Users</p>
                <p className="text-lg font-semibold">
                  {totalUsers.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <div className="p-2 rounded-lg bg-green-500/10">
                <UserPlus className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">New Users</p>
                <p className="text-lg font-semibold">{totalNewUsers}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Calendar className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg/Day</p>
                <p className="text-lg font-semibold">{averageDaily}</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="rounded-lg bg-background/30 p-4 border border-border/50">
          <ResponsiveContainer width="100%" height={350}>
            <ChartComponent
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="totalUsersGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="newUsersGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/40"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="day"
                className="text-muted-foreground"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-muted-foreground"
                fontSize={11}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip content={<CustomTooltip />} />

              <LineOrArea
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--chart-1))"
                strokeWidth={chartType === "line" ? 3 : 2}
                fill={
                  chartType === "area" ? "url(#totalUsersGradient)" : undefined
                }
                dot={
                  chartType === "line"
                    ? {
                        fill: "hsl(var(--chart-1))",
                        strokeWidth: 2,
                        r: 4,
                        className: "drop-shadow-sm",
                      }
                    : false
                }
                activeDot={
                  chartType === "line"
                    ? {
                        r: 6,
                        fill: "hsl(var(--chart-1))",
                        className: "drop-shadow-md",
                      }
                    : undefined
                }
                name="Total Users"
              />
              <LineOrArea
                type="monotone"
                dataKey="newUsers"
                stroke="hsl(var(--chart-2))"
                strokeWidth={chartType === "line" ? 3 : 2}
                fill={
                  chartType === "area" ? "url(#newUsersGradient)" : undefined
                }
                dot={
                  chartType === "line"
                    ? {
                        fill: "hsl(var(--chart-2))",
                        strokeWidth: 2,
                        r: 4,
                        className: "drop-shadow-sm",
                      }
                    : false
                }
                activeDot={
                  chartType === "line"
                    ? {
                        r: 6,
                        fill: "hsl(var(--chart-2))",
                        className: "drop-shadow-md",
                      }
                    : undefined
                }
                name="New Users"
              />
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
