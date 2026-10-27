// Phase 2 demo data: buyer orders + held payments (PHASE1_PROMPT.md §11).
// Not part of the shared demo store: orders live in their own tiny store,
// persisted to localStorage so /admin/orders and the buyer tracker
// (/orders/[id]) share state in the same browser.

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { BUSINESS, type MaintenanceMonths } from "@/config/business";
import type { InspectionState } from "./types";

/** Canonical order steps (§11). Index 0..6; 7 = released to seller (final). */
export const ORDER_STEPS = [
  "الطلب اتأكد",
  "الفلوس اتحفظت",
  "الفحص",
  "تقرير الفحص",
  "الشحن",
  "الاستلام",
  `فترة التجربة ${BUSINESS.trialDays} أيام`,
] as const;

export const STEP_REPORT = 3;
export const STEP_SHIPPING = 4;
export const STEP_RELEASED = 7;
export const AR_DIGITS = ["١", "٢", "٣", "٤", "٥", "٦", "٧"] as const;

export type OrderSym = "unit" | "box" | "xray" | "small";

export type OrderLog = { when: string; txt: string; who: string; col: string };

export type Order = {
  id: string; // «#2043»
  date: string;
  device: string;
  cat: string;
  sym: OrderSym;
  gov: string;
  /** store device this order is for, when one exists */
  deviceId?: string;
  buyer: string;
  bGov: string;
  seller: string;
  sellerCo?: boolean;
  amount: number;
  paid: "full" | "dep";
  /** 0..6 = index in ORDER_STEPS, 7 = «اتحوّل للبايع» */
  step: number;
  insp: InspectionState;
  maint: MaintenanceMonths;
  co: string;
  no: string;
  eta: string; // yyyy-mm-dd
  status: "active" | "cancelled_refunded";
  log: OrderLog[];
};

const L = (when: string, txt: string, who = "النظام", col = "#9FB2AB"): OrderLog => ({ when, txt, who, col });

const DEP = BUSINESS.buyerReservationDepositEGP;

export const ORDER_SEED: Order[] = [
  {
    id: "#2041", date: "20 أكتوبر", device: "يونيت أسنان Fona", cat: "يونيت أسنان", sym: "unit", gov: "القاهرة",
    buyer: "[د. المشتري ١]", bGov: "الجيزة", seller: "[د. البايع ١]", amount: 85000, paid: "full", step: 4,
    insp: "inspected", maint: 6, co: "[شركة الشحن]", no: "[EG-000000]", eta: "2026-10-29", status: "active",
    log: [
      L("25 أكتوبر", "الجهاز اتسلّم لشركة الشحن", "[اسم الموظف]", "#0D5C55"),
      L("23 أكتوبر", "تقرير الفحص اتبعت للمشتري"),
      L("20 أكتوبر", "الفلوس اتحفظت · دفع كامل", "النظام", "#3F7A1F"),
      L("20 أكتوبر", "الطلب اتأكد"),
    ],
  },
  {
    id: "#2042", date: "26 أكتوبر", device: "أوتوكلاف Class B 18 لتر", cat: "أوتوكلاف", sym: "box", gov: "الإسكندرية",
    deviceId: "L-202",
    buyer: "[د. المشتري ٢]", bGov: "البحيرة", seller: "استعمال طبيب", sellerCo: true, amount: 45000, paid: "dep", step: 0,
    insp: "inspected", maint: 3, co: "", no: "", eta: "", status: "active",
    log: [L("26 أكتوبر", `الطلب اتأكد · حجز بعربون ${DEP} ج.م`)],
  },
  {
    // The header «تابع طلبك» demo order: inspect-on-order, waiting for the buyer
    // to confirm the inspection report (step «تقرير الفحص»).
    id: "#2043", date: "25 أكتوبر", device: "أوتوكلاف Class B 23 لتر", cat: "أوتوكلاف", sym: "box", gov: "الجيزة",
    buyer: "[د. المشتري ٣]", bGov: "القاهرة", seller: "[د. البايع ٢]", amount: 38000, paid: "full", step: 3,
    insp: "on_order", maint: 3, co: "", no: "", eta: "", status: "active",
    log: [
      L("27 أكتوبر", "تقرير الفحص اتبعت للمشتري · مستنيين تأكيده", "[اسم الموظف]", "#F2A33A"),
      L("27 أكتوبر", "الفحص خلص عند البايع · [اسم الفني ٢]", "[اسم الموظف]", "#0D5C55"),
      L("26 أكتوبر", "ميعاد الفحص اتحدد: الثلاثاء 27 · 1:30 م", "[اسم الموظف]", "#24508F"),
      L("25 أكتوبر", "الفلوس اتحفظت · دفع كامل", "النظام", "#3F7A1F"),
      L("25 أكتوبر", "الطلب اتأكد"),
    ],
  },
  {
    id: "#2044", date: "24 أكتوبر", device: "إندو موتور لاسلكي", cat: "إندو موتور", sym: "small", gov: "الدقهلية",
    buyer: "[د. المشتري ٤]", bGov: "الغربية", seller: "[د. البايع ٣]", amount: 12500, paid: "dep", step: 1,
    insp: "on_order", maint: 3, co: "", no: "", eta: "", status: "active",
    log: [L("24 أكتوبر", `العربون اتحفظ · ${DEP} ج.م`, "النظام", "#3F7A1F"), L("24 أكتوبر", "الطلب اتأكد")],
  },
  {
    id: "#2045", date: "15 أكتوبر", device: "لايت كيور LED", cat: "لايت كيور", sym: "small", gov: "القليوبية",
    buyer: "[د. المشتري ٥]", bGov: "القاهرة", seller: "[د. البايع ٤]", amount: 4800, paid: "full", step: 6,
    insp: "inspected", maint: 3, co: "[شركة الشحن]", no: "[EG-000001]", eta: "2026-10-24", status: "active",
    log: [
      L("25 أكتوبر", `المشتري استلم · بدأت فترة التجربة ${BUSINESS.trialDays} أيام`, "النظام", "#0D5C55"),
      L("22 أكتوبر", "الجهاز اتشحن"),
      L("15 أكتوبر", "الطلب اتأكد"),
    ],
  },
  {
    id: "#2046", date: "18 أكتوبر", device: "أشعة X-Mind", cat: "أشعة", sym: "xray", gov: "القاهرة",
    buyer: "[د. المشتري ٦]", bGov: "الشرقية", seller: "[د. البايع ٥]", amount: 62000, paid: "full", step: 5,
    insp: "inspected", maint: 6, co: "[شركة الشحن]", no: "[EG-000002]", eta: "2026-10-27", status: "active",
    log: [
      L("27 أكتوبر", "المندوب وصل للمشتري، مستنيين تأكيد الاستلام", "[اسم الموظف]", "#24508F"),
      L("24 أكتوبر", "الجهاز اتشحن"),
      L("18 أكتوبر", "الطلب اتأكد"),
    ],
  },
];

/** Inspection steps (الفحص / تقرير الفحص) are skipped for already-inspected devices (§11). */
export const isSkipped = (o: Pick<Order, "insp">, i: number) =>
  o.insp === "inspected" && (i === 2 || i === STEP_REPORT);

export function nextStep(o: Order): number {
  let n = o.step + 1;
  while (n < STEP_RELEASED && isSkipped(o, n)) n++;
  return n;
}

/** Amount currently held for an order. */
export const heldOf = (o: Order) => (o.step < 1 && o.paid === "dep" ? 0 : o.paid === "full" ? o.amount : DEP);

/** Phone for wa.me only when it's a real number (seed phones are «[01xxxxxxxxx]» placeholders). */
export const realPhone = (phone: string) => (phone.replace(/[^0-9]/g, "").length >= 10 ? phone : undefined);

export function nowLabel(): string {
  const d = new Date();
  const m = d.getMinutes();
  return `النهارده ${d.getHours()}:${m < 10 ? "0" : ""}${m}`;
}

// ── Held payments (Admin-Payments) — local demo seed ─────────────────────
export type PaymentStatus = "pending" | "held" | "trial" | "ready" | "paid" | "refunded";
export type Payment = {
  id: string; // «2051»
  device: string;
  icon: "unit" | "box" | "hand" | "cam";
  buyer: string;
  phone: string;
  gov: string;
  seller: string;
  amount: number;
  method: string;
  recv: string;
  deliv: string;
  st: PaymentStatus;
  left: number;
  ref: string;
  receipt: string;
  doneOn?: string;
};

const P = (p: Omit<Payment, "buyer" | "phone" | "seller">): Payment => ({
  buyer: "[د. ...]",
  phone: "[01xxxxxxxxx]",
  seller: "[د. ...]",
  ...p,
});

export const PAYMENTS: Payment[] = [
  P({ id: "2051", device: "يونيت أسنان كامل", icon: "unit", gov: "القاهرة", amount: 85000, method: "إنستاباي", recv: "", deliv: "", st: "pending", left: 0, ref: "", receipt: "" }),
  P({ id: "2049", device: "أوتوكلاف Class B", icon: "box", gov: "الجيزة", amount: 45000, method: "تحويل بنكي", recv: "", deliv: "", st: "pending", left: 0, ref: "", receipt: "" }),
  P({ id: "2047", device: "جهاز أشعة حائط", icon: "box", gov: "الدقهلية", amount: 62000, method: "بطاقة", recv: "24 أكتوبر", deliv: "", st: "held", left: 0, ref: "[CARD-xxxxxx]", receipt: "" }),
  P({ id: "2044", device: "إندو موتور", icon: "hand", gov: "الإسكندرية", amount: 14500, method: "إنستاباي", recv: "20 أكتوبر", deliv: "25 أكتوبر", st: "trial", left: 1, ref: "[IPN-xxxxxxxx]", receipt: "إيصال.jpg" }),
  // #2043 kept consistent with the order seed (autoclave, waiting on the inspection report → held).
  P({ id: "2043", device: "أوتوكلاف Class B 23 لتر", icon: "box", gov: "القاهرة", amount: 38000, method: "بطاقة", recv: "25 أكتوبر", deliv: "", st: "held", left: 0, ref: "[CARD-xxxxxx]", receipt: "" }),
  P({ id: "2040", device: "لايت كيور", icon: "hand", gov: "الجيزة", amount: 6500, method: "إنستاباي", recv: "18 أكتوبر", deliv: "23 أكتوبر", st: "ready", left: 0, ref: "[IPN-xxxxxxxx]", receipt: "إيصال.png" }),
  P({ id: "2038", device: "كاميرا إنترا أورال", icon: "cam", gov: "الشرقية", amount: 18000, method: "تحويل بنكي", recv: "17 أكتوبر", deliv: "22 أكتوبر", st: "ready", left: 0, ref: "[BNK-xxxxxxxx]", receipt: "إيصال.pdf" }),
  P({ id: "2035", device: "روتاري", icon: "hand", gov: "القاهرة", amount: 9800, method: "إنستاباي", recv: "12 أكتوبر", deliv: "16 أكتوبر", st: "refunded", left: 0, ref: "[IPN-xxxxxxxx]", receipt: "إيصال.jpg", doneOn: "18 أكتوبر" }),
  P({ id: "2031", device: "أبيكس لوكيتور", icon: "hand", gov: "الغربية", amount: 7200, method: "بطاقة", recv: "8 أكتوبر", deliv: "12 أكتوبر", st: "paid", left: 0, ref: "[CARD-xxxxxx]", receipt: "", doneOn: "15 أكتوبر" }),
  P({ id: "2028", device: "أوتوكلاف", icon: "box", gov: "القليوبية", amount: 41000, method: "تحويل بنكي", recv: "5 أكتوبر", deliv: "9 أكتوبر", st: "paid", left: 0, ref: "[BNK-xxxxxxxx]", receipt: "إيصال.pdf", doneOn: "12 أكتوبر" }),
];

export type Reservation = { order: string; buyer: string; device: string; date: string };
export const RESERVATIONS: Reservation[] = [
  { order: "طلب #2053", buyer: "[د. ...]", device: "أوتوكلاف Class B", date: "27 أكتوبر" },
  { order: "طلب #2052", buyer: "[د. ...]", device: "يونيت أسنان", date: "26 أكتوبر" },
  { order: "طلب #2050", buyer: "[د. ...]", device: "موتور جراحة وزراعة", date: "25 أكتوبر" },
];

// ── Store (localStorage + useSyncExternalStore) ─────────────────────────
const STORAGE_KEY = "istimal-tabib-orders";
const VERSION = 1;

let current: Order[] | null = null;
const listeners = new Set<() => void>();

function read(): Order[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { version: number; orders: Order[] };
      if (parsed.version === VERSION && Array.isArray(parsed.orders)) return parsed.orders;
    }
  } catch {
    /* blocked storage — fall back to the seed */
  }
  return ORDER_SEED;
}

function getSnapshot(): Order[] {
  if (current === null) current = read();
  return current;
}
const getServerSnapshot = () => ORDER_SEED;

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY && e.key !== null) return;
    current = read();
    listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(fn: (orders: Order[]) => Order[]) {
  current = fn(getSnapshot());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, orders: current }));
  } catch {
    /* storage full / blocked — keep working in memory */
  }
  listeners.forEach((l) => l());
}

/** «#2043», «2043» or «%232043» → «#2043» */
export const normalizeOrderId = (id: string) => `#${decodeURIComponent(id).replace(/^#/, "")}`;

export type OrdersApi = {
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  updateOrder: (id: string, patch: Partial<Order>, log?: OrderLog) => void;
  /** Moves to the next canonical step (skipping inspection steps for inspected devices). */
  advanceOrder: (id: string, log: (next: number) => OrderLog) => number;
  /** Moves to `step` only if the order is behind it. */
  ensureStep: (id: string, step: number, log: OrderLog) => void;
  cancelOrder: (id: string, log: OrderLog) => void;
  reset: () => void;
};

export function useOrders(): OrdersApi {
  const orders = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === normalizeOrderId(id)), [orders]);

  const updateOrder = useCallback<OrdersApi["updateOrder"]>((id, patch, log) => {
    commit((all) => all.map((o) => (o.id === id ? { ...o, ...patch, log: log ? [log, ...o.log] : o.log } : o)));
  }, []);

  const advanceOrder = useCallback<OrdersApi["advanceOrder"]>((id, log) => {
    let next = -1;
    commit((all) =>
      all.map((o) => {
        if (o.id !== id) return o;
        next = Math.min(nextStep(o), STEP_RELEASED);
        return { ...o, step: next, log: [log(next), ...o.log] };
      }),
    );
    return next;
  }, []);

  const ensureStep = useCallback<OrdersApi["ensureStep"]>((id, step, log) => {
    commit((all) => all.map((o) => (o.id === id && o.step < step && o.status === "active" ? { ...o, step, log: [log, ...o.log] } : o)));
  }, []);

  const cancelOrder = useCallback<OrdersApi["cancelOrder"]>((id, log) => {
    commit((all) => all.map((o) => (o.id === id ? { ...o, status: "cancelled_refunded", log: [log, ...o.log] } : o)));
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    current = ORDER_SEED;
    listeners.forEach((l) => l());
  }, []);

  return useMemo(
    () => ({ orders, getOrder, updateOrder, advanceOrder, ensureStep, cancelOrder, reset }),
    [orders, getOrder, updateOrder, advanceOrder, ensureStep, cancelOrder, reset],
  );
}
