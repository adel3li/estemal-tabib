// When the last code was sent (per email), so the 60 s resend timer survives a reload.
const KEY = "istimal-tabib-otp-sent";
export const RESEND_SECONDS = 60;

export function markSent(email: string) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ email, at: Date.now() }));
  } catch {
    /* storage blocked — the timer just starts from now */
  }
}

/** Seconds left before another code can be requested. */
export function secondsLeft(email: string): number {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return RESEND_SECONDS;
    const { email: e, at } = JSON.parse(raw) as { email: string; at: number };
    if (e !== email) return RESEND_SECONDS;
    return Math.max(0, RESEND_SECONDS - Math.floor((Date.now() - at) / 1000));
  } catch {
    return RESEND_SECONDS;
  }
}

/** signInWithOtp options: create the account if new; the email's link (if any)
 *  comes back through /auth/callback to `next`. */
export const otpOptions = (next: string) => ({
  shouldCreateUser: true,
  emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
});
