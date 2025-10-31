import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="checkbox"
            className="peer h-4 w-4 shrink-0 rounded border border-[rgb(var(--input))] bg-[rgb(var(--background))] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none checked:bg-[rgb(var(--primary))] checked:border-[rgb(var(--primary))]"
            ref={ref}
            {...props}
          />
          <Check className="absolute left-0 top-0 h-4 w-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
