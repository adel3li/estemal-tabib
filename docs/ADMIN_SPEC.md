# Control panel (لوحة التحكم) — requirements from the client

Source: Mohamed El-Shebshery's answers to the dashboard questionnaire (WhatsApp, 2026-11-03,
two rounds). This file is the reference for building `/admin`. Where it differs from
`PHASE1_PROMPT.md`, this file wins (it's newer and comes from the client). Open points are
at the bottom with the default we'll use until he says otherwise.

## 1. Roles

| Role | Can | Cannot |
|---|---|---|
| **Super Admin** (المدير الأساسي) | Everything: data entry, financial approvals, profit, confirming orders, «اعتمد ونشّر» | — |
| **Marketing & follow-up team** (فريق التسويق والمتابعة) | See high-demand products / market analytics; track orders (shipping/delivery); see customers' phone numbers to contact them on WhatsApp; **update order status** | See company profit, total expenses, or full financial records |
| Technicians, traders | **No accounts.** Reports arrive on WhatsApp; the admin enters and reviews them | — |

## 2. Sell request lifecycle («اعرض جهازك»)

1. Seller submits details + photos. **No payment at submission.**
2. Admin reviews **within 24 hours** — mainly: is the price logical for the market?
3. **Accept** → the admin sets the **seriousness fee amount for this device** (minimum 300 ج.م, scales with value) and asks the seller to pay. **The listing is published only once the fee arrives.**
4. **Reject** — instant-rejection reasons: out of scope · stolen/suspicious · damaged and seller refuses repair · description doesn't match · poor/late communication from the seller.
   Acceptance factors: easy to transport · geographically close · logical price · trusted seller/trader.
5. **3-day no-reply rule:** counts from the date/time of **our FIRST message** to the seller (not the last), so it can't be gamed. After 3 working days → listing cancelled, fee kept.

## 3. Listings

- Admin may edit/correct anything before publishing.
- **Seller's net amount is fixed.** Any discount on the public price comes **only out of the platform's margin**. The seller's price changes only with their personal consent.
- Photos: seller's photos first; the admin uploads the official photos after the in-house inspection. **Minimum 2 photos** per listing.
- **Featured:** at most **7 days** per listing; no limit on how many at once.
- Every listing maps to one of the 14 device types.
- **Reserved** (محجوز): shown publicly; can be switched back to available instantly if the buyer cancels.
- **Sold** (تم البيع): shown with «تم البيع» for **3 days (the warranty window)**, then **archived automatically**. If the buyer returns it within the window, removing «sold» makes the same listing active again (no new ad).

## 4. Inspection

- **Always at our headquarters. Technicians never go to the seller.** If the device stays with the seller, then as soon as a buyer orders it the **seller ships it to HQ at their own cost**; it's inspected there before it ships to the buyer.
- One standard checklist for all device types (no per-type templates for now).
- **«اعتمد ونشّر» — Super Admin only.**
- New defects found in inspection → contact the seller (repair / lower price / return the device) and tell the buyer with full transparency.

## 5. Money, shipping, returns

- **Inspection cost:** sale completes → the platform pays it from its margin. Deal cancelled because of the **seller** (undisclosed defects) → seller's fee is kept. Because of the **buyer** (sudden withdrawal) → buyer's booking fee is kept.
- **Shipping:** seller → HQ at the seller's cost. Device returned to the seller because of us/the seller → we pay that return shipping. Buyer returns within the warranty **for personal reasons** → buyer pays the return shipping and loses the booking fee. Return because of a fault on our side → buyer's fee refunded.
- **Warranty (3 days)** starts at the date/time **the buyer actually receives** the device — marked manually in the dashboard for now (no courier integration yet).
- **Payment methods (launch):** InstaPay, Vodafone Cash, cash on delivery.
- **Funds** are held in the platform owner's personal/official account (legal set-up: open question §12.6).
- **Shipping:** one main courier, plus others for areas it doesn't cover.
- **Installation:** none at launch — most devices are portable; the buyer runs them himself.

## 6. «اطلب جهاز» matching

- When a device is listed, the system matches it against open requests **automatically** and shows an alert in a **dedicated dashboard section** («A matching/similar device was listed for client X» + contact). The admin decides whether to WhatsApp the client.

## 7. Customers

- **Students are fully allowed** to buy and sell — a main target group (terms must say so).
- Accounts can be flagged **جاد / مشبوه أو نصاب**. Flagged accounts are **not blocked**; their submissions/requests go automatically to a **Spam/Archive** section, away from the main queue, for calm manual review.
- **Customer history (CRM):** one page per customer — past requests, conversations, deposit status — so any team member can pick up a customer.

## 8. Dashboard home & reports

- **Priority queue:** (1) new sell requests, (2) buy requests & order confirmations, (3) «اطلب جهاز» matches.
- **Financial/status table** at the bottom: payment status, remaining balance, expected timeline, inspection status.
- **Per-device profit:** expense inputs (shipping, inspection, maintenance) → net profit computed automatically. Super Admin only.
- **Export** to Excel (XLSX/CSV).
- **Notifications inside the dashboard only** (no paid WhatsApp/SMS services).
- **Settings:** editable official WhatsApp number, InstaPay/bank transfer details, social links.

## 9. Launch priorities (client's top 3)

1. Complete product page (photos, condition, data).
2. **Order record & tracking** — where the device is, seller and buyer details.
3. **Financial table** — payments, amounts collected, amounts remaining.

> Items 2 and 3 are "Phase 2" (orders/payments) in `PHASE1_PROMPT.md` §11. The client needs them **at launch**, so they move into the launch build.

## Open points (default until the client answers)

| # | Question | Default we build |
|---|---|---|
| A | Who is on the marketing team (emails)? | Super Admin adds/removes team members from the dashboard |
| B | "High-demand products / market analytics" = ? | Most viewed devices, most saved (favourites), most requested types in «اطلب جهاز» |
| C | "Similar" device for a request = ? | Same type, and price within the budget **or up to 20% above it**; inspected-only requests only match inspected devices |
| D | «تم البيع» 3 days start from? | From the buyer's receipt date (= the warranty window) |
| E | Customer "conversations" | A notes log per customer (team writes a summary of each call/WhatsApp); WhatsApp itself stays outside |
| F | Kept (forfeited) fees — income in the profit report? | Yes, shown as a separate line |
| G | Seller fee refund | Refunded in full when the sale completes (the inspection cost is on the platform) |
