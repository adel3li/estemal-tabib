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
