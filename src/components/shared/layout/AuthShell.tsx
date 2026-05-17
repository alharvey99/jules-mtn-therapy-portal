import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface AuthShellProps {
  children: ReactNode;
  className?: string;
}

export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12">
      <main className={cn("w-full max-w-[640px] space-y-6", className)}>
        {children}
      </main>
    </div>
  )
}
