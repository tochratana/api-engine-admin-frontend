"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

const data = [
  { month: "Jan", avgRating: 4.2, totalRatings: 45 },
  { month: "Feb", avgRating: 4.3, totalRatings: 67 },
  { month: "Mar", avgRating: 4.1, totalRatings: 89 },
  { month: "Apr", avgRating: 4.5, totalRatings: 112 },
  { month: "May", avgRating: 4.7, totalRatings: 134 },
  { month: "Jun", avgRating: 4.8, totalRatings: 156 },
]

export function RatingTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5" />
          <span>Rating Trends</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
            <YAxis domain={[0, 5]} className="text-muted-foreground" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
              formatter={(value, name) => [
                name === "avgRating" ? `${value}/5` : value,
                name === "avgRating" ? "Average Rating" : "Total Ratings",
              ]}
            />
            <Area
              type="monotone"
              dataKey="avgRating"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
