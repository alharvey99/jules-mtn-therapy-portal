"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/forms/FormField";
import { TextInput } from "@/components/shared/forms/TextInput";
import { TextareaInput } from "@/components/shared/forms/TextareaInput";
import { CheckboxInput } from "@/components/shared/forms/CheckboxInput";
import { TimeInput } from "@/components/shared/forms/TimeInput";
import { Button } from "@/components/ui/button";

export default function TherapistProfilePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="My Profile"
        description="Manage your professional information and standard working hours."
      />

      <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
        <h3 className="text-lg font-medium">Professional Profile</h3>
        <div className="space-y-6">
          <FormField label="Biography" htmlFor="bio">
            <TextareaInput id="bio" defaultValue="I am a clinical psychologist specializing in cognitive behavioral therapy..." />
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

      <div className="bg-panel-bg p-6 rounded-xl border border-panel-border shadow-sm space-y-6">
        <h3 className="text-lg font-medium">Standard Working Hours</h3>
        <p className="text-sm text-panel-muted mb-4">
          These hours define your regular availability for booking. To request time off, please use the Leave section.
        </p>
        <div className="space-y-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-panel-border rounded-lg">
              <div className="w-32">
                <CheckboxInput label={day} checked={true} />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <TimeInput defaultValue="09:00" required />
                <span className="text-panel-muted">to</span>
                <TimeInput defaultValue="17:00" required />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button>Save Hours</Button>
        </div>
      </div>
    </div>
  );
}
