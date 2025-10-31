import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        success:
          "bg-[rgb(var(--success))]/10 text-[rgb(var(--success))] border border-[rgb(var(--success))]/20",
        warning:
          "bg-[rgb(var(--warning))]/10 text-[rgb(var(--warning))] border border-[rgb(var(--warning))]/20",
        error:
          "bg-[rgb(var(--error))]/10 text-[rgb(var(--error))] border border-[rgb(var(--error))]/20",
        info: "bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] border border-[rgb(var(--primary))]/20",
        default:
          "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))]",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="h-3 w-3">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
