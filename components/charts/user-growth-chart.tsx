"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useFetchUsersQuery } from "@/lib/features/users/usersApi";

export function UserGrowthChart() {
  const { data: users = [], isLoading } = useFetchUsersQuery();

  const generateUserGrowthData = () => {
    if (!users.length) return [];

    const dailyData = new Map();
    const now = new Date();

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>User Growth (Daily)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>User Growth (Daily)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              className="text-muted-foreground"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
            />
            <YAxis className="text-muted-foreground" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
              name="Total Users"
            />
            <Line
              type="monotone"
              dataKey="newUsers"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
              name="New Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
