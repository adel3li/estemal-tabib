// Where to send someone after they sign in (`?next=`). Only same-site paths are
// allowed, so a crafted link can't bounce a fresh session to another site.

export function safeNext(next: string | null | undefined, fallback = "/account"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (next.startsWith("/login") || next.startsWith("/auth/")) return fallback;
  return next;
}

/** `/login?next=/sell%3Ftype%3Dunit` */
export const loginHref = (next: string) => `/login?next=${encodeURIComponent(next)}`;
