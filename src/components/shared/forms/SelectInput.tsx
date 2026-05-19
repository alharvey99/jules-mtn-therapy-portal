"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SelectInputProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
  error?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const SelectInput = React.forwardRef<HTMLButtonElement, SelectInputProps>(
  ({ id, value, onChange, options, placeholder, error, className, required, disabled, children }, ref) => {
    // If children are provided (meaning they are passing <option> tags), we need to extract them
    // to map to <SelectItem>. This is to keep backwards compatibility with existing usages
    // while upgrading to Radix UI Select.
    const renderItems = () => {
      if (options) {
        return options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ));
      }

      if (children) {
        const items: React.ReactNode[] = [];
        React.Children.forEach(children, (child) => {
          if (React.isValidElement(child) && child.type === 'option') {
            const { value, children: text } = child.props;
            if (value !== undefined) {
              items.push(
                <SelectItem key={value} value={value as string}>
                  {text}
                </SelectItem>
              );
            }
          }
        });
        return items;
      }
      return null;
    };

    return (
      <Select value={value} onValueChange={onChange} required={required} disabled={disabled}>
        <SelectTrigger
          id={id}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border bg-panel-bg px-3 py-2 text-sm text-panel-text focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            error ? "border-state-danger-text focus:ring-state-danger-text/20" : "border-panel-border",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {renderItems()}
        </SelectContent>
      </Select>
    )
  }
)
SelectInput.displayName = "SelectInput"
