"use client";

// Orders & payments ⇄ Supabase (control panel step 3, docs/ADMIN_SPEC.md §5, §9).
// The team enters orders (buyers order on WhatsApp); every change is written
// straight to the database and the list is reloaded. RLS: admins see all,
// a buyer whose account is linked (orders.buyer_id) sees their own.
//
// The `Order` shape is the one the admin pages and the buyer tracker were
// built on (design files), plus the money fields.

import { artKey } from "@/lib/demo/labels";
import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BUSINESS, type MaintenanceMonths } from "@/config/business";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { DeviceType, InspectionState } from "@/lib/demo/types";
import { typeLabel } from "@/lib/demo/labels";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_URL } from "@/lib/supabase/env";
import { whenAr } from "@/lib/submissions/db";

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

export const STEP_FUNDS = 1;
export const STEP_INSPECTION = 2;
export const STEP_REPORT = 3;
export const STEP_SHIPPING = 4;
export const STEP_DELIVERY = 5;
export const STEP_TRIAL = 6;
export const STEP_RELEASED = 7;
export const AR_DIGITS = ["١", "٢", "٣", "٤", "٥", "٦", "٧"] as const;

const STEP_STATUS = ["confirmed", "funds_held", "inspection", "inspection_report", "shipping", "delivered", "trial", "released_to_seller"] as const;
type StepStatus = (typeof STEP_STATUS)[number];
type DbStatus = StepStatus | "cancelled_refunded" | "returned" | "replaced";

export type OrderSym = "unit" | "box" | "xray" | "small";
export type OrderLog = { when: string; txt: string; who: string; col: string };

export type PayMethod = "instapay" | "vodafone_cash" | "cod";
export const PAY_METHODS: [PayMethod, string][] = [
  ["instapay", "InstaPay"],
  ["vodafone_cash", "فودافون كاش"],
  ["cod", "كاش عند الاستلام"],
];
export const methodLabel = (m?: string | null) => PAY_METHODS.find(([k]) => k === m)?.[1] ?? (m || "—");

export type PaymentKind = "reservation_deposit" | "balance" | "seller_fee" | "refund" | "seller_payout";
export type OrderPayment = { kind: PaymentKind; amount: number; method: string; reference: string; when: string; iso: string };

/** Where the device is right now (ADMIN_SPEC §9 «where the device is»). */
export const LOCATIONS = ["عند البايع", "في المقر", "مع شركة الشحن", "عند المشتري"] as const;

export type Order = {
  dbId: string;
  id: string; // «#2043»
  date: string;
  createdIso: string;
  device: string;
  cat: string;
  sym: OrderSym;
  gov: string;
  deviceId?: string; // L-###
  deviceDbId: string;
  buyerId?: string;
  buyer: string;
  buyerPhone: string;
  bGov: string;
  buyerAddress: string;
  /** Filled by the admin page from the device's sell request (company devices: «استعمال طبيب»). */
  seller: string;
  sellerCo?: boolean;
  /** Seller's fixed net (device_private), filled by the admin page. */
  sellerNet?: number;
  amount: number;
  /** «full» once the money in covers the price. */
  paid: "full" | "dep";
  /** Money in from the buyer (deposit + balance) minus refunds. */
  collected: number;
  remaining: number;
  payMethod?: PayMethod;
  payments: OrderPayment[];
  /** 0..6 = index in ORDER_STEPS, 7 = «اتحوّل للبايع» */
  step: number;
  insp: InspectionState;
  maint: MaintenanceMonths;
  co: string;
  no: string;
  eta: string; // yyyy-mm-dd
  location: string;
  deliveredAt?: string;
  trialEndsAt?: string;
  status: "active" | "cancelled_refunded" | "returned";
  /** Date each step was reached («3 نوفمبر»), by step index. */
  stepDates: Partial<Record<number, string>>;
  log: OrderLog[];
};

const SYM: Partial<Record<DeviceType, OrderSym>> = { unit: "unit", xray: "xray", autoclave: "box", micro: "box", cam: "box" };

/** Inspection steps (الفحص / تقرير الفحص) are skipped for already-inspected devices (§11). */
export const isSkipped = (o: Pick<Order, "insp">, i: number) => o.insp === "inspected" && (i === 2 || i === STEP_REPORT);

export function nextStep(o: Pick<Order, "insp" | "step">): number {
  let n = o.step + 1;
  while (n < STEP_RELEASED && isSkipped(o, n)) n++;
  return Math.min(n, STEP_RELEASED);
}

/** Money currently held for an order. */
export const heldOf = (o: Order) => (o.status === "active" && o.step < STEP_RELEASED ? o.collected : 0);

/** Phone for wa.me only when it's a real number. */
export const realPhone = (phone: string) => (phone.replace(/[^0-9]/g, "").length >= 10 ? phone : undefined);

export function nowLabel(): string {
  return whenAr(new Date().toISOString());
}

/** «#2043», «2043» or «%232043» → «#2043» */
export const normalizeOrderId = (id: string) => `#${decodeURIComponent(id).replace(/^#/, "")}`;

// ── Database mapping ────────────────────────────────────────────────────
type Row = {
  id: string;
  public_code: string;
  buyer_id: string | null;
  device_id: string;
  status: DbStatus;
  price: number;
  delivery_name: string | null;
  delivery_phone: string | null;
  delivery_governorate: string | null;
  delivery_address: string | null;
  payment_method: PayMethod | null;
  shipping_company: string | null;
  tracking_no: string | null;
  eta: string | null;
  device_location: string | null;
  delivered_at: string | null;
  trial_ends_at: string | null;
  created_at: string;
  device: { public_code: string; title: string; type: DeviceType; governorate: string | null; inspection_state: InspectionState; maintenance_months: number } | null;
  events: { status: DbStatus; note: string | null; created_at: string; actor: { full_name: string | null } | null }[];
  payments: { kind: PaymentKind; amount: number; method: string | null; reference: string | null; status: string; created_at: string }[];
};

const COLUMNS =
  "id, public_code, buyer_id, device_id, status, price, delivery_name, delivery_phone, delivery_governorate, delivery_address, payment_method, shipping_company, tracking_no, eta, device_location, delivered_at, trial_ends_at, created_at, device:devices(public_code, title, type, governorate, inspection_state, maintenance_months), events:order_events(status, note, created_at, actor:profiles(full_name)), payments(kind, amount, method, reference, status, created_at)";

const stepOf = (s: DbStatus) => STEP_STATUS.indexOf(s as StepStatus);
const COL: Partial<Record<DbStatus, string>> = { funds_held: "#3F7A1F", released_to_seller: "#3F7A1F", cancelled_refunded: "#B3261E", returned: "#B3261E", shipping: "#24508F", trial: "#0D5C55" };
const IN: PaymentKind[] = ["reservation_deposit", "balance"];

function fromRow(r: Row): Order {
  const events = [...(r.events ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const closed = r.status === "cancelled_refunded" || r.status === "returned" || r.status === "replaced";
  // Closed orders keep the step they stopped at (last step event).
  const step = closed ? Math.max(0, ...events.map((e) => stepOf(e.status))) : stepOf(r.status);
  const pays = (r.payments ?? []).filter((p) => p.status === "confirmed").sort((a, b) => a.created_at.localeCompare(b.created_at));
  const collected = pays.reduce((a, p) => a + (IN.includes(p.kind) ? p.amount : p.kind === "refund" ? -p.amount : 0), 0);
  const d = r.device;
  return {
    dbId: r.id,
    id: r.public_code,
    date: whenAr(r.created_at).split("،")[0],
    createdIso: r.created_at,
    device: d?.title ?? "—",
    cat: d ? typeLabel(d.type) : "",
    sym: (d && SYM[artKey(d.type)]) || "small",
    gov: d?.governorate ?? "",
    deviceId: d?.public_code,
    deviceDbId: r.device_id,
    buyerId: r.buyer_id ?? undefined,
    buyer: r.delivery_name || "—",
    buyerPhone: r.delivery_phone ?? "",
    bGov: r.delivery_governorate ?? "",
    buyerAddress: r.delivery_address ?? "",
    seller: "",
    amount: r.price,
    paid: collected >= r.price ? "full" : "dep",
    collected,
    remaining: Math.max(0, r.price - collected),
    payMethod: r.payment_method ?? undefined,
    payments: pays.map((p) => ({ kind: p.kind, amount: p.amount, method: p.method ?? "", reference: p.reference ?? "", iso: p.created_at, when: whenAr(p.created_at) })),
    step: step < 0 ? 0 : step,
    insp: d?.inspection_state ?? "on_order",
    maint: d?.maintenance_months === 6 ? 6 : 3,
    co: r.shipping_company ?? "",
    no: r.tracking_no ?? "",
    eta: r.eta ?? "",
    location: r.device_location ?? "",
    deliveredAt: r.delivered_at ?? undefined,
    trialEndsAt: r.trial_ends_at ?? undefined,
    status: r.status === "cancelled_refunded" ? "cancelled_refunded" : closed ? "returned" : "active",
    stepDates: Object.fromEntries(
      events.filter((e) => stepOf(e.status) >= 0).map((e) => [stepOf(e.status), whenAr(e.created_at).split("،")[0]]),
    ),
    log: events.map((e) => ({ when: whenAr(e.created_at), txt: e.note || ORDER_STEPS[stepOf(e.status)] || "", who: e.actor?.full_name || "الفريق", col: COL[e.status] ?? "#9FB2AB" })),
  };
}

async function fetchOrders(sb: SupabaseClient): Promise<Order[]> {
  const { data, error } = await sb.from("orders").select(COLUMNS).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as Row[]).map(fromRow);
}

// ── Store (module state + useSyncExternalStore) ─────────────────────────
type Snap = { key: string | null; orders: Order[]; ready: boolean; error: boolean };
let snap: Snap = { key: null, orders: [], ready: false, error: false };
const EMPTY: Snap = snap;
const listeners = new Set<() => void>();
const emit = (next: Snap) => {
  snap = next;
  listeners.forEach((l) => l());
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

async function reload(key: string) {
  try {
    const orders = await fetchOrders(supabaseBrowser());
    if (snap.key === key) emit({ key, orders, ready: true, error: false });
  } catch (e) {
    console.error("orders load failed", e);
    if (snap.key === key) emit({ ...snap, ready: true, error: true });
  }
}

export type NewOrder = {
  deviceDbId: string;
  price: number;
  buyerId?: string;
  buyerName: string;
  buyerPhone: string;
  buyerGov: string;
  buyerAddress: string;
  method: PayMethod;
  /** Paid now (deposit or the full price); 0 = nothing yet. */
  paidNow: number;
  reference: string;
  location: string;
};

export type OrdersApi = {
  orders: Order[];
  ready: boolean;
  error: boolean;
  getOrder: (id: string) => Order | undefined;
  /** Returns the new order's code («#2001»). */
  createOrder: (o: NewOrder) => Promise<string>;
  /** Shipping data / location / a note for the log. */
  updateOrder: (id: string, patch: Partial<Pick<Order, "co" | "no" | "eta" | "location">>, note?: string) => Promise<void>;
  /** Next canonical step (skips inspection steps for inspected devices). Entering
   *  «فترة التجربة» = the buyer received it: delivered_at + trial end are set. */
  advanceOrder: (id: string, note: (next: number) => string) => Promise<number>;
  /** Moves to `step` only if the order is behind it. */
  ensureStep: (id: string, step: number, note: string) => Promise<void>;
  addPayment: (id: string, p: { kind: PaymentKind; amount: number; method: string; reference: string; payerless?: boolean }, note: string) => Promise<void>;
  /** Cancelled before delivery, or returned during the warranty. */
  closeOrder: (id: string, kind: "cancelled_refunded" | "returned", note: string) => Promise<void>;
  /** Buyer tracker: answer the inspection report. */
  buyerDecision: (id: string, accept: boolean) => Promise<void>;
  reload: () => void;
};

export function useOrders(): OrdersApi {
  const { ready: authReady, userId } = useAuth();
  const s = useSyncExternalStore(subscribe, () => snap, () => EMPTY);
  const key = authReady ? (userId ?? "anon") : null;

  useEffect(() => {
    if (!key || snap.key === key) return;
    emit({ key, orders: [], ready: !SUPABASE_URL || key === "anon", error: false });
    if (SUPABASE_URL && key !== "anon") void reload(key);
  }, [key]);

  const find = useCallback((id: string) => snap.orders.find((o) => o.id === normalizeOrderId(id)), []);
  const refresh = useCallback(() => {
    if (snap.key) void reload(snap.key);
  }, []);

  const event = useCallback(async (orderDbId: string, status: DbStatus, note: string) => {
    const { error } = await supabaseBrowser().from("order_events").insert({ order_id: orderDbId, status, note, actor_id: userId });
    if (error) throw error;
  }, [userId]);

  const dbStatusOf = (o: Order): DbStatus => (o.status === "active" ? STEP_STATUS[o.step] : o.status);

  const createOrder = useCallback<OrdersApi["createOrder"]>(async (n) => {
    const sb = supabaseBrowser();
    const status: DbStatus = n.paidNow > 0 ? "funds_held" : "confirmed";
    const ins = await sb
      .from("orders")
      .insert({
        device_id: n.deviceDbId,
        buyer_id: n.buyerId ?? null,
        price: n.price,
        deposit: n.paidNow > 0 && n.paidNow < n.price ? n.paidNow : 0,
        status,
        delivery_name: n.buyerName,
        delivery_phone: n.buyerPhone,
        delivery_governorate: n.buyerGov,
        delivery_address: n.buyerAddress,
        payment_method: n.method,
        device_location: n.location || null,
      })
      .select("id, public_code")
      .single();
    if (ins.error) throw ins.error;
    const orderId = ins.data.id as string;
    await event(orderId, "confirmed", "الطلب اتأكد");
    if (n.paidNow > 0) {
      const full = n.paidNow >= n.price;
      const pay = await sb.from("payments").insert({
        order_id: orderId,
        payer_id: n.buyerId ?? null,
        kind: full ? "balance" : "reservation_deposit",
        amount: n.paidNow,
        method: n.method,
        reference: n.reference || null,
        status: "confirmed",
        confirmed_by: userId,
        confirmed_at: new Date().toISOString(),
      });
      if (pay.error) throw pay.error;
      await event(orderId, "funds_held", `الفلوس اتحفظت · ${full ? "دفع كامل" : "عربون"} ${n.paidNow.toLocaleString("en-US")} ج.م (${methodLabel(n.method)})`);
    }
    refresh();
    return ins.data.public_code as string;
  }, [event, refresh, userId]);

  const updateOrder = useCallback<OrdersApi["updateOrder"]>(async (id, patch, note) => {
    const o = find(id);
    if (!o) return;
    const row: Record<string, unknown> = {};
    if (patch.co !== undefined) row.shipping_company = patch.co || null;
    if (patch.no !== undefined) row.tracking_no = patch.no || null;
    if (patch.eta !== undefined) row.eta = patch.eta || null;
    if (patch.location !== undefined) row.device_location = patch.location || null;
    if (Object.keys(row).length) {
      const { error } = await supabaseBrowser().from("orders").update(row).eq("id", o.dbId);
      if (error) throw error;
    }
    if (note) await event(o.dbId, dbStatusOf(o), note);
    refresh();
  }, [event, find, refresh]);

  const moveTo = useCallback(async (o: Order, next: number, note: string) => {
    const status = STEP_STATUS[next];
    const row: Record<string, unknown> = { status };
    if (next === STEP_TRIAL && !o.deliveredAt) {
      const now = Date.now();
      row.delivered_at = new Date(now).toISOString();
      row.trial_ends_at = new Date(now + BUSINESS.trialDays * 86_400_000).toISOString();
      row.device_location = "عند المشتري";
    }
    if (next === STEP_RELEASED) row.closed_at = new Date().toISOString();
    const { error } = await supabaseBrowser().from("orders").update(row).eq("id", o.dbId);
    if (error) throw error;
    await event(o.dbId, status, note);
  }, [event]);

  const advanceOrder = useCallback<OrdersApi["advanceOrder"]>(async (id, note) => {
    const o = find(id);
    if (!o) return -1;
    const next = nextStep(o);
    await moveTo(o, next, note(next));
    refresh();
    return next;
  }, [find, moveTo, refresh]);

  const ensureStep = useCallback<OrdersApi["ensureStep"]>(async (id, step, note) => {
    const o = find(id);
    if (!o || o.status !== "active" || o.step >= step) return;
    await moveTo(o, step, note);
    refresh();
  }, [find, moveTo, refresh]);

  const addPayment = useCallback<OrdersApi["addPayment"]>(async (id, p, note) => {
    const o = find(id);
    if (!o) return;
    const { error } = await supabaseBrowser().from("payments").insert({
      order_id: o.dbId,
      payer_id: p.payerless ? null : (o.buyerId ?? null),
      kind: p.kind,
      amount: p.amount,
      method: p.method || null,
      reference: p.reference || null,
      status: "confirmed",
      confirmed_by: userId,
      confirmed_at: new Date().toISOString(),
    });
    if (error) throw error;
    await event(o.dbId, dbStatusOf(o), note);
    refresh();
  }, [event, find, refresh, userId]);

  const closeOrder = useCallback<OrdersApi["closeOrder"]>(async (id, kind, note) => {
    const o = find(id);
    if (!o) return;
    const { error } = await supabaseBrowser().from("orders").update({ status: kind, closed_at: new Date().toISOString() }).eq("id", o.dbId);
    if (error) throw error;
    await event(o.dbId, kind, note);
    refresh();
  }, [event, find, refresh]);

  const buyerDecision = useCallback<OrdersApi["buyerDecision"]>(async (id, accept) => {
    const o = find(id);
    if (!o) return;
    const { error } = await supabaseBrowser().rpc("buyer_report_decision", { p_order: o.dbId, p_accept: accept });
    if (error) throw error;
    refresh();
  }, [find, refresh]);

  const getOrder = useCallback((id: string) => s.orders.find((o) => o.id === normalizeOrderId(id)), [s.orders]);

  return useMemo(
    () => ({ orders: s.orders, ready: s.ready && s.key === key, error: s.error, getOrder, createOrder, updateOrder, advanceOrder, ensureStep, addPayment, closeOrder, buyerDecision, reload: refresh }),
    [s, key, getOrder, createOrder, updateOrder, advanceOrder, ensureStep, addPayment, closeOrder, buyerDecision, refresh],
  );
}
