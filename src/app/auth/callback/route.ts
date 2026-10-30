// Google sign-in and the email sign-in link land here. Supabase sends either
// ?code=… (PKCE: Google, or the link opened in the same browser) or
// ?token_hash=…&type=… (a custom email template). Either becomes a session
// cookie; then /onboarding once, or back to `next`.
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/auth/next";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNext(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const to = (path: string) => NextResponse.redirect(new URL(path, url.origin));
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const failed = () => to(`/login?error=callback&next=${encodeURIComponent(next)}`);

  const supabase = await supabaseServer();
  let userId: string | undefined;
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return failed();
    userId = data.user?.id;
  } else if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) return failed();
    userId = data.user?.id;
  }
  if (!userId) return failed();

  const { data: profile } = await supabase.from("profiles").select("onboarded_at").eq("id", userId).maybeSingle();
  return to(profile?.onboarded_at ? next : `/onboarding?next=${encodeURIComponent(next)}`);
}
