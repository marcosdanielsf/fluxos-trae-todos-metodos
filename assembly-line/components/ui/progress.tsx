import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showPercentage?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showPercentage = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className="w-full space-y-1">
        <div
          ref={ref}
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--background-secondary))]",
            className
          )}
          {...props}
        >
          <div
            className="h-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && (
          <p className="text-xs text-[rgb(var(--foreground-secondary))] text-right">
            {Math.round(percentage)}%
          </p>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
