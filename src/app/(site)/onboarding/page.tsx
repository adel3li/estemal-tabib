import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PROFILE_COLUMNS, type Profile } from "@/lib/auth/profile";
import { safeNext } from "@/lib/auth/next";
import { supabaseServer } from "@/lib/supabase/server";
import { OnboardingForm } from "./OnboardingForm";
import "../_auth/auth.css";

export const metadata: Metadata = { title: "كمّل بياناتك", robots: { index: false } };

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const next = safeNext(q.next);
  const supabase = await supabaseServer();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/onboarding?next=${next}`)}`);
  const { data } = await supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", userId).maybeSingle();
  const profile = data as Profile | null;
  // Shown once: already done → carry on.
  if (profile?.onboarded_at) redirect(next);
  // No profile row would be a bug in the sign-up trigger; don't loop through /login.
  if (!profile) redirect("/");

  return (
    <div className="au-root">
      <section className="au-wrap" style={{ maxWidth: 680 }}>
        <div className="au-card">
          <span className="au-icon">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h1 className="au-h1">أهلاً بيك! كمّل بياناتك</h1>
            <p className="au-lead">مرة واحدة بس. بنستخدمها علشان نكلمك على واتساب، ونملالك البيانات في «بيع جهازك» و«اطلب جهاز».</p>
          </div>
          <OnboardingForm profile={profile} next={next} />
        </div>
      </section>
    </div>
  );
}
