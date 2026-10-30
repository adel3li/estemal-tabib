"use client";

import { supabaseBrowser } from "@/lib/supabase/client";

/** Where to go right after sign-in: /onboarding once (profile incomplete), else `next`. */
export async function destinationAfterLogin(next: string): Promise<string> {
  const sb = supabaseBrowser();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return next;
  const { data } = await sb.from("profiles").select("onboarded_at").eq("id", u.user.id).maybeSingle();
  return data?.onboarded_at ? next : `/onboarding?next=${encodeURIComponent(next)}`;
}
