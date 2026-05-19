import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border bg-panel-bg px-3 py-2 text-sm text-panel-text focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          error ? "border-state-danger-text focus:ring-state-danger-text/20" : "border-panel-border",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
SelectInput.displayName = "SelectInput"
