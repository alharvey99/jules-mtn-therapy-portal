"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/shared/forms/FormField";
import { TextareaInput } from "@/components/shared/forms/TextareaInput";
import { TextInput } from "@/components/shared/forms/TextInput";
import { CheckboxInput } from "@/components/shared/forms/CheckboxInput";
import { TimeInput } from "@/components/shared/forms/TimeInput";
import { SelectInput } from "@/components/shared/forms/SelectInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState, use } from "react";

export default function TherapistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <Link href="/admin/therapists" className="inline-flex items-center text-sm text-panel-muted hover:text-panel-text mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Therapists
        </Link>
        <PageHeader
          title="Dr. Sarah Jenkins"
          description="Manage profile, working hours, and leave requests."
        />
      </div>

      <div className="sm:hidden mb-4">
        <SelectInput
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
          options={[
            { value: "profile", label: "Profile & Specialisms" },
            { value: "hours", label: "Working Hours" },
            { value: "leave", label: "Leave Requests" }
          ]}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden sm:inline-flex mb-4 flex-wrap">
          <TabsTrigger value="profile">Profile & Specialisms</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
            <h3 className="text-lg font-medium">Profile Information</h3>
            <div className="space-y-6">
              <FormField label="Biography" htmlFor="bio">
                <TextareaInput id="bio" defaultValue="Dr. Jenkins is a clinical psychologist with 10 years of experience..." />
              </FormField>
              <FormField label="Qualifications" htmlFor="qualifications">
                <TextInput id="qualifications" defaultValue="PhD Clinical Psychology, BSc Psychology" />
              </FormField>
              <FormField label="Specialisms" htmlFor="specialisms">
                <TextInput id="specialisms" defaultValue="CBT, EMDR, Anxiety, Depression" placeholder="Comma separated list" />
              </FormField>
            </div>
            <div className="flex justify-end">
              <Button>Save Profile</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hours">
          <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
            <h3 className="text-lg font-medium">Standard Working Hours</h3>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className="flex items-center gap-4 p-4 border border-panel-border rounded-lg">
                  <div className="w-32">
                    <CheckboxInput label={day} checked={true} />
                  </div>
                  <div className="flex items-center gap-2">
                    <TimeInput defaultValue="09:00" />
                    <span className="text-panel-muted">to</span>
                    <TimeInput defaultValue="17:00" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button>Save Hours</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leave">
          <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
            <h3 className="text-lg font-medium">Leave Requests</h3>
            <div className="border border-panel-border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-contrast-bg text-canvas-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date Range</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-panel-border">
                  <tr className="hover:bg-contrast-bg/50">
                    <td className="px-4 py-3 font-medium">12 Aug 2026 - 15 Aug 2026</td>
                    <td className="px-4 py-3 text-panel-muted">Annual Leave</td>
                    <td className="px-4 py-3"><StatusBadge status="Pending" /></td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button variant="outline" size="sm">Reject</Button>
                      <Button size="sm">Approve</Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-contrast-bg/50">
                    <td className="px-4 py-3 font-medium">01 Jul 2026 - 02 Jul 2026</td>
                    <td className="px-4 py-3 text-panel-muted">Sick Leave</td>
                    <td className="px-4 py-3"><StatusBadge status="Approved" /></td>
                    <td className="px-4 py-3 text-right text-panel-muted">
                      Processed
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
