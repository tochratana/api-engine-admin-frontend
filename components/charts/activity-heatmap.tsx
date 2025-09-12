"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  action: string;
  time: string;
  user: string;
}

interface ActivityHeatmapProps {
  recentActivity?: ActivityItem[];
  isLoading?: boolean;
}

export function ActivityHeatmap({
  recentActivity = [],
  isLoading = false,
}: ActivityHeatmapProps) {
  // Generate heatmap data from real activity
  const generateHeatmapFromActivity = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Initialize with zero activity
    const heatmapData = days.map((day) => ({
      day,
      hours: hours.map((hour) => ({
        hour,
        activity: 0,
        activities: [] as ActivityItem[],
      })),
    }));

    // Process real activity data
    recentActivity.forEach((activity) => {
      const activityDate = new Date(
        activity.time === "Recently" ? new Date() : activity.time
      );
      const dayIndex = (activityDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      const hour = activityDate.getHours();

      if (dayIndex < 7 && hour < 24) {
        const dayData = heatmapData[dayIndex];
        const hourData = dayData.hours[hour];
        hourData.activity = Math.min(hourData.activity + 1, 4); // Cap at level 4
        hourData.activities.push(activity);
      }
    });

    // Add some baseline activity for demo purposes if no real data
    if (recentActivity.length === 0) {
      heatmapData.forEach((day) => {
        day.hours.forEach((hour) => {
          // Simulate realistic activity patterns (more during work hours)
          const isWorkHour = hour.hour >= 9 && hour.hour <= 17;
          const isWeekend = day.day === "Sat" || day.day === "Sun";

          if (isWorkHour && !isWeekend) {
            hour.activity = Math.floor(Math.random() * 4) + 1;
          } else if (!isWeekend) {
            hour.activity = Math.floor(Math.random() * 3);
          } else {
            hour.activity = Math.floor(Math.random() * 2);
          }
        });
      });
    }

    return heatmapData;
  };

  const heatmapData = generateHeatmapFromActivity();

  // Calculate total activity for the week
  const totalActivity = heatmapData.reduce(
    (sum, day) =>
      sum + day.hours.reduce((daySum, hour) => daySum + hour.activity, 0),
    0
  );

  // Find peak activity time
  const peakActivity = heatmapData.reduce(
    (peak, day) => {
      const dayPeak = day.hours.reduce(
        (hourPeak, hour) =>
          hour.activity > hourPeak.activity
            ? { day: day.day, hour: hour.hour, activity: hour.activity }
            : hourPeak,
        { day: day.day, hour: 0, activity: 0 }
      );

      return dayPeak.activity > peak.activity ? dayPeak : peak;
    },
    { day: "", hour: 0, activity: 0 }
  );

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-slate-100 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50";
      case 1:
        return "bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm";
      case 2:
        return "bg-emerald-200 dark:bg-emerald-800/50 border border-emerald-300/50 dark:border-emerald-600/50 shadow-sm";
      case 3:
        return "bg-emerald-400 dark:bg-emerald-600/70 border border-emerald-500/50 dark:border-emerald-500/50 shadow-md";
      case 4:
        return "bg-emerald-500 dark:bg-emerald-500/90 border border-emerald-600/50 dark:border-emerald-400/50 shadow-lg";
      default:
        return "bg-slate-100 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50";
    }
  };

  const getActivityLabel = (level: number) => {
    switch (level) {
      case 0:
        return "No activity";
      case 1:
        return "Light activity";
      case 2:
        return "Moderate activity";
      case 3:
        return "High activity";
      case 4:
        return "Very high activity";
      default:
        return "No activity";
    }
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-blue-50/30 dark:from-emerald-900/10 dark:via-transparent dark:to-blue-900/10" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-semibold">Activity Heatmap</span>
              <p className="text-sm text-muted-foreground font-normal">
                Last 7 days activity pattern
              </p>
            </div>
          </CardTitle>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-muted-foreground">Total: </span>
              <span className="font-semibold">{totalActivity}</span>
            </div>
            {peakActivity.activity > 0 && (
              <div className="text-xs text-muted-foreground">
                Peak: {peakActivity.day} {formatTime(peakActivity.hour)}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-10 h-4 bg-muted animate-pulse rounded" />
                <div className="flex-1 grid grid-cols-24 gap-1">
                  {Array.from({ length: 24 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-muted animate-pulse rounded-sm"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Time labels */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-10" /> {/* Spacer for day labels */}
              <div className="flex-1 grid grid-cols-6 gap-1 text-center">
                <span>12 AM</span>
                <span>4 AM</span>
                <span>8 AM</span>
                <span>12 PM</span>
                <span>4 PM</span>
                <span>8 PM</span>
              </div>
            </div>

            {/* Heatmap grid */}
            <div className="space-y-2">
              {heatmapData.map((dayData, dayIndex) => (
                <div
                  key={dayData.day}
                  className="flex items-center space-x-2 group"
                >
                  <div className="w-10 text-sm font-medium text-muted-foreground text-right">
                    {dayData.day}
                  </div>
                  <div className="flex-1 grid grid-cols-24 gap-1">
                    {dayData.hours.map((hourData, hourIndex) => (
                      <div
                        key={hourData.hour}
                        className={cn(
                          "h-4 rounded-sm transition-all duration-200 hover:scale-110 hover:z-10 relative cursor-pointer",
                          getActivityColor(hourData.activity),
                          "hover:shadow-lg"
                        )}
                        title={`${dayData.day} ${formatTime(
                          hourData.hour
                        )}\n${getActivityLabel(hourData.activity)}${
                          hourData.activities.length > 0
                            ? `\n${
                                hourData.activities.length
                              } activities:\n${hourData.activities
                                .map((a) => `• ${a.action}`)
                                .join("\n")}`
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend and stats */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-muted-foreground">
                  Activity Level:
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Less</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "w-4 h-4 rounded-sm transition-all",
                          getActivityColor(level)
                        )}
                        title={getActivityLabel(level)}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">More</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Based on {recentActivity.length} recent activities
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
