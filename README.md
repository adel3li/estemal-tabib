# استعمال طبيب

**من دكتور أسنان لدكتور أسنان… بثقة**

Marketplace for used dental equipment in Egypt: every device is inspected by a certified technician, the buyer's money is held until delivery + a 3-day trial, and every device has a written warranty.

- Build brief: [`PHASE1_PROMPT.md`](PHASE1_PROMPT.md)
- Decisions log: [`DECISIONS.md`](DECISIONS.md)
- Design: [`design-reference/`](design-reference) — open `Demo.html` in a browser to click through all 16 screens.

## Status

| Step | | |
|---|---|---|
| 0 | Scaffold & deploy proof | ✅ builds and runs on the Workers runtime locally; first real deploy needs your Cloudflare account (below) |
| 1 | Design system | ⏳ next |
| 2–8 | Supabase, auth, pages, uploads, flows, admin, hardening | — |

## Run it

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run preview    # same app on the Cloudflare Workers runtime, http://localhost:8787
```

## Deploy to Cloudflare Workers (free plan)

One-time, from your machine:

```bash
npx wrangler login     # opens the browser, sign in to Cloudflare
npm run deploy         # builds and deploys; prints the *.workers.dev URL
```

Or connect this GitHub repo in the Cloudflare dashboard (Workers & Pages → Create → Import a repository) with build command `npx opennextjs-cloudflare build` and deploy command `npx opennextjs-cloudflare deploy`, so every push deploys.

## Environment variables

See [`.env.example`](.env.example). None are needed yet (Step 0).
