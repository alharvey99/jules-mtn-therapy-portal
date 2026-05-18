import { cn } from "@/lib/utils"

export interface InlineAlertProps {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export function InlineAlert({ title, description, variant = 'info', className }: InlineAlertProps) {
  const variantStyles = {
    info: 'bg-state-info-bg text-state-info-text border-state-info-text/30',
    success: 'bg-state-success-bg text-state-success-text border-state-success-text/30',
    warning: 'bg-state-warning-bg text-state-warning-text border-state-warning-text/30',
    error: 'bg-state-danger-bg text-state-danger-text border-state-danger-text/30',
  }

  return (
    <div className={cn("p-4 rounded-md border text-sm flex flex-col gap-1", variantStyles[variant], className)} role="alert">
      <div className="font-semibold">{title}</div>
      {description && <div className="opacity-90">{description}</div>}
    </div>
  )
}
