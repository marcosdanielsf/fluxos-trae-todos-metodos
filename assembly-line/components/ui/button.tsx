import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow hover:bg-[rgb(var(--primary))]/90 hover:shadow-lg hover:scale-[1.02]",
        secondary:
          "bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] shadow hover:bg-[rgb(var(--secondary))]/90 hover:shadow-lg hover:scale-[1.02]",
        outline:
          "border border-[rgb(var(--border))] bg-transparent hover:bg-[rgb(var(--card))] hover:border-[rgb(var(--primary))]",
        ghost: "hover:bg-[rgb(var(--card))] hover:text-[rgb(var(--foreground))]",
        success:
          "bg-[rgb(var(--success))] text-white shadow hover:bg-[rgb(var(--success))]/90",
        destructive:
          "bg-[rgb(var(--destructive))] text-[rgb(var(--destructive-foreground))] shadow hover:bg-[rgb(var(--destructive))]/90",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "leading" | "trailing";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      icon,
      iconPosition = "leading",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && icon && iconPosition === "leading" && icon}
        {children}
        {!loading && icon && iconPosition === "trailing" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
