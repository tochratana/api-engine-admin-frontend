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
  // Generate GitHub-style heatmap (full year)
  const generateGitHubStyleHeatmap = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    // Calculate start date (52 weeks ago from today)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 52 * 7);
    // Adjust to start from Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Initialize grid: 7 rows (days of week) x 53 columns (weeks)
    const grid = days.map((day, dayIndex) => ({
      day,
      dayIndex,
      weeks: [] as Array<{
        date: Date;
        activity: number;
        activities: ActivityItem[];
        isCurrentMonth: boolean;
      }>,
    }));

    // Fill the grid with all dates for 53 weeks
    for (let week = 0; week < 53; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + week * 7 + day);

        // Only add dates up to today
        if (date <= today) {
          grid[day].weeks.push({
            date: new Date(date),
            activity: 0,
            activities: [],
            isCurrentMonth: date.getMonth() === today.getMonth(),
          });
        }
      }
    }

    // Process real activity data
    recentActivity.forEach((activity) => {
      const activityDate = new Date(
        activity.time === "Recently" ? new Date() : activity.time
      );

      const dayOfWeek = activityDate.getDay();

      // Find matching date in grid
      const dayRow = grid[dayOfWeek];
      const matchingCell = dayRow.weeks.find((cell) => {
        return (
          cell.date.getFullYear() === activityDate.getFullYear() &&
          cell.date.getMonth() === activityDate.getMonth() &&
          cell.date.getDate() === activityDate.getDate()
        );
      });

      if (matchingCell) {
        matchingCell.activity = Math.min(matchingCell.activity + 1, 4);
        matchingCell.activities.push(activity);
      }
    });

    // Add demo data if no real activity (optional - remove if you want)
    if (recentActivity.length === 0) {
      grid.forEach((row) => {
        row.weeks.forEach((cell) => {
          const isWeekend =
            cell.date.getDay() === 0 || cell.date.getDay() === 6;
          const isPast = cell.date < today;
          const randomChance = Math.random();

          if (isPast && randomChance > 0.3) {
            if (!isWeekend) {
              cell.activity = Math.floor(Math.random() * 5);
            } else {
              cell.activity = Math.floor(Math.random() * 3);
            }
          }
        });
      });
    }

    return grid;
  };

  const heatmapData = generateGitHubStyleHeatmap();

  // Calculate total activity
  const totalActivity = heatmapData.reduce(
    (sum, row) =>
      sum + row.weeks.reduce((weekSum, cell) => weekSum + cell.activity, 0),
    0
  );

  // Calculate active days
  const activeDays = heatmapData.reduce(
    (count, row) =>
      count + row.weeks.filter((cell) => cell.activity > 0).length,
    0
  );

  // Calculate current streak
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const dayOfWeek = checkDate.getDay();
      const dayRow = heatmapData[dayOfWeek];
      const cell = dayRow?.weeks.find((c) => {
        return (
          c.date.getFullYear() === checkDate.getFullYear() &&
          c.date.getMonth() === checkDate.getMonth() &&
          c.date.getDate() === checkDate.getDate()
        );
      });

      if (cell && cell.activity > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-slate-100 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50";
      case 1:
        return "bg-emerald-200 dark:bg-emerald-900/40 border border-emerald-300/50 dark:border-emerald-700/50";
      case 2:
        return "bg-emerald-300 dark:bg-emerald-700/60 border border-emerald-400/50 dark:border-emerald-600/50";
      case 3:
        return "bg-emerald-500 dark:bg-emerald-600/80 border border-emerald-600/50 dark:border-emerald-500/50";
      case 4:
        return "bg-emerald-600 dark:bg-emerald-500 border border-emerald-700/50 dark:border-emerald-400/50";
      default:
        return "bg-slate-100 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50";
    }
  };

  const getActivityLabel = (level: number) => {
    switch (level) {
      case 0:
        return "No activity";
      case 1:
        return "1-2 activities";
      case 2:
        return "3-5 activities";
      case 3:
        return "6-10 activities";
      case 4:
        return "10+ activities";
      default:
        return "No activity";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMonthLabels = () => {
    if (heatmapData.length === 0 || heatmapData[0].weeks.length === 0)
      return [];

    const labels: Array<{ month: string; startIndex: number }> = [];
    let currentMonth = -1;

    heatmapData[0].weeks.forEach((cell, index) => {
      const month = cell.date.getMonth();
      if (month !== currentMonth) {
        currentMonth = month;
        labels.push({
          month: cell.date.toLocaleDateString("en-US", { month: "short" }),
          startIndex: index,
        });
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-blue-50/30 dark:from-emerald-900/10 dark:via-transparent dark:to-blue-900/10" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-semibold">Activity Graph</span>
              <p className="text-sm text-muted-foreground font-normal">
                {activeDays} contributions in the last year
              </p>
            </div>
          </CardTitle>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-muted-foreground">Total: </span>
              <span className="font-semibold">{totalActivity}</span>
            </div>
            {currentStreak > 0 && (
              <div className="text-xs text-muted-foreground">
                🔥 {currentStreak} day streak
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading activity...
            </div>
          </div>
        ) : (
          <>
            {/* Month labels */}
            <div className="flex items-start space-x-2">
              <div className="w-8" />
              <div className="flex-1 relative" style={{ height: "16px" }}>
                {monthLabels.map((label, index) => (
                  <div
                    key={index}
                    className="absolute text-xs text-muted-foreground font-medium"
                    style={{
                      left: `${
                        (label.startIndex /
                          (heatmapData[0]?.weeks.length || 1)) *
                        100
                      }%`,
                    }}
                  >
                    {label.month}
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub-style grid */}
            <div className="flex items-start space-x-2 overflow-x-auto pb-2">
              {/* Day labels */}
              <div className="flex flex-col space-y-1 text-xs text-muted-foreground w-8 pt-1 flex-shrink-0">
                <div className="h-3" />
                <div className="h-3">Mon</div>
                <div className="h-3" />
                <div className="h-3">Wed</div>
                <div className="h-3" />
                <div className="h-3">Fri</div>
                <div className="h-3" />
              </div>

              {/* Activity grid */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex flex-col space-y-1">
                  {heatmapData.map((row, rowIndex) => (
                    <div key={row.day} className="flex space-x-1">
                      {row.weeks.map((cell, cellIndex) => (
                        <div
                          key={cellIndex}
                          className={cn(
                            "w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer flex-shrink-0",
                            getActivityColor(cell.activity),
                            "hover:shadow-lg hover:ring-2 hover:ring-emerald-400/50"
                          )}
                          title={`${formatDate(cell.date)}\n${getActivityLabel(
                            cell.activity
                          )}${
                            cell.activities.length > 0
                              ? `\n\n${
                                  cell.activities.length
                                } activities:\n${cell.activities
                                  .slice(0, 5)
                                  .map((a) => `• ${a.action}`)
                                  .join("\n")}${
                                  cell.activities.length > 5
                                    ? `\n... and ${
                                        cell.activities.length - 5
                                      } more`
                                    : ""
                                }`
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-muted-foreground">Less</span>
                <div className="flex space-x-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "w-3 h-3 rounded-sm transition-all",
                        getActivityColor(level)
                      )}
                      title={getActivityLabel(level)}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">More</span>
              </div>

              <div className="text-xs text-muted-foreground">
                {recentActivity.length > 0
                  ? `${recentActivity.length} activities tracked`
                  : "Demo data shown"}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
