"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const data = [
  { month: "Jan", users: 400, newUsers: 45 },
  { month: "Feb", users: 520, newUsers: 120 },
  { month: "Mar", users: 680, newUsers: 160 },
  { month: "Apr", users: 890, newUsers: 210 },
  { month: "May", users: 1050, newUsers: 160 },
  { month: "Jun", users: 1234, newUsers: 184 },
]

export function UserGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>User Growth</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
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
  )
}
