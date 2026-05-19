import { StaffShell } from "@/components/shared/layout/StaffShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell role="admin">{children}</StaffShell>;
}
