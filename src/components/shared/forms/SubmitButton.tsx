import * as React from "react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "../LoadingSpinner"

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ className, isLoading, loadingText = "Loading...", variant = "primary", children, ...props }, ref) => {

    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"

    const variants = {
      primary: "bg-action-primary text-action-primary-text hover:bg-action-primary-hover",
      secondary: "bg-action-secondary border border-action-secondary-border text-action-secondary-text hover:bg-contrast-bg",
      ghost: "text-action-ghost-text hover:bg-contrast-bg hover:text-contrast-text",
      danger: "bg-state-danger-text text-white hover:bg-state-danger-text/90"
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
        {isLoading ? loadingText : children}
      </button>
    )
  }
)
SubmitButton.displayName = "SubmitButton"
