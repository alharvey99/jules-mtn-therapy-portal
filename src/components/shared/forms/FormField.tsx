import { ReactNode, useId } from "react"

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export function FormField({ label, htmlFor, error, children, required }: FormFieldProps) {
  const generatedId = useId();
  const fieldId = htmlFor || generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={fieldId} className="text-sm font-medium text-panel-text">
        {label} {required && <span className="text-state-danger-text">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-state-danger-text mt-1">{error}</p>}
    </div>
  )
}
