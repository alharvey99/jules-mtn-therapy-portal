"use client";

import { useState } from "react";
import { AuthShell } from "@/components/shared/layout/AuthShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/forms/FormField";
import { TextInput } from "@/components/shared/forms/TextInput";
import { TextareaInput } from "@/components/shared/forms/TextareaInput";
import { SelectInput } from "@/components/shared/forms/SelectInput";
import { ColorPicker } from "@/components/shared/forms/ColorPicker";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminOnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [cancelNotice, setCancelNotice] = useState("48");
  const [bufferTime, setBufferTime] = useState("10");

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/admin/settings");
    }
  };

  return (
    <AuthShell>
      <div className="bg-panel-bg p-6 sm:p-8 rounded-xl border border-panel-border shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-colors ${
                  s <= step ? "bg-action-primary" : "bg-panel-border"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-panel-muted">Step {step} of 3</span>
        </div>

        <form onSubmit={handleNext} className="flex flex-col gap-6">
          {step === 1 && (
            <>
              <PageHeader
                title="Practice Details"
                description="Review or update your practice information."
              />
              <FormField label="Practice Name" htmlFor="practiceName">
                <TextInput id="practiceName" defaultValue="Canterbury Therapy Clinic" />
              </FormField>
              <FormField label="Address" htmlFor="address">
                <TextareaInput id="address" placeholder="123 Main St" />
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <PageHeader
                title="Branding"
                description="Customise how the portal looks for your clients."
              />
              <FormField label="Primary Colour" htmlFor="primaryColor">
                <ColorPicker id="primaryColor" defaultValue="#0f172a" />
              </FormField>
              <FormField label="Logo URL" htmlFor="logoUrl">
                <TextInput id="logoUrl" placeholder="https://..." />
              </FormField>
            </>
          )}

          {step === 3 && (
            <>
              <PageHeader
                title="Policy Defaults"
                description="Set the standard policies for your practice."
              />
              <FormField label="Cancellation Notice (Hours)" htmlFor="cancelNotice">
                <SelectInput
                  id="cancelNotice"
                  value={["24", "48", "72"].includes(cancelNotice) ? cancelNotice : "custom"}
                  onChange={(val) => setCancelNotice(val === "custom" ? "" : val)}
                  options={[
                    { value: "24", label: "24" },
                    { value: "48", label: "48" },
                    { value: "72", label: "72" },
                    { value: "custom", label: "custom" }
                  ]}
                />
                {!["24", "48", "72"].includes(cancelNotice) && (
                  <TextInput type="number" value={cancelNotice} onChange={(e) => setCancelNotice(e.target.value)} placeholder="Custom hours" className="mt-2" />
                )}
              </FormField>
              <FormField label="Buffer Time (Minutes)" htmlFor="bufferTime">
                <SelectInput
                  id="bufferTime"
                  value={["10", "15", "30"].includes(bufferTime) ? bufferTime : "custom"}
                  onChange={(val) => setBufferTime(val === "custom" ? "" : val)}
                  options={[
                    { value: "10", label: "10" },
                    { value: "15", label: "15" },
                    { value: "30", label: "30" },
                    { value: "custom", label: "custom" }
                  ]}
                />
                {!["10", "15", "30"].includes(bufferTime) && (
                  <TextInput type="number" value={bufferTime} onChange={(e) => setBufferTime(e.target.value)} placeholder="Custom minutes" className="mt-2" />
                )}
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
              <Button type="button" variant="secondary" onClick={() => handleNext()}>
                Skip
              </Button>
              <Button type="submit">
                {step === 3 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
