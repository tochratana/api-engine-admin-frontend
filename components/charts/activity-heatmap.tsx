"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const generateHeatmapData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return days.map((day) => ({
    day,
    hours: hours.map((hour) => ({
      hour,
      activity: Math.floor(Math.random() * 5), // 0-4 activity levels
    })),
  }))
}

export function ActivityHeatmap() {
  const data = generateHeatmapData()

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-muted"
      case 1:
        return "bg-chart-1/20"
      case 2:
        return "bg-chart-1/40"
      case 3:
        return "bg-chart-1/60"
      case 4:
        return "bg-chart-1/80"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Activity Heatmap (Last 7 Days)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-4">
            <span>12 AM</span>
            <div className="flex-1 grid grid-cols-12 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="text-center">
                  {i * 2 || "12"}
                </div>
              ))}
            </div>
            <span>11 PM</span>
          </div>

          {data.map((dayData) => (
            <div key={dayData.day} className="flex items-center space-x-2">
              <div className="w-8 text-xs text-muted-foreground">{dayData.day}</div>
              <div className="flex-1 grid grid-cols-24 gap-1">
                {dayData.hours.map((hourData) => (
                  <div
                    key={hourData.hour}
                    className={cn("h-3 rounded-sm", getActivityColor(hourData.activity))}
                    title={`${dayData.day} ${hourData.hour}:00 - Activity Level: ${hourData.activity}`}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
            <span>Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={cn("w-3 h-3 rounded-sm", getActivityColor(level))} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
