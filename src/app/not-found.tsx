import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-canvas-bg">
      <div className="max-w-md w-full bg-panel-bg p-8 rounded-xl border border-panel-border shadow-sm text-center flex flex-col items-center gap-4">
        <PageHeader title="Page not found" />
        <p className="text-panel-muted">
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved or the link is incorrect.
        </p>
        <Link href="/" className="mt-4 block w-full">
          <Button className="w-full">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
