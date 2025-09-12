"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchRatingsQuery } from "@/lib/features/ratings/ratingsApi";
import { useMemo } from "react";

interface ChartData {
  month: string;
  avgRating: number;
  totalRatings: number;
  date: Date;
}

export function RatingTrendsChart() {
  // Fetch all ratings data - we'll process it to create monthly trends
  const {
    data: ratingsData,
    isLoading,
    error,
    refetch,
  } = useFetchRatingsQuery({ size: 1000 }); // Fetch more data to get historical trends

  // Process the ratings data to create monthly trends
  const chartData = useMemo(() => {
    if (!ratingsData?.ratings) return [];

    // Group ratings by month
    const monthlyData: { [key: string]: { ratings: number[]; count: number } } =
      {};
    const last6Months: ChartData[] = [];

    // Get current date and calculate last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      last6Months.push({
        month: monthName,
        avgRating: 0,
        totalRatings: 0,
        date: date,
      });

      monthlyData[monthKey] = { ratings: [], count: 0 };
    }

    // Process each rating
    ratingsData.ratings.forEach((rating) => {
      // Use createdAt if available, otherwise use current date
      const ratingDate = rating.createdAt
        ? new Date(rating.createdAt)
        : new Date();
      const monthKey = `${ratingDate.getFullYear()}-${String(
        ratingDate.getMonth() + 1
      ).padStart(2, "0")}`;

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].ratings.push(rating.rating || rating.star);
        monthlyData[monthKey].count++;
      }
    });

    // Calculate averages and update the chart data
    return last6Months.map((monthData) => {
      const monthKey = `${monthData.date.getFullYear()}-${String(
        monthData.date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthRatings = monthlyData[monthKey];

      if (monthRatings.count > 0) {
        const avgRating =
          monthRatings.ratings.reduce((sum, rating) => sum + rating, 0) /
          monthRatings.count;
        return {
          ...monthData,
          avgRating: Number(avgRating.toFixed(1)),
          totalRatings: monthRatings.count,
        };
      }

      return monthData;
    });
  }, [ratingsData]);

  // Calculate trend indicators
  const trendData = useMemo(() => {
    if (chartData.length < 2) return null;

    const lastMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];

    const ratingTrend = lastMonth.avgRating - previousMonth.avgRating;
    const volumeTrend = lastMonth.totalRatings - previousMonth.totalRatings;

    return {
      ratingTrend: Number(ratingTrend.toFixed(1)),
      volumeTrend,
      isRatingUp: ratingTrend > 0,
      isVolumeUp: volumeTrend > 0,
    };
  }, [chartData]);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Rating Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Rating Trends</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load rating trends data. Please try refreshing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Rating Trends</span>
          </div>
          <div className="flex items-center space-x-2">
            {trendData && (
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <TrendingUp
                    className={`h-3 w-3 ${
                      trendData.isRatingUp ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span
                    className={
                      trendData.isRatingUp ? "text-green-600" : "text-red-600"
                    }
                  >
                    {trendData.isRatingUp ? "+" : ""}
                    {trendData.ratingTrend}
                  </span>
                </div>
                <div className="text-xs">
                  {trendData.volumeTrend > 0 ? "+" : ""}
                  {trendData.volumeTrend} reviews
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No rating data available</p>
              <p className="text-sm">Start collecting reviews to see trends</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-muted-foreground"
                fontSize={12}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                domain={[0, 5]}
                className="text-muted-foreground"
                fontSize={12}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value, name) => {
                  if (name === "avgRating") {
                    return [`${value}/5`, "Average Rating"];
                  }
                  return [value, "Total Ratings"];
                }}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="avgRating"
                stroke="hsl(var(--chart-1, 220 70% 50%))"
                fill="hsl(var(--chart-1, 220 70% 50%))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="totalRatings"
                stroke="hsl(var(--chart-2, 160 60% 45%))"
                fill="hsl(var(--chart-2, 160 60% 45%))"
                fillOpacity={0.1}
                strokeWidth={1}
                yAxisId="right"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">
                {chartData.reduce((sum, month) => sum + month.totalRatings, 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold">
                {chartData.length > 0
                  ? (
                      chartData.reduce(
                        (sum, month) => sum + month.avgRating,
                        0
                      ) / chartData.filter((d) => d.avgRating > 0).length || 0
                    ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">
                {chartData[chartData.length - 1]?.totalRatings || 0}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
