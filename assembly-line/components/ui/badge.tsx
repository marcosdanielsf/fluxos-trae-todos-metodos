import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))]",
        success:
          "bg-[rgb(var(--success))]/10 text-[rgb(var(--success))] border border-[rgb(var(--success))]/20",
        warning:
          "bg-[rgb(var(--warning))]/10 text-[rgb(var(--warning))] border border-[rgb(var(--warning))]/20",
        error:
          "bg-[rgb(var(--error))]/10 text-[rgb(var(--error))] border border-[rgb(var(--error))]/20",
        info:
          "bg-[rgb(var(--info))]/10 text-[rgb(var(--info))] border border-[rgb(var(--info))]/20",
        phase1:
          "bg-[rgb(var(--phase1))]/10 text-[rgb(var(--phase1))] border border-[rgb(var(--phase1))]/20 glow-phase1",
        phase2:
          "bg-[rgb(var(--phase2))]/10 text-[rgb(var(--phase2))] border border-[rgb(var(--phase2))]/20 glow-phase2",
        phase3:
          "bg-[rgb(var(--phase3))]/10 text-[rgb(var(--phase3))] border border-[rgb(var(--phase3))]/20 glow-phase3",
        phase4:
          "bg-[rgb(var(--phase4))]/10 text-[rgb(var(--phase4))] border border-[rgb(var(--phase4))]/20 glow-phase4",
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
