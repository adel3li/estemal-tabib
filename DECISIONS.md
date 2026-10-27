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
