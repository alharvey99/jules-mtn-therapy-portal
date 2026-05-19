import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
      case "completed":
        return "bg-state-success-bg text-state-success-text";
      case "pending":
      case "invited":
      case "in_progress":
        return "bg-state-warning-bg text-state-warning-text";
      case "archived":
      case "rejected":
      case "cancelled":
      case "expired":
      case "deactivated":
        return "bg-state-danger-bg text-state-danger-text";
      default:
        return "bg-contrast-bg text-panel-muted";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium pointer-events-none capitalize",
        getStatusStyles(),
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
