// Single source of truth for business rules — PHASE1_PROMPT.md §5.
// Never hard-code these values elsewhere.

export const BUSINESS = {
  platformFeeMaxRate: 0.15, // seller net = round(salePrice * 0.85)
  sellerSeriousnessFeeEGP: 300, // MINIMUM seller fee when the device stays with the seller; the admin sets it per device after accepting (ADMIN_SPEC §2)
  requestBudgetSlack: 0.2, // «اطلب جهاز» matches up to 20% above the buyer's max budget (ADMIN_SPEC open point C)
  featuredMaxDays: 7, // «مميز» switches itself off after this (ADMIN_SPEC §3)
  sellReviewHours: 24, // we review a sell request within this many hours (ADMIN_SPEC §2)
  buyerReservationDepositEGP: 500, // Phase 2 (deducted from price)
  trialDays: 3, // replacement/return + money held after delivery
  minListingDays: 7, // device sent to the platform and left at least this long → no seriousness fee (client, 5 Nov 2026)
  sellerHandoverBusinessDays: 3, // not in the client terms draft (Nov 2026) — unused, kept until the client confirms
  maxDeliveryDays: 14, // terms: longest delivery time from purchase confirmation (client draft, Nov 2026)
  noReplyBusinessDays: 3, // terms: no reply to the platform for this long → listing/booking cancelled, fee kept
  maintenanceMonthsOptions: [1, 3, 6] as const, // per device (client, 5 Nov 2026)
  // Delivery time (client, 5 Nov 2026), to every governorate:
  deliveryDaysInspected: "3 – 5", // already inspected and ready
  deliveryDaysWithInspection: "4 – 7", // inspected after the order
  photos: { min: 2, max: 10 },
  videoSeconds: { min: 5, max: 30 }, // client asked for 5–30 s (brief said 15–60)
  codePrefixes: {
    device: "L-",
    submission: "#",
    inspection: "F-",
    request: "R-",
    order: "#",
  },
  // WhatsApp: the project's number (Adel, Nov 2026). «الإعدادات» in the dashboard overrides it.
  // TODO(open question §12.2): real email, social and transfer details
  contact: {
    whatsapp: "01034564437",
    email: "[البريد الإلكتروني]",
    social: "[حسابات السوشيال ميديا]",
  },
  feeTransferDetails: "[بيانات التحويل]",
} as const;

export type MaintenanceMonths = (typeof BUSINESS.maintenanceMonthsOptions)[number];

/** «شهر» / «شهرين» / «3 شهور» (Egyptian Arabic). */
export function monthsAr(n: number): string {
  return n === 1 ? "شهر" : n === 2 ? "شهرين" : `${n} شهور`;
}
const MAINT = BUSINESS.maintenanceMonthsOptions;
/** «من شهر لـ 6 شهور». */
export const MAINT_SPAN = `من ${monthsAr(MAINT[0])} لـ ${monthsAr(MAINT[MAINT.length - 1])}`;
/** «شهر أو 3 أو 6 شهور». */
export const MAINT_LIST = `${MAINT.slice(0, -1).map((m) => (m <= 2 ? monthsAr(m) : String(m))).join(" أو ")} أو ${monthsAr(MAINT[MAINT.length - 1])}`;

/** Seller net from sale price, per §5 (×0.85, rounded). */
export function sellerNetFromSalePrice(salePrice: number): number {
  return Math.round(salePrice * (1 - BUSINESS.platformFeeMaxRate));
}

/** Sale price from desired seller net, per §5 (÷0.85, rounded). */
export function salePriceFromSellerNet(sellerNet: number): number {
  return Math.round(sellerNet / (1 - BUSINESS.platformFeeMaxRate));
}
