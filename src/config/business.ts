// Single source of truth for business rules — PHASE1_PROMPT.md §5.
// Never hard-code these values elsewhere.

export const BUSINESS = {
  platformFeeMaxRate: 0.15, // seller net = round(salePrice * 0.85)
  sellerSeriousnessFeeEGP: 300, // MINIMUM seller fee; the admin sets it per device after accepting (ADMIN_SPEC §2)
  requestBudgetSlack: 0.2, // «اطلب جهاز» matches up to 20% above the buyer's max budget (ADMIN_SPEC open point C)
  sellReviewHours: 24, // we review a sell request within this many hours (ADMIN_SPEC §2)
  buyerReservationDepositEGP: 500, // Phase 2 (deducted from price)
  trialDays: 3, // replacement/return + money held after delivery
  minListingDays: 7, // not in the client terms draft (Nov 2026) — unused, kept until the client confirms
  sellerHandoverBusinessDays: 3, // not in the client terms draft (Nov 2026) — unused, kept until the client confirms
  maxDeliveryDays: 14, // terms: longest delivery time from purchase confirmation (client draft, Nov 2026)
  noReplyBusinessDays: 3, // terms: no reply to the platform for this long → listing/booking cancelled, fee kept
  maintenanceMonthsOptions: [3, 6] as const,
  deliveryDaysInspected: "2 – 5",
  deliveryDaysWithInspection: "[5 – 7]", // TODO(open question §12.7)
  photos: { min: 2, max: 10 },
  videoSeconds: { min: 5, max: 30 }, // client asked for 5–30 s (brief said 15–60)
  codePrefixes: {
    device: "L-",
    submission: "#",
    inspection: "F-",
    request: "R-",
    order: "#",
  },
  // TODO(open question §12.2): real contact + transfer details
  contact: {
    whatsapp: "[رقم الواتساب]",
    email: "[البريد الإلكتروني]",
    social: "[حسابات السوشيال ميديا]",
  },
  feeTransferDetails: "[بيانات التحويل]",
} as const;

export type MaintenanceMonths = (typeof BUSINESS.maintenanceMonthsOptions)[number];

/** Seller net from sale price, per §5 (×0.85, rounded). */
export function sellerNetFromSalePrice(salePrice: number): number {
  return Math.round(salePrice * (1 - BUSINESS.platformFeeMaxRate));
}

/** Sale price from desired seller net, per §5 (÷0.85, rounded). */
export function salePriceFromSellerNet(sellerNet: number): number {
  return Math.round(sellerNet / (1 - BUSINESS.platformFeeMaxRate));
}
