import * as React from "react"
import { cn } from "@/lib/utils"

export interface ColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ className, error, onChange, ...props }, ref) => {
    const [color, setColor] = React.useState(props.value as string || props.defaultValue as string || "#000000");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setColor(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative inline-flex items-center gap-2">
        <label
          className={cn(
            "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border p-1 transition-colors focus-within:ring-2 focus-within:ring-action-primary focus-within:ring-offset-2",
            error ? "border-state-danger-text focus-within:ring-state-danger-text/20" : "border-panel-border",
            className
          )}
          title="Pick a color"
        >
          <input
            type="color"
            className="absolute opacity-0 w-0 h-0"
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          <div
            className="h-full w-full rounded-[2px]"
            style={{ backgroundColor: props.value as string || color }}
            aria-hidden="true"
          />
        </label>
      </div>
    )
  }
)
ColorPicker.displayName = "ColorPicker"
