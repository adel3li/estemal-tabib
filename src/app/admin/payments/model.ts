import { BUSINESS, sellerNetFromSalePrice } from "@/config/business";
import type { Payment, PaymentStatus } from "@/lib/demo/orders";

export const TODAY = "27 أكتوبر";

export const ST: Record<PaymentStatus, [string, string, string]> = {
  pending: ["مستني تأكيد الوصول", "#FBEEDC", "#8A4209"],
  held: ["محفوظ", "#E6EDF7", "#24508F"],
  trial: ["في فترة التجربة", "#E3F0ED", "#0D5C55"],
  ready: ["جاهز للتحويل", "#EAF5DD", "#3F7A1F"],
  paid: ["اتحوّل", "#E5EBE8", "#12221F"],
  refunded: ["مرتجع", "#FBE9E7", "#B3261E"],
};
export const LEVEL: Record<PaymentStatus, number> = { pending: 0, held: 2, trial: 3, ready: 4, paid: 5, refunded: 2 };

export type Tab = "all" | PaymentStatus;
export const TABS: [Tab, string][] = [
  ["all", "الكل"], ["pending", "مستني تأكيد الوصول"], ["held", "محفوظ"], ["trial", "في فترة التجربة"],
  ["ready", "جاهز للتحويل"], ["paid", "اتحوّل"], ["refunded", "مرتجع"],
];

export function trialOf(p: Payment): [string, string, string] {
  if (p.st === "trial") {
    const t = p.left >= 3 ? `فاضل ${BUSINESS.trialDays} أيام` : p.left === 2 ? "فاضل يومين" : "فاضل يوم";
    return [t, "#FBEEDC", "#8A4209"];
  }
  if (p.st === "ready" || p.st === "paid") return ["خلصت", "#EAF5DD", "#3F7A1F"];
  if (p.st === "refunded") return ["اترجع", "#FBE9E7", "#B3261E"];
  return ["لسه مبدأتش", "#F5F7F4", "#4A5A56"];
}

export const netOf = (p: Payment) => sellerNetFromSalePrice(p.amount);
export const feeOf = (p: Payment) => p.amount - netOf(p);
export const FEE_PCT = `${Math.round(BUSINESS.platformFeeMaxRate * 100)}%`;
export const NET_FACTOR = `×${(1 - BUSINESS.platformFeeMaxRate).toFixed(2)}`;

export type Toast = { txt: string; bad?: boolean };
