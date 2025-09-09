"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HardDrive } from "lucide-react"

const data = [
  { category: "Projects", used: 12.5, quota: 20 },
  { category: "Users", used: 3.2, quota: 5 },
  { category: "System", used: 8.7, quota: 15 },
  { category: "Backups", used: 15.3, quota: 25 },
  { category: "Temp", used: 2.1, quota: 5 },
]

export function StorageUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HardDrive className="h-5 w-5" />
          <span>Storage Usage by Category</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" className="text-muted-foreground" fontSize={12} />
            <YAxis className="text-muted-foreground" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
              formatter={(value, name) => [`${value} GB`, name === "used" ? "Used" : "Quota"]}
            />
            <Bar dataKey="used" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Used" />
            <Bar dataKey="quota" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} opacity={0.3} name="Quota" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
