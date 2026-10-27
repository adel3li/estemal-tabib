# Decisions log

Choices made during the build that `PHASE1_PROMPT.md` didn't specify. Newest at the bottom.

## Step 0 — scaffold & deploy proof (2026-10-27)

1. **Font is self-hosted** via `@fontsource/ibm-plex-sans-arabic` instead of `next/font/google`. The brief asked for `next/font/google`, but that downloads the font at build time and the build fails whenever Google Fonts is unreachable (it failed in the build sandbox). Self-hosting gives the same font and weights (400/500/600/700) with no build-time network dependency, and each weight's CSS uses `unicode-range`, so browsers only download the Arabic or Latin file a page needs.
2. **`cacheComponents` and `partialPrefetching` are off.** `create-next-app` (Next 16) turns them on by default. With them on, the home page returned HTTP 500 on the Workers runtime ("Worker's code had hung"). Off, it returns 200. Revisit when OpenNext supports them.
3. **Versions pinned by the scaffold:** Next.js 16.4.3, React 19.3, Tailwind CSS 4, `@opennextjs/cloudflare` 1.20.13, Wrangler 4.153.
4. **No incremental cache binding** in `open-next.config.ts` for now, so the Worker needs no KV/R2 resources yet. Add an R2 incremental cache when listing pages use ISR.
5. **Brand tokens** are Tailwind 4 `@theme` variables in `src/app/globals.css` (e.g. `bg-teal`, `text-muted`, `bg-amber-soft`, `shadow-card`), named after §4.
6. **Design files:** the `.dc.html` files were extracted from the bundled demo (`design-reference/Demo.html`); their runtime script is referenced as `support.js`, which isn't included (as the brief expects).
