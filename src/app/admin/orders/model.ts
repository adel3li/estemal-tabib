import { BUSINESS, sellerNetFromSalePrice } from "@/config/business";
import { INSPECTION_LABEL, fmt } from "@/lib/demo/labels";
import { AR_DIGITS, ORDER_STEPS, STEP_RELEASED, type Order } from "@/lib/demo/orders";

export type Filter = "all" | "closed" | number;

export const isClosed = (o: Order) => o.step >= STEP_RELEASED || o.status !== "active";

export function inFilter(o: Order, f: Filter): boolean {
  if (f === "all") return true;
  if (f === "closed") return isClosed(o);
  return o.status === "active" && o.step === f;
}

export const FILTERS: [Filter, string][] = [
  ["all", "الكل"],
  ...ORDER_STEPS.map((n, i): [Filter, string] => [i, `${AR_DIGITS[i]} · ${n}`]),
  ["closed", "اتقفل"],
];

export function stepCol(o: Order): [string, string] {
  if (o.status !== "active") return ["#FBE9E7", "#B3261E"];
  const st = o.step;
  if (st >= 6) return ["#EAF5DD", "#3F7A1F"];
  if (st === 4 || st === 5) return ["#E6EDF7", "#24508F"];
  if (st === 2 || st === 3) return ["#FBEEDC", "#8A4209"];
  return ["#E3F0ED", "#0D5C55"];
}

export function stepView(o: Order) {
  const cancelled = o.status !== "active";
  const released = o.step >= STEP_RELEASED;
  return {
    no: cancelled ? "✕" : released ? "✓" : `${AR_DIGITS[o.step]}/٧`,
    name: cancelled ? "اتلغى · الفلوس رجعت للمشتري" : released ? "اتقفل · اتحول للبايع" : ORDER_STEPS[o.step],
    pct: `${Math.round((Math.min(o.step + 1, 7) / 7) * 100)}%`,
    bar: cancelled ? "#B3261E" : released ? "#3F7A1F" : "#0D5C55",
  };
}

export const payView = (o: Order): [string, string, string] =>
  o.paid === "dep" ? [`عربون ${BUSINESS.buyerReservationDepositEGP}`, "#FBEEDC", "#8A4209"] : ["كامل", "#EAF5DD", "#3F7A1F"];

export const inspView = (o: Order): [string, string, string] =>
  o.insp === "inspected" ? [INSPECTION_LABEL.inspected, "#0D5C55", "#FFFFFF"] : [INSPECTION_LABEL.on_order, "#E6EDF7", "#24508F"];

export const netTxt = (o: Order) => fmt(sellerNetFromSalePrice(o.amount));

export type Toast = { kind: "ok" | "info"; txt: string };
export const TK = { ok: ["#EAF5DD", "#B9DCA4", "#3F7A1F", "✓"], info: ["#E6EDF7", "#B8C9E4", "#24508F", "i"] } as const;
