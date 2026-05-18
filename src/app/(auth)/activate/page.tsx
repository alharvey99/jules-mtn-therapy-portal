import { AuthShell } from "@/components/shared/layout/AuthShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ActivatePageProps {
  searchParams: Promise<{ state?: string }>;
}

export default async function ActivatePage({ searchParams }: ActivatePageProps) {
  const { state = "success" } = await searchParams;

  const content = {
    success: {
      title: "Signed in successfully",
      message: "Your account has been activated. You are being redirected...",
      buttonText: "Go to Dashboard",
      buttonHref: "/admin"
    },
    expired: {
      title: "Link expired",
      message: "This sign-in link has expired. Please request a new one or contact your practice if you continue to have issues.",
      buttonText: "Back to Login",
      buttonHref: "/login"
    },
    invalid: {
      title: "Invalid link",
      message: "This sign-in link is invalid or has already been used.",
      buttonText: "Back to Login",
      buttonHref: "/login"
    }
  };

  const { title, message, buttonText, buttonHref } = content[state as keyof typeof content] || content.invalid;

  return (
    <AuthShell>
      <div className="bg-panel-bg p-6 sm:p-8 rounded-xl border border-panel-border shadow-sm flex flex-col items-center gap-6 text-center">
        <PageHeader title={title} />
        <p className="text-panel-muted">
          {message}
        </p>
        <Button asChild className="w-full">
          <Link href={buttonHref}>{buttonText}</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
