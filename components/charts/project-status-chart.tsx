"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"

const data = [
  { name: "Active", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Completed", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Inactive", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Archived", value: 10, color: "hsl(var(--chart-4))" },
]

export function ProjectStatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FolderOpen className="h-5 w-5" />
          <span>Project Status Distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
