"use client";

// In-dashboard notifications (docs/ADMIN_SPEC.md §6, §8 — no WhatsApp/SMS
// services). Computed live from the data, so they clear themselves once the
// team acts (request reviewed, order paid, client notified…).
import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { fmt, typeLabel } from "@/lib/demo/labels";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useDemo } from "@/lib/demo/store";
import type { Device, DeviceRequest, Submission } from "@/lib/demo/types";
import { isPastDay } from "@/lib/inspections/db";
import { STEP_DELIVERY, STEP_REPORT, STEP_SHIPPING, STEP_TRIAL, useOrders, type Order } from "@/lib/orders/orders";
import { routes } from "@/lib/routes";
import { noReplyDeadline, reviewHoursLeft } from "@/lib/submissions/time";

export type Tone = "bad" | "warn" | "info" | "ok";
export type Alert = { key: string; tone: Tone; title: string; sub: string; href: string; cta: string };

export type Match = { req: DeviceRequest; devices: Device[] };

const open = (path: string, id: string) => `${path}?open=${encodeURIComponent(id)}`;

/** Priority queue + alerts for the dashboard home and the sidebar badge. */
export function useAdminAlerts() {
  const demo = useDemo();
  const orders = useOrders();
  const [now] = useState(() => Date.now());
  const { state, matchesFor } = demo;
  // The marketing team doesn't see money (ADMIN_SPEC §1): no payment-based items.
  const { isAdmin } = useAuth();

  // (1) New sell requests, oldest first (24-hour review).
  const newSubs: Submission[] = state.submissions
    .filter((s) => s.status === "new" && s.sellerTrust !== "suspicious")
    .sort((a, b) => (a.createdAtIso ?? "").localeCompare(b.createdAtIso ?? ""));

  // (2) Orders that need the team.
  const orderTodo = orders.orders
    .filter((o) => o.status === "active")
    .map((o): { o: Order; why: string; tone: Tone } | null => {
      if (isAdmin && o.collected === 0) return { o, why: "مستني الدفع / العربون", tone: "warn" };
      if (isAdmin && o.step === STEP_TRIAL && o.trialEndsAt && Date.parse(o.trialEndsAt) <= now) return { o, why: "الضمان خلص — حوّل للبايع", tone: "ok" };
      if (o.step === STEP_SHIPPING && o.eta && Date.parse(`${o.eta}T23:59:59`) < now) return { o, why: "ميعاد التسليم عدّى", tone: "bad" };
      if (o.step === STEP_SHIPPING) return { o, why: o.no ? "في الشحن — تابع التسليم" : "اكتب بيانات الشحن", tone: "info" };
      if (o.step === STEP_DELIVERY) return { o, why: "أكّد استلام المشتري", tone: "warn" };
      if (o.step === STEP_REPORT) return { o, why: "مستني رد المشتري على تقرير الفحص", tone: "info" };
      if (isAdmin && o.step < STEP_SHIPPING) return { o, why: "جهّز الفحص / الشحن", tone: "info" };
      return null;
    })
    .filter((x): x is { o: Order; why: string; tone: Tone } => x !== null);

  // (3) «اطلب جهاز» requests that now have a matching listing (ADMIN_SPEC §6).
  const matches: Match[] = state.requests
    .filter((r) => r.status === "new")
    .map((req) => ({ req, devices: matchesFor(req) }))
    .filter((m) => m.devices.length > 0);

  const alerts: Alert[] = [];
  for (const s of newSubs) {
    const h = s.createdAtIso ? reviewHoursLeft(s.createdAtIso, now) : 1;
    if (h <= 0) alerts.push({ key: `rev-${s.id}`, tone: "bad", title: `طلب بيع ${s.id} عدّى ${BUSINESS.sellReviewHours} ساعة من غير مراجعة`, sub: s.details, href: open(routes.admin.submissions, s.id), cta: "راجعه" });
  }
  for (const s of state.submissions) {
    if (s.status === "rejected" || !s.firstContactAt || s.sellerRepliedAt) continue;
    if (now > noReplyDeadline(s.firstContactAt))
      alerts.push({ key: `nr-${s.id}`, tone: "bad", title: `البايع في طلب ${s.id} مردش ${BUSINESS.noReplyBusinessDays} أيام عمل`, sub: `${s.fullName} · ${s.details}`, href: open(routes.admin.submissions, s.id), cta: "افتح الطلب" });
  }
  for (const s of state.submissions) {
    if (s.status === "accepted" && s.feeStatus === "pending" && !s.feeRequestedAt)
      alerts.push({ key: `fee-${s.id}`, tone: "warn", title: `اطلب رسوم الجدية من البايع (${s.id})`, sub: `${s.fullName} · ${s.feeAmount ? `${fmt(s.feeAmount)} ج.م` : ""}`, href: open(routes.admin.submissions, s.id), cta: "اطلبها" });
  }
  for (const { o, why, tone } of orderTodo) {
    if (tone === "bad" || tone === "ok") alerts.push({ key: `ord-${o.id}`, tone, title: `طلب ${o.id}: ${why}`, sub: `${o.device} · ${o.buyer}`, href: open(routes.admin.orders, o.id), cta: "افتح الطلب" });
  }
  for (const m of matches) {
    alerts.push({
      key: `m-${m.req.id}`,
      tone: "info",
      title: `${m.devices.length === 1 ? "جهاز مناسب اتعرض" : `${m.devices.length} أجهزة مناسبة معروضة`} لطلب ${m.req.id}`,
      sub: `${m.req.fullName} عايز ${typeLabel(m.req.deviceType)} · ${m.devices.map((d) => d.id).join("، ")}`,
      href: open(routes.admin.requests, m.req.id),
      cta: "بلّغه على واتساب",
    });
  }
  for (const i of state.inspections) {
    if (i.status === "needs_review") alerts.push({ key: `in-${i.id}`, tone: "warn", title: `تقرير الفحص ${i.id} مستني الاعتماد`, sub: i.title, href: routes.admin.inspections, cta: "راجعه" });
    else if (i.status !== "done" && isPastDay(i.scheduledAt, now)) alerts.push({ key: `in-${i.id}`, tone: "bad", title: `فحص ${i.id} ميعاده عدّى`, sub: i.title, href: routes.admin.inspections, cta: "افتح الفحوصات" });
  }
  const order: Record<Tone, number> = { bad: 0, warn: 1, ok: 2, info: 3 };
  alerts.sort((a, b) => order[a.tone] - order[b.tone]);

  return { ready: demo.ready && orders.ready, isAdmin, now, newSubs, orderTodo, matches, alerts, orders: orders.orders };
}
