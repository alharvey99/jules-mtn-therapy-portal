"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Role determination landing.
    // In Phase 1 Demo, we'll just redirect to login immediately.
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-bg">
      <LoadingSpinner size="lg" label="Loading portal..." />
    </div>
  );
}
