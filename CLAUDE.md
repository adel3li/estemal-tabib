# استعمال طبيب (Istimal Tabib): project context

A marketplace for **used dental equipment in Egypt**. Every device is inspected, the buyer's money is held in escrow until they receive and try the device, and every device carries a written warranty.

- **Slogan:** «من دكتور أسنان لدكتور أسنان… بثقة»
- **Live design demo:** https://demo-1f24d4cc-5720-4d85-be95-cbef659bcd6a-4ue7xqmdw.vercel.app
- **Design source:** `design-reference/` (five screens; details below)

---

## 1. The problem and the product

- **Buyers** are dentists, often young ones or those fitting out a new clinic. They are afraid to buy used equipment because of hidden faults, no warranty, and no way to judge a device's technical condition.
- **Sellers** are dentists upgrading their clinics. They are tired of middlemen, non-serious buyers and wasted time.
- **The platform** acts as the trusted middleman that inspects devices and guarantees both sides. **Trust is the product.** The inspection report and the escrow are the core features, not the catalog.

## 2. Business rules (source of truth)

### 2.1 Two inspection states
Every listing is in exactly one of these states, and the UI must show which one clearly:

| State | Badge | Meaning |
|---|---|---|
| `inspected` | «تم الفحص» (teal, solid) | Inspected before listing. The full report is visible before payment. Photos come from the inspection team. Faster shipping. |
| `inspect_on_order` | «يُفحص عند الطلب» (blue, soft) | Inspected at the seller's place **after** the buyer orders and **before** shipping. Photos come from the seller until then. The report is sent to the buyer before shipping. **If the device doesn't match, the buyer gets a full refund.** |

### 2.2 Warranty (on every device)
- Replacement or return: **14 days** («استبدال أو استرجاع»)
- Operation warranty: **14 days** («ضمان تشغيل»)
- Maintenance: **3 or 6 months, depending on the product**. Store this per listing as `maintenance_months ∈ {3, 6}`.
- Periods start on the delivery date.

### 2.3 Escrow
- The buyer pays and the platform holds the money.
- Money is released to the seller **only after** delivery and the trial period, with the buyer's confirmation.
- At the inspect-on-order step, the buyer can **cancel and get a full refund** if the report isn't satisfactory.

### 2.4 Trust rules
- Sellers are verified dentists («طبيب أسنان موثّق»).
- Defects are **always disclosed**, with photos, in the listing and in the report.
- Each report names its inspector: a technician plus a reviewing dentist, the inspection date, and the device's serial number.
- Price is shown against a fair market band («في نطاق السعر العادل للسوق»).

## 3. Order status flow

```
paid_in_escrow
  → inspection_at_seller        (inspect_on_order only)
  → report_sent_awaiting_buyer  (inspect_on_order only; buyer confirms or cancels → refunded)
  → shipping
  → delivered
  → trial_period (14 days)
  → released_to_seller          (maintenance period starts/continues)
Side exits: cancelled_refunded, returned, replaced
```
For `inspected` listings, skip the two inspection steps.

## 4. Draft data model

- **Listing:** id, title, category (`rotary | camera | light_cure | loupe | motor`, shown as روتاري، كاميرا، لايت كيور، لوب، موتور), brand, model, year, origin_country, price_egp, fair_price_band, inspection_state, maintenance_months, seller_id, sell_reason, photos[], videos[], status
- **InspectionReport:** id, listing_id, serial_number, date, technician_name, reviewing_dentist_name, operation_score, appearance_score, replaced_parts[], checklist_items[{label, result: pass|note|fail, note, photo}], disclosed_defects[{description, photo}]
- **Seller:** id, name, verified_dentist (bool), phone/WhatsApp
- **Order:** id, listing_id, buyer_id, amount_egp, status (see §3), timestamps per step, warranty_start_date
- **DeviceRequest** ("can't find what you're looking for"): device type, budget, contact

Checklist templates are **per category** (`CHECKLIST_TEMPLATES` in `src/lib/data.ts`). Examples:
- **Rotary:** speed and stability; noise and vibration; bearings and heat; water/air spray; fibre-optic light; bur grip.
- **Light cure:** output (mW/cm²) on a radiometer; wavelength and lamp type; timer and modes; battery and charger; light guide free of cracks; heat during use.

The original demo screens (`design-reference/`) still show dental units and autoclaves; the device categories have since changed to the five above.

## 5. Pages (all built in the demo)

| Route (suggested) | Demo file | Contents |
|---|---|---|
| `/` | `Main.dc.html` | Header; hero with an inspection-summary card; 4-step "how it works"; the two inspection states explained; featured listings with filter chips; 3-part warranty section (dark); categories; seller section with a sell form; FAQ; footer with WhatsApp |
| `/devices` | `Browse.dc.html` | Search; filters for inspection state, category and maintenance period (3/6), with clear-all; live result count; sort; listing grid; empty state; "can't find the device you want?" request banner |
| `/devices/[id]` (inspected) | `Listing-Inspected.dc.html` | Gallery with a video and a defect photo; price with fair-price pill; warranty card; escrow note; Order and WhatsApp buttons; verified seller; full inspection report with checklist and disclosed defects |
| `/devices/[id]` (on order) | `Listing-OnOrder.dc.html` | Same layout with a blue badge; "photos from the seller" note; refund promise; checklist of **what will be checked**; post-order steps |
| `/orders/[id]` | `Order-Tracker.dc.html` | Vertical status timeline (§3), with the current step "report sent" and buttons to confirm shipping or cancel and refund; side cards for "where is your money now?", warranty dates and help |

Not built yet: a full multi-step sell flow, auth/accounts, a seller dashboard, an admin/inspector panel for writing reports, payments.

## 6. Design system

- **Direction:** Arabic **RTL first** (`dir="rtl"`, `lang="ar"`), **mobile-first** (most traffic comes from links shared in WhatsApp and Facebook groups). Clean and medical, with real photos and no stock imagery.
- **Font:** IBM Plex Sans Arabic (Google Fonts), weights 400/500/600/700.
- **Colors:**

| Token | Hex | Use |
|---|---|---|
| ink | `#12221F` | body text |
| muted | `#4A5A56` | secondary text |
| ground | `#F5F7F4` | page background |
| surface | `#FFFFFF` | cards |
| line | `#DCE3DF` / `#E5EBE8` | borders |
| primary (teal) | `#0D5C55` | brand, primary buttons, «تم الفحص» |
| primary-soft | `#E3F0ED` | pass chips |
| dark | `#0F2A26` / `#173A35` | warranty section, footer |
| accent (amber) | `#F2A33A` | secondary CTA (dark text on top) |
| info (blue) | `#24508F` on `#E6EDF7` | «يُفحص عند الطلب» |
| warn | `#8A4209` on `#FBEEDC` | disclosed defects, notes |

- **Shape:** 12–14px radius for buttons and inputs, 18–24px for cards, pill badges.
- **Icons:** inline stroke icons (1.8 stroke). No emoji.
- **Accessibility:** real `<a>`, `<button>` and `<label>`; touch targets at least 44px; text contrast of at least 4.5:1.

## 7. Tone and copy

- **Dentist to dentist**, in plain Egyptian Arabic, confident and calm, never salesy.
- Use dental terms the way dentists say them, without translating them: يونيت، أوتوكلاف، إندو موتور، أبيكس لوكيتور، لايت كيور، RVG.
- Show prices in EGP («ج.م»).

## 8. Placeholders still in the copy (need real data or decisions)

`[السعر]`, `[السنة]`, `[الماركة / الموديل]`, `[اسم الطبيب]`, `[اسم الفني]`, `[عدد الأيام]` (inspect-on-order turnaround), `[نموذج العمولة]` (who pays the commission and how much), `[المحافظات المتاحة]` (launch coverage), `[المعيار النهائي]` (what decides 3 or 6 months of maintenance), `[المبلغ]`, report numbers and serials.

## 9. Open decisions

1. Do the 14-day replacement/return window and the 14-day operation warranty run at the same time?
2. Who pays shipping on returns?
3. Fee model: a commission from the seller, the buyer, or both?
4. Launch geography: Cairo first, or nationwide?
5. Inspection capacity: in-house technicians, or partner service companies?
6. Payment rails for escrow (e.g., InstaPay, bank transfer, a payment gateway).

## 10. Suggested build approach

- Next.js (App Router) + Tailwind (RTL), deployed on Vercel. The demo is already imported there.
- Start with static pages from the demo, using a seeded JSON of sample listings. Then add the data model, an admin/inspector panel for creating reports, and the order flow. Add payments last.
- Keep the badge, warranty card, inspection checklist and order timeline as reusable components.

## About `design-reference/`

These are the exported design screens. They use a design-canvas format (`.dc.html`) that loads a `support.js` runtime and won't run standalone. **Treat them as visual and copy reference** (layout, exact Arabic text, colors, spacing), not as code to ship. The Browse page's filter logic is in its `<script data-dc-script>` block.
