"use client";

import { PageHeader } from "@/components/shared/PageHeader";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Welcome to the practice management portal."
      />
      <div className="bg-panel-bg p-8 rounded-xl border border-panel-border shadow-sm text-center">
        <p className="text-panel-muted mb-2">The full admin dashboard with the priority queue will be implemented in Module 11.</p>
        <p className="text-sm text-canvas-muted">Use the navigation menu to access Settings, Therapists, etc.</p>
      </div>
    </div>
  );
}
