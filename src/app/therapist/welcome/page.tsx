"use client";

import { useState } from "react";
import { AuthShell } from "@/components/shared/layout/AuthShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/forms/FormField";
import { TextInput } from "@/components/shared/forms/TextInput";
import { TextareaInput } from "@/components/shared/forms/TextareaInput";
import { CheckboxInput } from "@/components/shared/forms/CheckboxInput";
import { TimeInput } from "@/components/shared/forms/TimeInput";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TherapistOnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      router.push("/therapist/schedule");
    }
  };

  return (
    <AuthShell>
      <div className="bg-panel-bg p-6 sm:p-8 rounded-xl border border-panel-border shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s <= step ? "bg-action-primary" : "bg-panel-border"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-panel-muted">Step {step} of 2</span>
        </div>

        <form onSubmit={handleNext} className="flex flex-col gap-6">
          {step === 1 && (
            <>
              <PageHeader
                title="Working Hours"
                description="Set your standard availability. You can adjust these later or add specific leave periods."
              />
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
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
            </>
          )}

          {step === 2 && (
            <>
              <PageHeader
                title="Professional Profile"
                description="This information may be visible to clients to help them understand your approach."
              />
              <FormField label="Biography" htmlFor="bio">
                <TextareaInput id="bio" placeholder="Write a brief professional biography..." />
              </FormField>
              <FormField label="Qualifications" htmlFor="qualifications">
                <TextInput id="qualifications" placeholder="e.g. PhD Clinical Psychology" />
              </FormField>
              <FormField label="Specialisms" htmlFor="specialisms">
                <TextInput id="specialisms" placeholder="e.g. CBT, EMDR, Anxiety (Comma separated)" />
              </FormField>
            </>
          )}

          <div className="flex justify-between items-center mt-4">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : <div />}

            <div className="flex gap-3">
              {step === 2 && (
                <Button type="button" variant="secondary" onClick={() => handleNext()}>
                  Skip
                </Button>
              )}
              <Button type="submit">
                {step === 2 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
