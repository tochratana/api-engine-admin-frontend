"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showNumber?: boolean
  className?: string
}

export function StarRating({ rating, maxRating = 5, size = "md", showNumber = false, className }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700",
            )}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-muted-foreground">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  )
}
