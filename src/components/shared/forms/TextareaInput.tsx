import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextareaInput = React.forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border bg-panel-bg px-3 py-2 text-sm text-panel-text placeholder:text-panel-muted focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-state-danger-text focus:ring-state-danger-text/20" : "border-panel-border",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
TextareaInput.displayName = "TextareaInput"
