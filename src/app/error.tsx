"use client";

import { useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { SubmitButton } from '@/components/shared/forms/SubmitButton';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-canvas-bg">
      <div className="max-w-md w-full bg-panel-bg p-8 rounded-xl border border-panel-border shadow-sm text-center flex flex-col items-center gap-4">
        <PageHeader title="Something went wrong" />
        <p className="text-panel-muted">
          An unexpected error occurred. We&apos;ve logged this issue. Please try again.
        </p>
        <SubmitButton onClick={() => reset()} className="mt-4 w-full">
          Try again
        </SubmitButton>
      </div>
    </div>
  );
}
