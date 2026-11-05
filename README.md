# استعمال طبيب

**من دكتور أسنان لدكتور أسنان… بثقة**

A marketplace for used dental equipment in Egypt. A certified technician inspects every device, the buyer's money is held until delivery plus a 3-day trial, and every device comes with a written warranty.

- **Live site:** https://estemal-tabib.vercel.app (control panel: `/admin`).
- **Build brief:** [`PHASE1_PROMPT.md`](PHASE1_PROMPT.md). The control-panel requirements in [`docs/ADMIN_SPEC.md`](docs/ADMIN_SPEC.md) are newer and win where the two differ.
- **Every choice the brief didn't make:** [`DECISIONS.md`](DECISIONS.md).
- **Design:** [`design-reference/`](design-reference). Open `Demo.html` in a browser.

## How it's built

| Part | What |
|---|---|
| Site | Next.js 16 (App Router, TypeScript), Arabic RTL, IBM Plex Sans Arabic (self-hosted) |
| Hosting | **Vercel**: every push to `claude/nice-fermat-y7zom3` deploys. A Cloudflare Workers build (OpenNext) also works; see below. |
| Database + login | **Supabase**: Postgres with row-level security on every table; login is Google only for now. |
| Photos | **Supabase Storage**: `device-photos` (public) and `submission-photos` (private). Each photo is shrunk in the browser before upload. |
| Business numbers | `src/config/business.ts` only (fees, percentages, warranty, photo limits). |
| Contact details | The dashboard's «الإعدادات» page, which overrides the defaults in `business.ts`. |

## Run it on your computer

Requires Node 20+.

```bash
npm install
cp .env.example .env.local     # then fill in the two NEXT_PUBLIC_* values
npm run dev                    # http://localhost:3000
```

Other commands:

```bash
npm run lint && npm run typecheck   # code checks
npm run build && npm start          # production build, http://localhost:3000
npm run preview                     # the same app on the Cloudflare Workers runtime
```

## Settings (environment variables)

The site itself needs only these two. Find them in Supabase → Project Settings → API. Both are safe in the browser, because row-level security protects the data.

| Name | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co`, with no `<` `>` brackets |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the "publishable" / anon key |

Only the scripts below use these, so never add them to Vercel. Keep them in `.env.local`, which git ignores:

| Name | Used by |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | tests, `db:set-admin`, `backup:photos` (full access, keep it secret) |
| `SUPABASE_PROJECT_REF` | the same scripts and migrations |
| `SUPABASE_ACCESS_TOKEN` | applying migrations (Management API / Supabase CLI) |
| `SEED_ADMIN_EMAIL` | `db:set-admin`: this email becomes admin |

## Supabase setup (already done for the live project)

1. **Database:** apply `supabase/migrations/*.sql` in order, with the Supabase CLI (`supabase db push`) or the SQL editor. The migrations create every table, rule, view and the two photo buckets.
2. **Login:**
   - Authentication → Providers → **Google** on, using the OAuth client from Google Cloud project «Estemal Tabib».
   - Authentication → URL Configuration: Site URL `https://estemal-tabib.vercel.app`; redirect URLs `https://estemal-tabib.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`.
3. **First admin:** sign in once with Google, then run `npm run db:set-admin` with `SEED_ADMIN_EMAIL` set. After that, add team members from «الفريق» in the dashboard.
4. **Demo data** (`supabase/seed/`) is **not for production**. It only runs when you turn it on explicitly; see `supabase/README.md`.

## Deploy

- **Vercel (current):** push to the production branch and Vercel builds and publishes by itself. Set the two `NEXT_PUBLIC_*` variables in Vercel → Project → Settings → Environment Variables.
- **Cloudflare Workers (alternative, free plan):** run `npx wrangler login` once, then `npm run deploy`. Keep `cacheComponents` off. The free Worker limit is 3 MiB gzipped; check the size with `npx wrangler deploy --dry-run --outdir /tmp/w`.

## Tests

```bash
npm run db:test-rls          # security rules against the real database (~150 checks)
npm run e2e -- http://localhost:3000 /tmp/shots 390     # full browser run (phone width)
npm run e2e -- http://localhost:3000 /tmp/shots 1280    # …and desktop
```

The browser run covers:
1. Browse as a visitor.
2. `/sell` sends you to sign-in and keeps your draft.
3. The Google button starts Google sign-in.
4. Sign in → onboarding → back on `/sell` with the draft.
5. Send a device with photos and a «اطلب جهاز» request.
6. Check «حسابي».
7. A non-admin is blocked from the control panel.
8. The admin sees the seller's photos, accepts, and publishes; the public sees the listing with its photo.
9. Sign out.

Both test commands need `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_PROJECT_REF`. They run against the real database, create throwaway users, and delete everything they made at the end. No emails are sent and Google is never opened. The browser run needs two test PNGs in `E2E_MEDIA` (see the file header).

## Supabase paused? How to restore

Free Supabase projects **pause after about a week with no visits**. While paused, the site shows «ما قدرناش نحمّل الأجهزة» and nobody can sign in. To restore it:

1. Go to https://supabase.com/dashboard → the project → **Restore project**.
2. Wait a few minutes. Nothing is lost: data, photos and logins all stay.

To avoid pauses, keep the site getting some visits, or move to the Pro plan ($25/month), which never pauses and adds daily backups.

## Backups

The free plan has **no downloadable backups**, so take your own, for example once a week and before any big change:

```bash
# 1. The database: all data, as SQL
npx supabase db dump --db-url "postgresql://postgres:<DB password>@db.<project-ref>.supabase.co:5432/postgres" --data-only -f backup/data.sql
npx supabase db dump --db-url "…same…" -f backup/schema.sql

# 2. The photos (only downloads new files on later runs)
npm run backup:photos -- ./backup/photos
```

Find the database password in Supabase → Project Settings → Database. Keep the `backup/` folder off GitHub (git ignores it) and copy it somewhere safe, such as Google Drive.

**To restore into a new project:**
1. Apply the migrations.
2. Run `psql "<new db url>" -f backup/data.sql`.
3. Upload the photo folders back into the two buckets with the same paths.
4. Update the two `NEXT_PUBLIC_*` values in Vercel.

## Folder map

```
src/app/(site)/      public pages: home, devices, device page, sell, request, account, login
src/app/admin/       control panel (admins; the marketing team sees part of it)
src/lib/             data access (Supabase), store, photos, orders, search, settings
src/config/          business numbers + feature switches (video, email login)
supabase/migrations/ database schema + security rules (already applied)
scripts/             set-admin, RLS tests, photo backup
e2e/                 browser test
```
