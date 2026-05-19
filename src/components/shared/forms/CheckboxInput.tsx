"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckboxInputProps {
  id?: string;
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function CheckboxInput({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: CheckboxInputProps) {
  const generatedId = React.useId();
  const fieldId = id || generatedId;

  return (
    <div className={cn("items-top flex space-x-2", className)}>
      <Checkbox
        id={fieldId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-1"
      />
      <div className="grid leading-none gap-1.5">
        <label
          htmlFor={fieldId}
          className="text-sm font-medium leading-none text-panel-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-panel-muted">{description}</p>
        )}
      </div>
    </div>
  );
}
