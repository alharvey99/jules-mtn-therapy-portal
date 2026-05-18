import { cn } from "@/lib/utils"

export function FormError({ message, id, className }: { message?: string, id?: string, className?: string }) {
  if (!message) return null;
  return (
    <div
      id={id}
      className={cn("p-3 text-sm rounded-md bg-state-danger-bg text-state-danger-text border border-state-danger-text/30", className)}
      role="alert"
    >
      {message}
    </div>
  )
}
