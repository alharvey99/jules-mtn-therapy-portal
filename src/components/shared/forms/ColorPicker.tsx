"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TextInput } from "./TextInput";

interface ColorPickerProps {
  id?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ColorPicker({ id, defaultValue, value, onChange, className }: ColorPickerProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || value || "#0f172a");

  // Sync prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (newVal: string) => {
    setInternalValue(newVal);
    if (onChange) {
      onChange(newVal);
    }
  };

  return (
    <div className={cn("flex gap-3", className)}>
      <div className="relative">
        <input
          type="color"
          id={id}
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10"
          aria-label="Choose color"
        />
        <div
          className="h-10 w-10 rounded border border-panel-border p-1"
          style={{ backgroundColor: internalValue }}
          aria-hidden="true"
        />
      </div>
      <TextInput
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-1 uppercase"
        placeholder="#000000"
      />
    </div>
  );
}
