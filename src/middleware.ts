// Runs before every page (PHASE1_PROMPT.md §6):
// (middleware.ts, not Next 16's proxy.ts: proxy.ts runs on Node, which OpenNext
// on Cloudflare marks experimental; middleware runs on the edge runtime, which
// it supports — DECISIONS.md.)
// 1. refreshes the Supabase session cookie;
// 2. sends signed-out visitors of /sell, /request, /account, /admin, /onboarding
//    to /login?next=<path>;
// 3. sends signed-in users who haven't finished their profile to /onboarding (once);
// 4. lets only role = admin into /admin (RLS enforces the same on the data).
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/auth/next";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

const PROTECTED = ["/sell", "/request", "/account", "/admin", "/onboarding"];
const under = (path: string, base: string) => path === base || path.startsWith(`${base}/`);

export async function middleware(request: NextRequest) {
  // Supabase env vars missing on this deployment: keep the public pages up
  // instead of crashing every request; pages that need an account can't work.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (!PROTECTED.some((p) => under(request.nextUrl.pathname, p))) return NextResponse.next();
    return new NextResponse("Sign-in isn't configured on this deployment (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).", { status: 503 });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  // Verifies the JWT and refreshes it when needed. Keep this right after
  // createServerClient (Supabase SSR guidance).
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  const { pathname, search } = request.nextUrl;
  // Carry refreshed session cookies over to redirects/rewrites.
  const withCookies = <T extends NextResponse>(res: T) => {
    for (const c of response.cookies.getAll()) res.cookies.set(c);
    return res;
  };
  const redirect = (to: string) => withCookies(NextResponse.redirect(new URL(to, request.url)));

  // Already signed in? /login has nothing to do.
  if (userId && under(pathname, "/login")) {
    return redirect(safeNext(request.nextUrl.searchParams.get("next")));
  }

  if (!PROTECTED.some((p) => under(pathname, p))) return response;

  if (!userId) return redirect(`/login?next=${encodeURIComponent(pathname + search)}`);
  if (under(pathname, "/onboarding")) return response;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarded_at")
    .eq("id", userId)
    .maybeSingle();

  if (!profile?.onboarded_at) return redirect(`/onboarding?next=${encodeURIComponent(pathname + search)}`);
  if (under(pathname, "/admin") && profile.role !== "admin") {
    return withCookies(NextResponse.rewrite(new URL("/forbidden", request.url), { status: 403 }));
  }
  return response;
}

export const config = {
  // Everything except build assets and static files.
  matcher: [
    "/((?!_next/|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|txt|xml)$).*)",
  ],
};
