"use client";

import { useState } from "react";
import { AuthShell } from "@/components/shared/layout/AuthShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/forms/FormField";
import { TextInput } from "@/components/shared/forms/TextInput";
import { SubmitButton } from "@/components/shared/forms/SubmitButton";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  const handleGoogleSSO = () => {
    // Demo: no-op
  };

  return (
    <AuthShell>
      <div className="bg-panel-bg p-6 sm:p-8 rounded-xl border border-panel-border shadow-sm flex flex-col gap-6">
        <PageHeader
          title="Sign in to your account"
          description="Enter your email to receive a magic link, or sign in with Google."
        />

        {sent ? (
          <div className="text-center p-4 bg-action-primary/10 rounded-lg border border-action-primary/20">
            <p className="text-panel-text font-medium">Check your email</p>
            <p className="text-sm text-panel-muted mt-2">
              We&apos;ve sent a magic link to <strong>{email}</strong>. Click the link to sign in.
            </p>
            <Button type="button" variant="ghost" className="mt-4" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-6">
            <FormField label="Email address" htmlFor="email" required>
              <TextInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </FormField>

            <SubmitButton type="submit" isLoading={loading} className="w-full">
              Send Magic Link
            </SubmitButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-panel-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-panel-bg px-2 text-panel-muted">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleGoogleSSO}
              className="w-full"
            >
              Sign in with Google
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
