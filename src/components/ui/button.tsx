import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-action-primary text-action-primary-text hover:bg-action-primary-hover",
        destructive:
          "bg-state-danger-bg text-state-danger-text hover:bg-state-danger-bg/90",
        outline:
          "border border-panel-border bg-panel-bg hover:bg-contrast-bg hover:text-contrast-text",
        secondary:
          "bg-action-secondary-bg border border-action-secondary-border text-action-secondary-text hover:bg-contrast-bg",
        ghost: "text-action-ghost-text hover:bg-contrast-bg hover:text-contrast-text",
        link: "text-action-primary-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || isLoading

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />}
        {isLoading && loadingText ? loadingText : children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
