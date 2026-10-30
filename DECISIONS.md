# Decisions log

Choices made during the build that `PHASE1_PROMPT.md` didn't specify. Newest at the bottom.

## Step 0 — scaffold & deploy proof (2026-10-27)

1. **Font is self-hosted** via `@fontsource/ibm-plex-sans-arabic` instead of `next/font/google`. The brief asked for `next/font/google`, but that downloads the font at build time and the build fails whenever Google Fonts is unreachable (it failed in the build sandbox). Self-hosting gives the same font and weights (400/500/600/700) with no build-time network dependency, and each weight's CSS uses `unicode-range`, so browsers only download the Arabic or Latin file a page needs.
2. **`cacheComponents` and `partialPrefetching` are off.** `create-next-app` (Next 16) turns them on by default. With them on, the home page returned HTTP 500 on the Workers runtime ("Worker's code had hung"). Off, it returns 200. Revisit when OpenNext supports them.
3. **Versions pinned by the scaffold:** Next.js 16.4.3, React 19.3, Tailwind CSS 4, `@opennextjs/cloudflare` 1.20.13, Wrangler 4.153.
4. **No incremental cache binding** in `open-next.config.ts` for now, so the Worker needs no KV/R2 resources yet. Add an R2 incremental cache when listing pages use ISR.
5. **Brand tokens** are Tailwind 4 `@theme` variables in `src/app/globals.css` (e.g. `bg-teal`, `text-muted`, `bg-amber-soft`, `shadow-card`), named after §4.
6. **Design files:** the `.dc.html` files were extracted from the bundled demo (`design-reference/Demo.html`); their runtime script is referenced as `support.js`, which isn't included (as the brief expects).

## Clickable demo (2026-10-27)

Adel asked to test the whole site end to end before going further, so all 16 screens were built as real pages on demo data before Steps 1–8.

7. **Demo data lives in the browser.** `src/lib/demo/store.tsx` (devices, sell submissions, «اطلب جهاز» requests, inspections) and `src/lib/demo/orders.ts` (Phase 2 orders/payments) persist to localStorage, so admin actions show up on the public site in the same browser. Each tester has their own copy; «رجّع البيانات» in the demo bar resets it. Supabase replaces this in Step 2 — the store's actions map 1:1 to the tables in §7.
8. **No login yet.** `/admin` is open in the demo; Step 3 adds auth and the admin role check (`TODO(Step 3)` in `src/app/admin/layout.tsx`).
9. **Header shows «تابع طلبك»** (→ `/orders/2043`, a demo order) so the Phase 2 tracker can be tested. §2.1 #1 still applies for launch: hide it until orders exist.
10. **Pages are faithful ports of the design files** (inline styles kept as React style objects, page CSS in each route's `styles.css`, SVG art in `art.tsx`). See `PORTING.md`. Tailwind tokens stay available for new UI.
11. **Real data replaces some placeholders:** prices and counts come from the demo data instead of «[السعر]»; brand/model/year stay as placeholders.
12. **Order steps follow §11** in both the admin and the buyer tracker (so #2043 shows 4/7 «تقرير الفحص», not the design's 3/7).
13. **Hidden devices** count under the «مسودة» tab in the admin (the design has no «مخفي» tab).
14. **`minListingDays` and `sellerHandoverBusinessDays`** were added to `BUSINESS` for the terms page.
15. **WhatsApp links** open with no number while the number is a placeholder (`waLink` needs ≥ 11 digits).
16. **Worker size after the demo:** ~1.22 MiB gzipped (free limit 3 MiB).

## Mobile & tablet pass (2026-10-27)

17. **Breakpoints:** desktop layout (the design) from 1024px; tablets 768–1023; phones < 768; small phones ≤ 380. Pages keep the design's inline styles and override only the properties that must change, via classes in each page's `styles.css` (see `MOBILE.md`).
18. **Header < 1024px:** logo + «بيع جهازك» + menu button; the menu panel holds the nav, «اطلب جهاز», «شروط البيع والشراء», «اشتري جهاز», «تابع طلبك».
19. **Admin < 1024px:** sticky dark top bar with the section name; the sidebar becomes a drawer. Tables become cards; list → detail panels scroll into view with «رجوع للقائمة».
20. **Inputs are 16px below 1024px** so iOS Safari doesn't zoom on focus. Pinch-zoom stays allowed.
21. **Safe areas:** `viewport-fit=cover` + `env(safe-area-inset-*)` on the header, admin bar, demo pill, device order bar and footer.
22. **/devices filters < 1024px** open as a sheet from a «تصفية» button; **device page on phones** has a bottom bar with price + «اطلب الجهاز» that hides while the price card's own buttons or the footer are visible.
23. **Save / publish / approve buttons** stay full-width at the end of admin forms on phones (no sticky bottom bar) so they don't collide with the demo pill. Revisit when the demo pill is removed.
24. **Home-screen icon** is a static PNG (`src/app/apple-icon.png`). Generating it with `next/og` added ~0.8 MiB to the Worker (2.05 MiB gzipped); static keeps it at ~1.24 MiB.
25. Demo pill starts collapsed («نسخة تجريبية») instead of a full bar.

## Step 2 — Supabase (2026-10-30)

26. **Migrations are applied with the Supabase Management API** (`POST /v1/projects/{ref}/database/migrations`), which records them in `supabase_migrations.schema_migrations`; the files in `supabase/migrations/` carry the same version numbers, so the Supabase CLI sees them as applied.
27. **Device type enum uses the app's ids** (`unit`, `xray`, `autoclave`, …, `other`) — the same as `DeviceType` in the app; the Arabic labels stay in the app (`labels.ts`).
28. **`devices` holds only public columns.** `seller_id` and `submission_id` (listed under `devices` in §7) live in the admin-only `device_private`, so no API call can reveal a device's seller (§9 "no seller identity"). `seller_submissions.device_id` links a submission to the device it became.
29. **Public inspection report = `device_reports` snapshot.** `inspections` stays admin-only (it has scheduling data such as where the device is). «اعتمد ونشّر» copies the approved, public part (checklist, efficiency, appearance, condition, defects, technician name, date, serial, replaced parts, PDF) into `device_reports`, readable when the device is public. This avoids a SECURITY DEFINER view, which the security advisor flags as an error.
30. **Public views** `public_devices` and `public_device_reports` are `security_invoker` views with explicit column lists. `public_devices` leaves out `governorate` (device location isn't shown to buyers) and `source`.
31. **Extra columns** the demo/design needs and §7 doesn't list: `devices.model/origin/capacity`; `inspections.title/location/appearance/serial_no/replaced_parts/submission_id/order_id`; `seller_submissions.price_help` («ساعدوني أحدد السعر», so `sale_price` may be null) and `device_id`; `device_requests.full_name/phone` (contact as typed on the form); `profiles.email` (for the admin UI) and `onboarded_at` (onboarding shown once); `submission_media.mime/size_bytes`.
32. **Guards are triggers, not column grants.** Column grants would also restrict admins (same `authenticated` role). Triggers block non-admins from changing `profiles.role/phone_verified/email`, force `fee_status=pending`/`status=new` on new submissions and allow only `fee_reference` edits afterwards (while unpaid), and keep `device_requests.status/notified_at` for the team.
33. **First admin:** `public.set_admin_email(email)` (service role only) stores the email in `private.admin_emails` and promotes an existing profile; the sign-up trigger makes that email admin on first sign-in. Run with `SEED_ADMIN_EMAIL=… npm run db:set-admin`. Done for `adelalymustafa@gmail.com`.
34. **Grants:** the project's default privileges give `anon`/`authenticated` TRUNCATE on new tables (RLS doesn't cover TRUNCATE), so the migration revokes everything and grants only the verbs the app uses. Supabase's own `public.rls_auto_enable()` helper was callable by anon through `/rpc`; EXECUTE revoked (security advisor warning).
35. **Public codes** come from sequences with column defaults (`L-201…`, `#1001…`, `F-201…`, `R-101…`, orders `#2001…`); the prefixes duplicate `BUSINESS.codePrefixes`, which stays the app's source.
36. **Demo seed** is `supabase/seed/demo.sql` (not `supabase/seed.sql`, so the CLI never runs it automatically) and refuses to run unless `app.allow_demo_seed = 'on'` is set. Demo owners are three `@example.com` accounts with placeholder names. It was tested twice inside a rolled-back transaction; it has **not** been run on the project.
37. **RLS tests** are `scripts/test-rls.mjs` (`npm run db:test-rls`): 55 checks through the real Data API with throwaway users (sessions minted with the admin API — no emails), cleaned up afterwards.
38. **Phase 2 skeleton:** `orders`, `order_events`, `payments` + `order_status` enum following §11 (`confirmed → … → trial`, final `released_to_seller`, side exits `cancelled_refunded/returned/replaced`). Buyers read their own; admins write.

## Step 3 — Auth (2026-10-30)

39. **Session check is `src/middleware.ts`, not Next 16's `proxy.ts`.** `proxy.ts` runs on Node, which OpenNext for Cloudflare labels "experimental, not officially maintained"; `middleware.ts` (deprecated name, same API) runs on the edge runtime, which OpenNext supports. Next prints a deprecation warning at build — expected. Revisit when OpenNext supports Node proxy.
40. **`/sell` and `/request` require login at page entry** (as §6 lists them), with `next` keeping the query string, so the home quick-sell prefill (`?type=&details=&price=`) survives the login. Both forms autosave a localStorage draft; if the session has expired by the time they press «ابعت الطلب», the draft is kept, they're sent to `/login?next=…` and the form comes back filled (photos/video must be re-added — files can't be stored; a banner says so). Contact fields are pre-filled from the profile (only empty ones).
41. **Onboarding runs once, right after the first sign-in** (verify page and Google callback check `profiles.onboarded_at`), and the middleware also sends unfinished profiles there before `/sell`, `/request`, `/account`, `/admin`. `onboarded_at` is set when the form is saved.
42. **Admin lock = middleware (403 «الصفحة دي للفريق بس» via rewrite to `/forbidden`) + a role check in `app/admin/layout.tsx` (404 if bypassed) + RLS.**
43. **Header account controls:** «دخول» / avatar menu in the top row from 600px; below 600px (no room next to logo + «بيع جهازك» + menu) they sit at the top of the menu panel, and the menu button shows a small initial badge when signed in. Admins get «لوحة التحكم» in the menu. «تابع طلبك» stays where it was for the demo (DECISIONS #9).
44. **Supabase email on the free plan:** templates can't be edited with the built-in mailer, and its default email contains a sign-in **link**, not the 6-digit code. So both work: the verify page takes the code (works once custom SMTP + the Arabic template in `supabase/templates/otp-code.html` are set), and the link lands on `/auth/callback` (PKCE `code`, or `token_hash` with a custom template) and signs in on the same browser. Set via the Management API: OTP length 6 (was 8), expiry 15 min, Site URL `https://estemal-tabib.vercel.app` (the brief said tabib.vercel.app, but that domain belongs to someone else), redirect URLs `https://estemal-tabib.vercel.app/**`, Vercel previews `https://estemal-tabib-*-adel3lis-projects.vercel.app/**`, `http://localhost:3000/**`. Built-in mailer limit: 2 emails/hour.
45. **Google button is always shown**; if the provider is off in Supabase (checked from `/auth/v1/settings`, cached 5 min) it says «الدخول بجوجل لسه بيتجهز. ادخل بالإيميل دلوقتي.» instead of redirecting to an error.
46. **Sell/request submissions go to Supabase** and are also mirrored into the demo store under the database's code (`#1027`, `R-104`), so the still-demo admin pages keep showing new submissions. Remove the mirror in Step 7. Photos/video are not uploaded yet (Step 5, R2).
47. **Favorites:** the «المحفوظات» tab reads `favorites` from the database. There is no «احفظ» button yet because device pages still read demo devices (not in the database) — `TODO(Step 4)`.
48. **New microcopy** (not in the design): login «ادخل حسابك / أول مرة؟ هنعملك حساب في نفس الخطوة. من غير باسورد.», «كمّل بحساب جوجل», «ابعتلي الكود», verify «اكتب الكود», resend «ابعت كود جديد بعد 0:42», «غيّر الإيميل», onboarding «أهلاً بيك! كمّل بياناتك», account statuses («وصل وبنراجعه»، «محتاجين منك حاجة»، «بندوّر لك»، «بلّغناك على واتساب»), «الصفحة دي للفريق بس», Supabase error messages in `src/lib/auth/messages.ts`.
49. **WhatsApp code later:** `ProfileForm`, onboarding and the `phone_verified` flag don't depend on the sign-in method; a WhatsApp OTP can be added as another option on `/login` (Supabase phone auth or a custom provider) without changing these pages.
50. **Worker size after auth:** ~1.59 MiB gzipped (free limit 3 MiB).
51. **Missing Supabase env vars don't take the site down:** the middleware lets public pages through and answers 503 on account pages; the browser auth state falls back to "signed out". (The first Vercel deploy of this branch returned 500 everywhere because the variables weren't set yet.)
52. **Google-only sign-in until the domain + Resend are set (Adel, 2026-10-30).** `EMAIL_LOGIN_ENABLED = false` in `src/config/features.ts` hides the email form on `/login`, and the Email provider is switched off in Supabase (Authentication → Providers) so nobody can burn the 2-emails/hour built-in quota through the API. The email-code pages and `e2e/auth-flow.mjs` stay in the code; turn both switches back on when Resend is connected. Google OAuth client is in Google Cloud project «Estemal Tabib», published (External, scopes: email + profile); authorized domains `estemal-tabib.vercel.app` + the Supabase project domain.
