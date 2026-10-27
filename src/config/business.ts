// Single source of truth for business rules — PHASE1_PROMPT.md §5.
// Never hard-code these values elsewhere.

export const BUSINESS = {
  platformFeeMaxRate: 0.15, // seller net = round(salePrice * 0.85)
  sellerSeriousnessFeeEGP: 300, // paid after submitting a device (manual in Phase 1)
  buyerReservationDepositEGP: 500, // Phase 2 (deducted from price)
  trialDays: 3, // replacement/return + money held after delivery
  minListingDays: 7, // a listing stays up at least this long (seller terms)
  sellerHandoverBusinessDays: 3, // seller must hand the device over within this after a purchase
  maintenanceMonthsOptions: [3, 6] as const,
  deliveryDaysInspected: "2 – 5",
  deliveryDaysWithInspection: "[5 – 7]", // TODO(open question §12.7)
  photos: { min: 2, max: 10 },
  videoSeconds: { min: 15, max: 60 },
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
