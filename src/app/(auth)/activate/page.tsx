import { AuthShell } from "@/components/shared/layout/AuthShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { SubmitButton } from "@/components/shared/forms/SubmitButton";
import Link from "next/link";

interface ActivatePageProps {
  searchParams: { state?: string };
}

export default function ActivatePage({ searchParams }: ActivatePageProps) {
  const state = searchParams.state || "success";

  if (state === "success") {
    return (
      <AuthShell>
        <div className="bg-panel-bg p-6 sm:p-8 rounded-xl border border-panel-border shadow-sm flex flex-col items-center gap-6 text-center">
          <PageHeader title="Signed in successfully" />
          <p className="text-panel-muted">
            Your account has been activated. You are being redirected...
          </p>
          <Link href="/admin" className="w-full">
            <SubmitButton className="w-full">Go to Dashboard</SubmitButton>
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (state === "expired") {
    return (
      <AuthShell>
        <div className="bg-panel-bg p-6 sm:p-8 rounded-xl border border-panel-border shadow-sm flex flex-col items-center gap-6 text-center">
          <PageHeader title="Link expired" />
          <p className="text-panel-muted">
            This sign-in link has expired. Please request a new one or contact your practice if you continue to have issues.
          </p>
          <Link href="/login" className="w-full">
            <SubmitButton className="w-full">Back to Login</SubmitButton>
          </Link>
        </div>
      </AuthShell>
    );
  }

  // invalid
  return (
    <AuthShell>
      <div className="bg-panel-bg p-6 sm:p-8 rounded-xl border border-panel-border shadow-sm flex flex-col items-center gap-6 text-center">
        <PageHeader title="Invalid link" />
        <p className="text-panel-muted">
          This sign-in link is invalid or has already been used.
        </p>
        <Link href="/login" className="w-full">
          <SubmitButton className="w-full">Back to Login</SubmitButton>
        </Link>
      </div>
    </AuthShell>
  );
}
