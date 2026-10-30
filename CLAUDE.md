# استعمال طبيب — notes for Claude Code

**Read `PHASE1_PROMPT.md` first.** It is the full build brief: product rules, data model, RLS, build order and checkpoints. This file only adds working notes.

- Build order and checkpoints: `PHASE1_PROMPT.md` §10. Stop and report after each step.
- UI source of truth: `design-reference/*.dc.html` (markup, copy, scripts) + `design-reference/Demo.html` (opens in a browser). Apply the overrides in §2.1 on top.
- Business numbers live only in `src/config/business.ts`.
- Log every choice the brief didn't make in `DECISIONS.md`.
- Open questions (§12) are **not** yours to decide: leave a `TODO(open question §12.N)`.

## Stack notes (learned in Step 0)

- Next.js 16 + `@opennextjs/cloudflare` on Cloudflare Workers. Check that a page works under `npm run preview` (real Workers runtime), not only `next dev`.
- `cacheComponents` must stay **off** — pages hang on Workers with it on.
- The font is self-hosted from `@fontsource/ibm-plex-sans-arabic`; don't switch to `next/font/google` (builds fail when Google Fonts is unreachable).
- Free plan Worker limit is 3 MiB gzipped. Step 0 build: ~0.98 MiB. Check with `npx wrangler deploy --dry-run --outdir /tmp/w` after adding big dependencies.

## Supabase / auth notes (Steps 2–3)

- Migrations in `supabase/migrations/` are applied to the project; RLS checks: `npm run db:test-rls`. Browser auth test: `npm run e2e:auth` (see the file header).
- Session check is `src/middleware.ts` (edge runtime) — keep it; Node `proxy.ts` is experimental on OpenNext/Cloudflare.
- In the Claude sandbox: Node needs `NODE_USE_ENV_PROXY=1` to reach Supabase; open the dev server as `localhost:3000` (Next blocks dev assets on `127.0.0.1`); `npm run preview` (workerd) can't reach Supabase here, so signed-in pages only work under `next dev`.

## Commands

```bash
npm run dev         # local dev (Node)
npm run preview     # build + run on the Workers runtime locally
npm run deploy      # build + deploy to Cloudflare (needs `npx wrangler login` once)
npm run lint && npm run typecheck
```
