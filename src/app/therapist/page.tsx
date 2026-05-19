"use client";

import { PageHeader } from "@/components/shared/PageHeader";

export default function TherapistDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Therapist Dashboard"
        description="Welcome to your portal."
      />
      <div className="bg-panel-bg p-8 rounded-xl border border-panel-border shadow-sm text-center">
        <p className="text-panel-muted mb-2">The full therapist dashboard with today&apos;s appointments will be implemented in Module 10.</p>
        <p className="text-sm text-canvas-muted">Use the navigation menu to access your Profile, Leave requests, etc.</p>
      </div>
    </div>
  );
}
