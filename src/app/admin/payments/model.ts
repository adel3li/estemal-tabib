import { BUSINESS, sellerNetFromSalePrice } from "@/config/business";
import { STEP_RELEASED, STEP_TRIAL, type Order } from "@/lib/orders/orders";
import type { PmIconName } from "./art";

/** Money state of an order, for the financial table (ADMIN_SPEC §8, §9). */
export type MoneyStatus = "pending" | "held" | "trial" | "ready" | "paid" | "refunded";

export const ST: Record<MoneyStatus, [string, string, string]> = {
  pending: ["لسه مدفعش", "#FBEEDC", "#8A4209"],
  held: ["محفوظ", "#E6EDF7", "#24508F"],
  trial: ["في فترة الضمان", "#E3F0ED", "#0D5C55"],
  ready: ["جاهز للتحويل", "#EAF5DD", "#3F7A1F"],
  paid: ["اتحوّل للبايع", "#E5EBE8", "#12221F"],
  refunded: ["اتلغى / مرتجع", "#FBE9E7", "#B3261E"],
};

export type Tab = "all" | MoneyStatus;
export const TABS: [Tab, string][] = [
  ["all", "الكل"], ["pending", "لسه مدفعش"], ["held", "محفوظ"], ["trial", "في فترة الضمان"],
  ["ready", "جاهز للتحويل"], ["paid", "اتحوّل"], ["refunded", "اتلغى / مرتجع"],
];

export function moneyStatus(o: Order, now: number): MoneyStatus {
  if (o.status !== "active") return "refunded";
  if (o.step >= STEP_RELEASED) return "paid";
  if (o.step === STEP_TRIAL) return o.trialEndsAt && Date.parse(o.trialEndsAt) <= now ? "ready" : "trial";
  return o.collected > 0 ? "held" : "pending";
}

export const iconOf = (o: Order): PmIconName => (o.sym === "unit" ? "unit" : o.sym === "small" ? "hand" : "box");

/** Seller net: fixed amount from the listing when known (ADMIN_SPEC §3), else 85%. */
/** Seller net for the whole order: fixed per-unit amount × units (ADMIN_SPEC §3), else 85% of the total. */
export const netOf = (o: Order) => (o.sellerNet ? o.sellerNet * (o.quantity ?? 1) : sellerNetFromSalePrice(o.amount));
export const FEE_PCT = `${Math.round(BUSINESS.platformFeeMaxRate * 100)}%`;
