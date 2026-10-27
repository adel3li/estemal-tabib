# استعمال طبيب — Phase 1 build brief for Claude Code

> How to use: put this file and the `design-reference/` folder in an empty project folder, open it in Claude Code, and say:
> **"Read PHASE1_PROMPT.md fully, then start with Step 0. Stop at each checkpoint and show me what you did."**
>
> _Last revised 2026-10-27: aligned with the final design screens (see §14 for what changed)._

---

## 1. What we are building

**استعمال طبيب** ("من دكتور أسنان لدكتور أسنان… بثقة") is an Egyptian marketplace for **used dental equipment**. The platform sits between seller and buyer as an **inspector and guarantor**:

- A seller (dentist / clinic) submits a device with photos and a video.
- A **certified technician (فني معتمد)** inspects it — either before publishing ("تم الفحص") or after a buyer orders it ("يُفحص عند الطلب").
- The buyer's money is **held by the platform** until delivery + a 3-day trial, then released to the seller.
- Every device carries a written guarantee: 3-day replacement/return and free maintenance of 3 or 6 months.

**Phase 1 goal:** a real, deployable website where visitors browse devices, users sign in, sellers submit devices, buyers submit "اطلب جهاز" requests, and the team manages everything from an admin dashboard. **Orders, payments and order tracking are Phase 2** (see §11) — but design the database so they plug in without migration pain.

Everything must run on **free tiers** at launch.

---

## 2. Design reference (source of truth for UI)

`design-reference/` contains the approved clickable design, one page per file (`*.dc.html`). `design-reference/Demo.html` is the same 16 pages bundled into one file that **does** open standalone in a browser — use it to see a page; use the `.dc.html` files to read markup, copy and scripts. These files use a custom templating runtime that is **not** included, so **do not try to run them** — read them as HTML/CSS specs: layout, copy, colors, spacing, states, and the small JS in each file's `<script type="text/x-dc">` block that describes interactions (filters, linked price fields, location button, etc.).

| Design file | Route to build | Phase |
|---|---|---|
| `Main.dc.html` | `/` | 1 |
| `Browse.dc.html` | `/devices` | 1 |
| `Listing-Inspected.dc.html` | `/devices/[id]` (inspected variant) | 1 |
| `Listing-OnOrder.dc.html` | `/devices/[id]` (inspect-on-order variant) | 1 |
| `Sell.dc.html` | `/sell` | 1 |
| `Request.dc.html` | `/request` | 1 |
| `Terms.dc.html` | `/terms` | 1 (static) |
| `About.dc.html` | `/about` | 1 (static) |
| `Order-Tracker.dc.html` | `/account/orders/[id]` | **2** (build static shell only if time allows) |
| `Admin.dc.html` | `/admin/devices/new` | 1 |
| `Admin-Listings.dc.html` | `/admin/devices` | 1 |
| `Admin-Submissions.dc.html` | `/admin/submissions` | 1 |
| `Admin-Inspections.dc.html` | `/admin/inspections` | 1 |
| `Admin-Requests.dc.html` | `/admin/requests` | 1 |
| `Admin-Orders.dc.html` | `/admin/orders` | **2** |
| `Admin-Payments.dc.html` | `/admin/payments` | **2** |

Pages **not yet designed** that Phase 1 needs (build them in the same visual language): `/login`, `/login/verify`, `/onboarding`, `/account` (tabs). Spec in §6.

**Rules for using the design:**
- Reproduce the Arabic copy **exactly**. Do not rewrite, "improve" or translate it — **except** for the overrides listed in §2.1, which win over the design files.
- Bracketed placeholders like `[رقم الواتساب]`, `[السعر]`, `[اسم الفني]` stay as config values / DB data — never invent real contact details, names, or numbers.
- The SVG device illustrations in the design are temporary art. Extract them into reusable React components (`<DeviceArt type="autoclave" />`) used as the fallback image when a device has no photo.
- Build components, not copies: Header, Footer, DeviceCard, StatusPill, Chip, FormField (with red required star on the label line), StepCards, AdminShell (dark sidebar), KPI tile, Drawer.

### 2.1 Overrides — where the design files are inconsistent, follow this

| # | Where | Design shows | Build this |
|---|---|---|---|
| 1 | **Header CTAs** (every public page) | Varies per page: «بيع جهازك + اشتري جهاز» / «تابع طلبك + بيع جهازك» / «بيع جهازك + كل الأجهزة» / three buttons on `/` and `/sell` («تابع طلبك» or «تواصل معانا» + both CTAs) | **One Header everywhere:** «بيع جهازك» (amber) + «اشتري جهاز» (teal, → `/devices`). «تابع طلبك» is **hidden in Phase 1** (order tracking is Phase 2); in Phase 2 it goes into the signed-in avatar menu. |
| 2 | **Shipping copy** (`Admin-Orders`, anywhere else) | «التوصيل لحد باب العيادة» | «التوصيل لحد باب بيتك» — delivery is to the buyer's door, never "clinic". |
| 3 | **`/sell` submit button** | «ادفع 300 ج.م واعرض جهازك» | Phase 1 button: **«ابعت الطلب»**. Keep the 300 ج.م fee box above it as information. Payment instructions appear on the success screen (§9). |
| 4 | **`/devices` sort** | Sort appears twice: dropdown at the top of the results + chips under price in the sidebar | Keep **only the top dropdown** («ترتيب حسب»: الأحدث / من الأقل سعراً للأعلى / من الأعلى سعراً للأقل). Remove the sidebar sort chips. |
| 5 | **Public codes** | Admin listings use `L-201`; brief said `D-1024` | Use the design's prefixes: devices `L-###`, sell submissions `#1024`, inspections `F-###`, device requests `R-###`, orders (Phase 2) `#2041`. |
| 6 | **Order steps** (`Order-Tracker` vs `Admin-Orders`) | Tracker labels differ from admin (no «الطلب اتأكد», adds «الاستلام والتركيب» and «تحويل المبلغ للبايع») | Phase 2 only. Canonical steps are in §11; both pages must use them. Do not build the tracker's labels as-is. |

---

## 3. Tech stack (all free tier)

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSR/SSG for SEO on listing pages |
| Styling | **Tailwind CSS** | Map palette in §4 to theme tokens; `dir="rtl"` on `<html lang="ar">` |
| Font | IBM Plex Sans Arabic via `next/font/google` | weights 400/500/600/700 |
| DB + Auth | **Supabase** (Postgres, Auth, RLS) | Free plan: 500 MB DB, 50k MAU. Free projects pause after ~1 week of inactivity — document how to restore it |
| Media | **Cloudflare R2** | Photos + videos. Uploads via short-lived **presigned PUT URLs** issued by a server route after auth check |
| Hosting | **Cloudflare Workers** via `@opennextjs/cloudflare` | Vercel Hobby is non-commercial only — do **not** use it for production |
| Email | **Resend** free tier | Only for admin/seller notifications in Phase 1 (optional) |
| Validation | **zod** | Shared schemas client + server |
| Forms | react-hook-form | |
| Tests | Vitest (unit), Playwright (e2e) | |

**Step 0 must prove the deploy path works** (hello-world on Cloudflare Workers with OpenNext, under the free plan's Worker size limit). If the bundle exceeds the free limit, stop and tell me before choosing an alternative.

Do not add paid services or SDKs. SMS/WhatsApp OTP is **out** (paid per message).

---

## 4. Brand tokens

```
ink        #12221F   text
muted      #4A5A56   secondary text
ground     #F5F7F4   page background
border     #DCE3DF   (input border #C9D4CF)
teal       #0D5C55   primary (hover #08403B), soft #E3F0ED
dark       #0F2A26   footer, admin sidebar
amber      #F2A33A   "بيع جهازك" CTA, accents; soft #FBEEDC, text #8A4209
blue       #24508F   "يُفحص عند الطلب"; soft #E6EDF7
green      #3F7A1F   soft #EAF5DD; light-green chip border #7DBB4A
red        #B3261E   required star / errors
radius     cards 20–24px, inputs 12px, pills 999px
shadow     0 10px 30px rgba(18,34,31,.06)
```

---

## 5. Business rules (put these in `src/config/business.ts` — never hard-code elsewhere)

```ts
export const BUSINESS = {
  platformFeeMaxRate: 0.15,        // seller net = round(salePrice * 0.85)
  sellerSeriousnessFeeEGP: 300,    // paid after submitting a device (manual in Phase 1); refund rules in /terms
  buyerReservationDepositEGP: 500, // Phase 2 (deducted from price)
  trialDays: 3,                    // replacement/return + money held after delivery
  maintenanceMonthsOptions: [3, 6],
  deliveryDaysInspected: '2 – 5',
  deliveryDaysWithInspection: '[5 – 7]', // placeholder in design — keep as config
  photos: { min: 2, max: 10 },
  videoSeconds: { min: 15, max: 60 },
  codePrefixes: { device: 'L-', submission: '#', inspection: 'F-', request: 'R-', order: '#' },
  contact: { whatsapp: '[رقم الواتساب]', email: '[البريد الإلكتروني]', social: '[حسابات السوشيال ميديا]' },
  feeTransferDetails: '[بيانات التحويل]',
};
```

Other rules:
- **Inspection is done by «فني معتمد» only.** (No dentist reviewer.)
- Inspection state per device: `inspected` (تم الفحص) or `on_order` (يُفحص عند الطلب).
- Condition buckets: `a` ممتازة 81–100% · `b` جيدة 60–80% · `c` أقل من 60% (محتاج صيانة).
- **«سبب البيع» (sale reason) is internal** — collected in the sell form, shown only to admins, never on public pages or public API responses.
- Purchase cost, seller net, internal notes: **admin-only**.
- Shipping is always **to the buyer's door** («لحد باب بيتك»).
- Price fields on `/sell` are linked: typing sale price shows seller net (×0.85) and vice versa (÷0.85), `Math.round`, accept Arabic-Indic digits. Label: «(15% من سعر البيع كحد أقصى)».
- Device types (exact Arabic, keep this order for forms): يونيت أسنان، أشعة، أوتوكلاف، موتور جراحة وزراعة، إندو موتور، أبيكس لوكيتور، لايت كيور، روتاري، كونترا، ميكرو موتور، كاميرا إنترا أورال، كاميرا، لوب تكبير، جهاز تاني.
  Browse filter order and chip colors follow `Browse.dc.html` exactly (first five chips have the light-green border; «جهاز تاني» amber).
- All 27 Egyptian governorates (list in `Sell.dc.html`).

---

## 6. Auth & account (Phase 1)

**Browsing never requires login.** Login is required to: submit a device (`/sell`), submit a request (`/request`), save favorites, and access `/account` and `/admin`. When an anonymous user hits one of those, send them to `/login?next=<path>` and return them after login. **Preserve a half-filled form** across the login redirect (localStorage draft, wrapped in try/catch).

Methods (both free):
1. **Google** (Supabase OAuth).
2. **Email OTP** — 6-digit code, no password (Supabase `signInWithOtp` with email). Customize the Supabase email template in Arabic.

Pages:
- `/login` — one page for sign up + sign in: «ادخل حسابك», Google button, email field → «ابعتلي الكود».
- `/login/verify` — 6-digit code input, resend after 60 s, change email.
- `/onboarding` — shown once if profile incomplete: الاسم بالكامل*, رقم الموبايل (واتساب)*, المحافظة*, العنوان, نوع الحساب* (طبيب / طالب / عيادة أو مركز). Phone stored as-is; mark `phone_verified=false` (team verifies on first WhatsApp contact).
- `/account` — tabs: **أجهزتي المعروضة** (my submissions + status), **طلبات «اطلب جهاز»** (my requests + matching devices count), **المحفوظات** (favorites), **بياناتي** (edit profile). Placeholder tab **طلباتي** with "قريباً" (Phase 2).
- Header when signed in: the two CTAs from §2.1 stay; the login button is replaced with an avatar (initial) + menu: حسابي / أجهزتي / اخرج. Admins also see «لوحة التحكم».
- Profile data pre-fills the seller section of `/sell` and the contact part of `/request`.

---

## 7. Database (Supabase Postgres) — create via SQL migrations in `supabase/migrations/`

Use enums, `created_at/updated_at` timestamps, UUID PKs, and **RLS on every table**.

```
profiles            id (= auth.users.id) PK, full_name, phone, phone_verified bool,
                    governorate, address, account_type enum(doctor, student, clinic),
                    role enum(user, admin) default user, created_at
                    -- trigger: insert row on auth.users insert

devices             id, public_code (e.g. L-201), title, type enum, brand, details,
                    manufacture_year int null, governorate, accessories text,
                    condition enum(a,b,c), inspection_state enum(inspected, on_order),
                    efficiency text null, declared_defects text,
                    has_box bool null,                              -- «الكرتونة» on listing page
                    repaired_before enum(yes,no,unknown) null,      -- «اتصلّح قبل كده؟» on listing page
                    sale_price int, maintenance_months int check in (3,6),
                    source enum(company, seller), seller_id uuid null → profiles,
                    submission_id uuid null → seller_submissions,
                    status enum(draft, published, reserved, sold, hidden),
                    featured bool, views int default 0, published_at
                    -- has_box / repaired_before are copied from the submission on accept,
                    -- editable by admin, and PUBLIC (shown in the on-order data grid)

device_private      device_id PK → devices, purchase_cost int null, seller_net int null,
                    sale_reason text null, internal_notes text null, location_now text null
                    -- admin-only table

device_media        id, device_id, kind enum(photo, video), r2_key, width, height,
                    duration_sec null, sort_order, is_defect bool default false

inspections         id, public_code (F-297), device_id, kind enum(pre_publish, after_order),
                    technician_name, scheduled_at,
                    status enum(needs_tech, scheduled, late, needs_review, done),
                    checklist jsonb,
                    overall_efficiency, condition enum, defects, report_pdf_key null,
                    approved_by uuid null, approved_at
                    -- checklist shape: [{key, label, group:'core'|'category', ok:bool, note}]
                    -- Phase 1: the 4 'core' items from Admin-Inspections are required
                    --   (التشغيل، الحالة الظاهرية، الأجزاء المتغيرة، الصيانة السابقة).
                    -- 'category' items (e.g. «الكرسي والهيدروليك», «Bowie-Dick») are OPTIONAL
                    --   extra rows; the shape must allow them but don't build per-type
                    --   templates yet — see open question §12.8.
                    -- The public report renders whatever rows exist, in order.

seller_submissions  id, public_code (#1024), seller_id → profiles, full_name, phone,
                    governorate, pickup_address, lat, lng,
                    device_type, brand, details, accessories, sale_reason,
                    condition enum, wants_repair bool, repair_description,
                    has_warranty bool, warranty_remaining, has_box bool,
                    repaired_before enum(yes,no,unknown), repaired_details, defects,
                    keep_location enum(with_seller, send_to_platform),
                    sale_price int, seller_net int,
                    fee_status enum(pending, paid, refunded, forfeited), fee_reference,
                    status enum(new, follow_up, accepted, rejected),
                    reject_reason, admin_log jsonb, created_at

submission_media    id, submission_id, kind enum(photo, video, accessory), r2_key, ...

device_requests     id, public_code (R-118), user_id → profiles, device_type,
                    brand_pref text null,                 -- «ماركة أو موديل معيّن (اختياري)»
                    budget_min, budget_max,
                    needed_by text,                       -- «محتاجه إمتى؟», options from Request.dc.html
                    governorate, inspection_pref enum(any, inspected_only), notes,
                    status enum(new, notified, closed), notified_at

favorites           user_id, device_id, PK(user_id, device_id)

audit_log           id, actor_id, entity, entity_id, action, data jsonb, created_at
```

Phase-2 tables (`orders`, `order_events`, `payments`) — create the enum/table skeletons now but leave UI for Phase 2. The order status enum follows §11.

**RLS policies (write tests for them):**
- `devices`: anyone can `select` where `status in ('published','reserved','sold')`; admins all. Only admins insert/update/delete.
- `device_private`, `inspections`, `audit_log`: admins only. (The public inspection report is served through the public view below, never by opening `inspections` to anon.)
- `device_media`: public select when parent device is public; admin write.
- `seller_submissions` / `submission_media`: owner can insert & select own (but **not** `fee_status` changes); admins all.
- `device_requests`, `favorites`: owner CRUD own; admins select all.
- `profiles`: owner select/update own (cannot change `role`); admins select all.
- Helper `is_admin()` SQL function (security definer) reading `profiles.role`.
- Public device queries must go through a **view or explicit column list** that excludes anything internal. A second public view exposes the approved inspection report (checklist, efficiency, condition, defects, technician name, date) for public devices only.

Seed: one admin (by email from env `SEED_ADMIN_EMAIL`), ~11 demo devices matching `Browse.dc.html`, 3 submissions, 6 requests. Seed must be idempotent and **never run in production unless explicitly asked**.

---

## 8. Media uploads (R2)

- Server route `POST /api/upload-url` → checks session, validates `kind`, MIME (`image/jpeg|png|webp`, `video/mp4|quicktime`), size (photos ≤ 8 MB, video ≤ 100 MB), returns presigned PUT URL + key under `submissions/{submissionId}/…` or `devices/{deviceId}/…`.
- Client: compress/resize images before upload (max 2000 px, WebP), read video duration with a `<video>` element and enforce 15–60 s **before** uploading.
- Enforce 2–10 photos server-side when the submission is finalized.
- Public delivery: R2 public bucket domain or a Worker route; only media of public devices is publicly reachable. Submission media is private (serve via signed GET to owner/admin).

---

## 9. Phase 1 features — acceptance criteria

**Public site**
- Home, About, Terms match the designs (Terms has seller/buyer tabs and the side TOC).
- Header follows §2.1 #1 on every public page.
- `/devices`: server-rendered list from DB; all filters from the design work (inspection state, type, maintenance, condition, price range, search) plus **one** sort dropdown (§2.1 #4); filters are reflected in the URL query so links are shareable; empty state + «اطلب جهاز» banner.
- `/devices/[id]`: gallery (photos + video), data grid, sticky price card, guarantee rows, delivery estimate, step cards; variant by `inspection_state`; inspected variant shows the inspection report; on-order variant shows «الكرتونة» and «اتصلّح قبل كده؟» from `devices.has_box` / `repaired_before`; **no sale reason, no seller identity**. «اطلب الجهاز» button → for Phase 1 opens WhatsApp (`wa.me` with prefilled message containing device code) since orders are Phase 2.
- SEO: metadata, Open Graph per device, `sitemap.xml`, Arabic `lang`/`dir`.

**Seller flow `/sell`** (login required)
- All fields, required stars, conditional fields, location button (browser geolocation, free) exactly as in `Sell.dc.html`.
- Linked price fields (§5).
- Upload photos/video/accessory photo with progress, remove, reorder.
- Declarations must all be checked before submit.
- Submit button reads **«ابعت الطلب»** (§2.1 #3).
- Fee: Phase 1 = **manual**. After submit, the success screen shows instructions to pay 300 ج.م via InstaPay/bank transfer to `BUSINESS.feeTransferDetails` and a field to paste the transfer reference. `fee_status = pending` until an admin marks it paid.
- Submission appears in `/account` → أجهزتي المعروضة with status.

**Buyer request `/request`** (login required) — all fields from `Request.dc.html` including brand preference and «محتاجه إمتى؟»; saves `device_requests`; success state.

**Admin `/admin/*`** (role = admin only; middleware + RLS)
- Shell with dark sidebar exactly like the designs; Orders/Payments links show «قريباً» in Phase 1.
- **الأجهزة المعروضة**: KPIs, tabs, search, filters, table, drawer, publish/hide, feature, edit.
- **إضافة جهاز / تعديل**: full form from `Admin.dc.html`, both sources (company / on behalf of seller → pick a submission and copy its data + media, including `has_box` / `repaired_before`), live preview card, draft vs publish, pre-publish checklist.
- **طلبات البيع الواردة**: list + detail; accept → creates a draft device prefilled from the submission (copy media keys); request more photos; schedule inspection (creates `inspections` row); reject with reason; mark fee paid/refunded with reference. Every action → `audit_log` + entry in `admin_log`.
- **الفحوصات**: week strip, list, assign technician, report form (4 core checklist items + optional extra rows, efficiency, condition, defects, photos, optional PDF). «اعتمد ونشّر» validates that the 4 core items are filled, sets device `inspection_state='inspected'`, attaches the report, and publishes if `kind = pre_publish`.
- **طلبات «اطلب جهاز»**: list + matching published devices (type + budget + inspection pref); «ابعت للدكتور على واتساب» opens `wa.me` with a prefilled message listing matching device links and marks `notified`.

**Non-functional**
- Mobile-first responsive (test at 390 px and 1440 px), RTL correct (icons/arrows mirrored).
- Accessibility: labels on every input, visible focus rings, `aria-pressed` on chips, keyboard-operable drawers/tabs, color contrast AA.
- Loading/empty/error states on every data view.
- No secrets in the client bundle. `.env.example` lists every variable.
- Lighthouse ≥ 90 performance/accessibility on `/` and `/devices` (mobile).

---

## 10. Build order & checkpoints (stop and report after each)

0. **Scaffold & deploy proof** — Next.js + TS + Tailwind + fonts + RTL; deploy hello-world to Cloudflare Workers via OpenNext. ✅ Checkpoint.
1. **Design system** — tokens, Header/Footer, buttons, chips, pills, form fields, cards, AdminShell, `DeviceArt` illustrations extracted from the design. Build a `/_styleguide` page. ✅ Checkpoint.
2. **Supabase** — migrations for all tables/enums/views, RLS + `is_admin()`, profile trigger, seed script, RLS tests. ✅ Checkpoint.
3. **Auth** — Google + email OTP, `/login`, `/login/verify`, `/onboarding`, session middleware, `next` redirect, header avatar menu. ✅ Checkpoint.
4. **Public pages** — Home, Browse (DB + filters), Device page (both variants), About, Terms. ✅ Checkpoint.
5. **R2 uploads** — presigned route, client compression, video duration check. ✅ Checkpoint.
6. **Sell + Request flows** + `/account` tabs. ✅ Checkpoint.
7. **Admin** — devices list, add/edit, submissions, inspections, requests. ✅ Checkpoint.
8. **Hardening** — e2e tests for: anonymous browse, login redirect with draft restore, seller submit, admin accept → publish, RLS denial cases; Lighthouse pass; README with setup, env vars, deploy, "Supabase paused? how to restore", backup notes. ✅ Final checkpoint.

Commit after each step with a clear message. Keep a `DECISIONS.md` log of any choice you made that this brief didn't specify.

---

## 11. Phase 2 (do NOT build now — just keep the schema ready)

**Canonical order steps** (both `Order-Tracker` and `Admin-Orders` must use these, §2.1 #6):

1. الطلب اتأكد
2. الفلوس اتحفظت
3. الفحص *(skipped for `inspected` devices)*
4. تقرير الفحص *(skipped for `inspected` devices; buyer confirms or cancels → full refund)*
5. الشحن *(to the buyer's door)*
6. الاستلام
7. فترة التجربة 3 أيام

After step 7 the order moves to `released_to_seller` («اتحوّل للبايع») — a final status, not a step on the timeline. Side exits: `cancelled_refunded`, `returned`, `replaced`.

Also in Phase 2: 500 ج.م reservation, manual payment confirmation with reference + receipt, «حوّل للبايع» action, buyer order tracker page, admin Orders & Payments pages (designs exist), the «تابع طلبك» entry in the avatar menu, email notifications, later a payment gateway (Paymob/Fawry) and WhatsApp Business API.

---

## 12. Open questions — do NOT decide these yourself; leave a clear TODO and list them in your final report

1. FAQ answer about the platform commission (design has a placeholder).
2. Real WhatsApp number, email, social links, bank/InstaPay transfer details.
3. Repair-service terms (seller can request repair of a fault) and the optional device-deposit (storage) service details.
4. Whether extra/accessory photos count toward the 10-photo limit.
5. Whether «ضمان تشغيل 3 أيام» stays on the listing pages (it was removed from Terms).
6. Legal set-up for holding buyers' money (needs a lawyer/bank — out of scope for code).
7. Exact delivery estimate including inspection (design shows `[5 – 7]`).
8. **Inspection checklist:** keep 4 fixed core items for every device, or add per-device-type templates (e.g. unit: chair/hydraulics, turbine lines, light…; autoclave: chamber/gasket, Bowie-Dick/Helix…)? Phase 1 ships core-only with optional extra rows.
9. **Launch coverage:** which governorates are served at launch (FAQ «بتوصلوا لأنهي محافظات؟» needs `[المحافظات المتاحة]`).
10. **Installation:** the order tracker mentions «الاستلام والتركيب». Is on-site installation a service the platform offers? If not, the Phase 2 label stays «الاستلام».

---

## 13. Working rules for you (Claude Code)

- Read the relevant `design-reference/*.dc.html` file **before** building each page and match it — then apply §2.1 overrides.
- Arabic UI text comes from the design or this brief only. If you need new microcopy (errors, empty states), write short Egyptian Arabic in the same tone and list it in `DECISIONS.md`.
- Never weaken RLS to make something work; fix the query instead.
- Never commit secrets. Never run seeds or destructive migrations against production without asking me.
- If a free-tier limit blocks something, stop and explain the options and costs.
- Prefer simple, boring solutions. Small files, typed everything, no `any`.

---

## 14. Changelog

**2026-10-27** — aligned brief with final design screens:
- Added §2.1 overrides (unified header, door-to-door copy, «ابعت الطلب» submit button, single sort control, code prefixes, Phase 2 step labels).
- `devices`: added public `has_box`, `repaired_before`; public code prefix `L-`.
- `inspections`: checklist rows now `core` (4 required) + optional `category`; added `public_code`; public report view.
- `device_requests`: added `brand_pref`, `needed_by`, `public_code`.
- §11: one canonical 7-step order list; `released_to_seller` is a final status.
- §12: added questions 8–10 (checklist templates, launch coverage, installation).
