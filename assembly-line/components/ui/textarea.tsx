import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm ring-offset-background placeholder:text-[rgb(var(--foreground-secondary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))] focus-visible:ring-offset-0 focus-visible:border-[rgb(var(--primary))] focus-visible:shadow-[0_0_10px_rgba(74,125,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
            error && "border-[rgb(var(--error))] focus-visible:ring-[rgb(var(--error))]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[rgb(var(--error))]">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
