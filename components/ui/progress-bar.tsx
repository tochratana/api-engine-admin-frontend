"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "warning" | "danger"
}

export function ProgressBar({
  value,
  max,
  className,
  showLabel = false,
  size = "md",
  variant = "default",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  const getVariantColor = () => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-accent"
  }

  const variantColors = {
    default: "bg-accent",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  }

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span>{value.toFixed(1)} GB</span>
          <span className="text-muted-foreground">{max.toFixed(1)} GB</span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full transition-all duration-300 rounded-full",
            variant === "default" ? getVariantColor() : variantColors[variant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <div className="text-xs text-muted-foreground text-right">{percentage.toFixed(1)}% used</div>}
    </div>
  )
}
