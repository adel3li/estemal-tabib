"use client";

// Signed-in state for client components (header menu, form pre-fill).
// Reads the session from cookies (no network), then loads the profile row.
// Page protection is NOT done here — that's src/middleware.ts + RLS.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";
import { PROFILE_COLUMNS, type Profile } from "./profile";

export type { AccountType, Profile } from "./profile";

type AuthApi = {
  /** false until the session (and profile, if any) has been read. */
  ready: boolean;
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const load = useCallback(async (id: string | null) => {
    if (!id) {
      setProfile(null);
      return;
    }
    const { data } = await supabaseBrowser().from("profiles").select(PROFILE_COLUMNS).eq("id", id).maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, []);

  useEffect(() => {
    // Env vars missing on this deployment: behave as signed out, don't crash the site.
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fallback
      setReady(true);
      return;
    }
    const sb = supabaseBrowser();
    let alive = true;
    sb.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      if (!alive) return;
      setUserId(u?.id ?? null);
      setEmail(u?.email ?? null);
      await load(u?.id ?? null);
      if (alive) setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
      const u = session?.user ?? null;
      setUserId(u?.id ?? null);
      setEmail(u?.email ?? null);
      // Don't await inside the callback (supabase-js deadlock guidance).
      setTimeout(() => void load(u?.id ?? null), 0);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [load]);

  const refresh = useCallback(() => load(userId), [load, userId]);

  const signOut = useCallback(async () => {
    await supabaseBrowser().auth.signOut();
    setUserId(null);
    setEmail(null);
    setProfile(null);
  }, []);

  const api = useMemo<AuthApi>(
    () => ({ ready, userId, email, profile, isAdmin: profile?.role === "admin", refresh, signOut }),
    [ready, userId, email, profile, refresh, signOut],
  );
  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** First letter for the avatar: name, else email, else «؟». */
export function initialOf(profile: Profile | null, email: string | null): string {
  const src = (profile?.full_name || email || "").replace(/^(د\.?|دكتور|دكتورة)\s*/u, "").trim();
  return src ? Array.from(src)[0].toUpperCase() : "؟";
}
