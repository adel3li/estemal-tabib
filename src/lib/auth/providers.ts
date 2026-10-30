import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/** Is Google sign-in switched on in Supabase? (Auth → Providers → Google.) */
export async function googleEnabled(): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_ANON_KEY },
      next: { revalidate: 300 },
    });
    if (!res.ok) return false;
    const s = (await res.json()) as { external?: Record<string, boolean> };
    return Boolean(s.external?.google);
  } catch {
    return false;
  }
}
