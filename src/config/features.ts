// On/off switches for features that depend on outside setup.

/**
 * Email sign-in (6-digit code). OFF until the site has its own domain + Resend
 * (custom SMTP): Supabase's built-in mailer sends only an English link, 2 emails
 * an hour for the whole project. Google sign-in is the only option meanwhile.
 * To turn on: set true here AND enable Authentication → Providers → Email in
 * Supabase (it was switched off there too).
 */
export const EMAIL_LOGIN_ENABLED = false;

/**
 * Device video (sell form, device page gallery, admin forms). OFF for now —
 * the client asked to hide it and add it later (Nov 2026). The upload code and
 * BUSINESS.videoSeconds (5–30 s) stay; set true to bring it all back.
 */
export const VIDEO_ENABLED = false;
