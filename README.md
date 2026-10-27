# استعمال طبيب

**من دكتور أسنان لدكتور أسنان… بثقة**

Marketplace for used dental equipment in Egypt: every device is inspected by a certified technician, the buyer's money is held until delivery + a 3-day trial, and every device has a written warranty.

- Build brief: [`PHASE1_PROMPT.md`](PHASE1_PROMPT.md)
- Decisions log: [`DECISIONS.md`](DECISIONS.md)
- Design: [`design-reference/`](design-reference) — open `Demo.html` in a browser to click through all 16 screens.

## Status

**Clickable demo: all 16 screens are real, connected pages on demo data** (no database or login yet). Next: Supabase (Step 2) and login (Step 3).

## Test the demo

Data is saved in your browser only. Use «رجّع البيانات» in the dark bar at the bottom-left to start over.

| Page | Route |
|---|---|
| الرئيسية | `/` |
| كل الأجهزة (filters are in the URL, e.g. `/devices?cat=unit&st=done`) | `/devices` |
| صفحة جهاز — تم الفحص / يُفحص عند الطلب / محجوز | `/devices/L-201` · `/devices/L-202` · `/devices/L-212` |
| اعرض جهازك للبيع | `/sell` |
| اطلب جهاز | `/request` |
| شروط البيع والشراء / مين إحنا | `/terms` · `/about` |
| متابعة الطلب (Phase 2) | `/orders/2043` |
| لوحة التحكم | `/admin` → الأجهزة، إضافة جهاز، طلبات البيع، الفحوصات، الطلبات والشحن، المدفوعات، طلبات «اطلب جهاز» |

Flows worth trying:
1. Submit a device on `/sell` → it appears in **لوحة التحكم › طلبات البيع الواردة** → «قبول وتحويل لإعلان» → finish and publish it from its edit page → it shows on `/devices`.
2. In **الفحوصات**, open F-297 → «اعتمد ونشّر» → `/devices/L-207` becomes «تم الفحص» with the report.
3. Submit `/request` for an autoclave between 30,000 and 60,000 → **طلبات «اطلب جهاز»** shows the matching devices and the WhatsApp message.
4. On `/orders/2043` confirm the inspection report → **الطلبات والشحن** shows #2043 at «الشحن».
5. Hide or feature a device in **الأجهزة المعروضة** → check `/devices` and the home page.

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
