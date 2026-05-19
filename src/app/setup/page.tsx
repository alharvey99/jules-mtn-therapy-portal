"use client";

import { useState } from "react";
import { AuthShell } from "@/components/shared/layout/AuthShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/forms/FormField";
import { TextInput } from "@/components/shared/forms/TextInput";
import { SubmitButton } from "@/components/shared/forms/SubmitButton";
import { SelectInput } from "@/components/shared/forms/SelectInput";

export default function PracticeSetupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Admin Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Step 2: Practice Basics
  const [practiceName, setPracticeName] = useState("");
  const [timezone, setTimezone] = useState("Europe/London");

  // Step 3: Contact Details
  const [phone, setPhone] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        console.log("Demo: Setup Complete! Redirecting to dashboard...");
        // window.location.href = "/admin";
      }, 1000);
    }
  };

  return (
    <AuthShell>
      <div className="bg-panel-bg p-6 sm:p-8 rounded-xl border border-panel-border shadow-sm flex flex-col gap-6">

        {/* Progress Indicator */}
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
                title="Create the primary admin account"
                description="This account will have full access to configure the practice."
              />
              <FormField label="Full name" htmlFor="name" required>
                <TextInput
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Jane Smith"
                />
              </FormField>
              <FormField label="Email address" htmlFor="email" required>
                <TextInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@practice.com"
                />
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <PageHeader
                title="Practice Basics"
                description="Tell us about your practice. You can change this later."
              />
              <FormField label="Practice Name" htmlFor="practiceName">
                <TextInput
                  id="practiceName"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  placeholder="e.g. Canterbury Therapy Clinic"
                />
              </FormField>
              <FormField label="Timezone" htmlFor="timezone">
                <SelectInput
                  id="timezone"
                  value={timezone}
                  onChange={(val) => setTimezone(val)}
                  options={[{ value: "Europe/London", label: "Europe/London (GMT/BST)" }]}
                />
              </FormField>
            </>
          )}

          {step === 3 && (
            <>
              <PageHeader
                title="Practice Contact Details"
                description="This will be shown to clients in emails and on their portal."
              />
              <FormField label="Public Phone Number" htmlFor="phone">
                <TextInput
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01227 123456"
                />
              </FormField>
            </>
          )}

          <div className="flex justify-between items-center mt-4">
            {step > 1 ? (
              <SubmitButton
                type="button"
                variant="ghost"
                onClick={() => setStep(step - 1)}
              >
                Back
              </SubmitButton>
            ) : <div />}

            <div className="flex gap-3">
              {step > 1 && step < 3 && (
                <SubmitButton
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(step + 1)}
                >
                  Skip
                </SubmitButton>
              )}
              {step === 3 && (
                <SubmitButton
                  type="button"
                  variant="secondary"
                  onClick={() => handleNext({ preventDefault: () => {} } as React.FormEvent)}
                >
                  Skip
                </SubmitButton>
              )}
              <SubmitButton type="submit" isLoading={loading}>
                {step === 3 ? "Complete Setup" : "Continue"}
              </SubmitButton>
            </div>
          </div>
        </form>

      </div>
    </AuthShell>
  );
}
