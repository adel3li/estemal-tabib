"use client";

import { ProfileForm } from "@/components/account/ProfileForm";
import type { Profile } from "@/lib/auth/AuthProvider";

export function OnboardingForm({ profile, next }: { profile: Profile; next: string }) {
  return (
    <ProfileForm
      profile={profile}
      submitLabel="احفظ وكمّل"
      // Full navigation so the proxy sees the finished profile.
      onSaved={() => window.location.replace(next)}
    />
  );
}
