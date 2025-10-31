import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <select
            className={cn(
              "flex h-10 w-full rounded-lg border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))] focus-visible:ring-offset-0 focus-visible:border-[rgb(var(--primary))] focus-visible:shadow-[0_0_10px_rgba(74,125,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer",
              error && "border-[rgb(var(--error))] focus-visible:ring-[rgb(var(--error))]",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1 text-xs text-[rgb(var(--error))]">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
