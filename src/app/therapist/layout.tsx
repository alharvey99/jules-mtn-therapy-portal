import { StaffShell } from "@/components/shared/layout/StaffShell";

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell role="therapist">{children}</StaffShell>;
}
