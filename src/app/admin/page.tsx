"use client";

// «الرئيسية» — dashboard home (docs/ADMIN_SPEC.md §6, §8): the priority queue
// (1 new sell requests, 2 orders, 3 «اطلب جهاز» matches), in-dashboard alerts,
// and the money/status table. Not in the design files — built from the admin
// cards, pills and tables of the other pages.
import Link from "next/link";
import { useMemo } from "react";
import { BUSINESS } from "@/config/business";
import { INSPECTION_LABEL, fmt, typeLabel } from "@/lib/demo/labels";
import { useAdminAlerts, type Tone } from "@/lib/admin/alerts";
import { methodLabel, ORDER_STEPS, STEP_RELEASED, type Order } from "@/lib/orders/orders";
import { routes } from "@/lib/routes";
import { reviewHoursLeft } from "@/lib/submissions/time";
import { whenAr } from "@/lib/submissions/db";
import { ST as MONEY, moneyStatus } from "./payments/model";
import "./home.css";

const TONE: Record<Tone, [string, string, string]> = {
  bad: ["#FBE9E7", "#E9B3AE", "#7A1A14"],
  warn: ["#FBEEDC", "#F0C88A", "#6B3A10"],
  ok: ["#EAF5DD", "#B9DB9A", "#2C5A13"],
  info: ["#E6EDF7", "#B7C8E4", "#1B3D6E"],
};
const open = (path: string, id: string) => `${path}?open=${encodeURIComponent(id)}`;
const day = (iso?: string) => (iso ? whenAr(iso).split("،")[0] : "");

function Section({ n, title, count, href, all, children }: { n: string; title: string; count: number; href: string; all: string; children: React.ReactNode }) {
  return (
    <section className="ad-card hm-q" aria-labelledby={`hm-q${n}`}>
      <div className="hm-q-head">
        <h2 className="ad-h" id={`hm-q${n}`} style={{ fontWeight: 700 }}>
          <span className="ad-n" style={{ background: "#E3F0ED", color: "#0D5C55" }}>{n}</span>
          {title}
          <span className="hm-count">{count}</span>
        </h2>
        <Link href={href} className="hm-all">{all} ←</Link>
      </div>
      <div className="hm-items">{children}</div>
    </section>
  );
}

function Item({ href, title, sub, pill }: { href: string; title: string; sub: string; pill?: [string, Tone] }) {
  return (
    <Link href={href} className="hm-item">
      <span style={{ minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
        <span style={{ fontWeight: 700, overflowWrap: "anywhere" }}>{title}</span>
        <span className="hm-sub">{sub}</span>
      </span>
      {pill ? (
        <span className="hm-pill" style={{ background: TONE[pill[1]][0], color: TONE[pill[1]][2] }}>{pill[0]}</span>
      ) : null}
    </Link>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => <div className="hm-empty">{children}</div>;

export default function AdminHome() {
  const { ready, isAdmin, now, openSubs, toInspect, toDeliver, orderTodo, matches, alerts, orders } = useAdminAlerts();
  const active = useMemo(() => orders.filter((o) => o.status === "active" && o.step < STEP_RELEASED), [orders]);
  const held = active.reduce((a, o) => a + o.collected, 0);
  const due = active.reduce((a, o) => a + o.remaining, 0);
  const today = new Date(now).toLocaleDateString("ar-EG-u-nu-latn", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Cairo" });

  const timeline = (o: Order) =>
    o.trialEndsAt ? `الضمان لحد ${day(o.trialEndsAt)}` : o.eta ? `التسليم المتوقع ${o.eta}` : o.location ? `الجهاز ${o.location}` : "—";

  return (
    <>
      <div>
        <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الرئيسية · {today}</div>
        <h1 className="hm-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الرئيسية</h1>
        <div style={{ color: "#4A5A56" }}>
          {isAdmin
            ? "المطلوب منك النهارده بالترتيب: طلبات البيع المفتوحة، بعدين الطلبات، بعدين مطابقات «اطلب جهاز»."
            : "المطلوب منك النهارده: متابعة شحن وتسليم الطلبات، وتبليغ عملاء «اطلب جهاز» بالأجهزة المناسبة."}
        </div>
      </div>

      {!ready ? (
        <div className="ad-card" role="status" style={{ minHeight: 160, alignItems: "center", justifyContent: "center", color: "#4A5A56" }}>بنحمّل…</div>
      ) : (
        <>
          <div className="hm-kpis">
            {isAdmin ? (
              <Link href={routes.admin.submissions} className="hm-kpi">
                <span>طلبات بيع مفتوحة</span>
                <b>{openSubs.length}</b>
                <span className="hm-sub">
                  {openSubs.filter((s) => s.status === "new").length} جديد · {openSubs.filter((s) => s.status === "follow_up").length} محتاج متابعة
                </span>
              </Link>
            ) : null}
            <Link href={routes.admin.orders} className="hm-kpi"><span>طلبات شراء مفتوحة</span><b>{active.length}</b></Link>
            <Link href={isAdmin ? routes.admin.inspections : `${routes.admin.orders}?filter=inspect`} className="hm-kpi"><span>مطلوب فحصه</span><b>{toInspect}</b></Link>
            <Link href={`${routes.admin.orders}?filter=deliver`} className="hm-kpi"><span>مطلوب تسليمه</span><b>{toDeliver}</b></Link>
            <Link href={routes.admin.requests} className="hm-kpi"><span>مطابقات «اطلب جهاز»</span><b>{matches.length}</b></Link>
            {isAdmin ? (
              <Link href={routes.admin.payments} className="hm-kpi"><span>محفوظ · باقي على المشترين</span><b>{fmt(held)} · {fmt(due)} <small>ج.م</small></b></Link>
            ) : (
              <Link href={routes.admin.demand} className="hm-kpi"><span>الطلب على الأجهزة</span><b style={{ fontSize: 18 }}>الأكثر مشاهدة وحفظاً ←</b></Link>
            )}
          </div>

          <section className="ad-card" aria-labelledby="hm-al" style={{ gap: 10 }}>
            <h2 className="ad-h" id="hm-al" style={{ fontWeight: 700 }}>
              <span className="ad-n" style={{ background: "#FBEEDC", color: "#8A4209" }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
              </span>
              التنبيهات
              <span className="hm-count">{alerts.length}</span>
            </h2>
            {alerts.length ? (
              <ul className="hm-alerts">
                {alerts.map((a) => {
                  const [bg, bd, fg] = TONE[a.tone];
                  return (
                    <li key={a.key} className="hm-alert" style={{ background: bg, borderColor: bd, color: fg }}>
                      <span style={{ minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                        <b style={{ overflowWrap: "anywhere" }}>{a.title}</b>
                        <span style={{ fontSize: 13, overflowWrap: "anywhere" }}>{a.sub}</span>
                      </span>
                      <Link href={a.href} className="hm-cta" style={{ color: fg, borderColor: bd }}>{a.cta}</Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Empty>مفيش تنبيهات دلوقتي — كله تمام.</Empty>
            )}
          </section>

          <div className="hm-queue">
            {isAdmin ? (
            <Section n="١" title="طلبات البيع المفتوحة" count={openSubs.length} href={routes.admin.submissions} all="كل طلبات البيع">
              {openSubs.slice(0, 6).map((s) => {
                const h = s.createdAtIso ? reviewHoursLeft(s.createdAtIso, now) : BUSINESS.sellReviewHours;
                return (
                  <Item
                    key={s.id}
                    href={open(routes.admin.submissions, s.id)}
                    title={`${s.id} · ${s.details}`}
                    sub={`${s.fullName} · ${s.governorate} · ${s.salePrice ? `${fmt(s.salePrice)} ج.م` : "محتاج مساعدة في السعر"}`}
                    pill={s.status === "follow_up" ? ["محتاج متابعة", "warn"] : h > 0 ? [`باقي ${h} ساعة`, h <= 6 ? "warn" : "info"] : ["عدّى 24 ساعة", "bad"]}
                  />
                );
              })}
              {openSubs.length === 0 ? <Empty>مفيش طلبات بيع مفتوحة.</Empty> : null}
            </Section>
            ) : null}

            <Section n="٢" title="طلبات الشراء والتأكيدات" count={orderTodo.length} href={routes.admin.orders} all="كل الطلبات">
              {orderTodo.slice(0, 6).map(({ o, why, tone }) => (
                <Item key={o.id} href={open(routes.admin.orders, o.id)} title={`${o.id} · ${o.device}`} sub={`${o.buyer} · ${ORDER_STEPS[Math.min(o.step, 6)]}`} pill={[why, tone]} />
              ))}
              {orderTodo.length === 0 ? <Empty>مفيش طلبات محتاجة حاجة دلوقتي.</Empty> : null}
            </Section>

            <Section n="٣" title="مطابقات «اطلب جهاز»" count={matches.length} href={routes.admin.requests} all="كل الطلبات">
              {matches.slice(0, 6).map(({ req, devices }) => (
                <Item
                  key={req.id}
                  href={open(routes.admin.requests, req.id)}
                  title={`${req.id} · ${req.fullName} عايز ${typeLabel(req.deviceType)}`}
                  sub={devices.map((d) => `${d.id} (${fmt(d.price)} ج.م)`).join("، ")}
                  pill={[devices.length === 1 ? "جهاز مناسب" : `${devices.length} أجهزة`, "ok"]}
                />
              ))}
              {matches.length === 0 ? <Empty>مفيش أجهزة جديدة مناسبة لطلبات مفتوحة.</Empty> : null}
            </Section>
          </div>

          <section className="ad-card" aria-labelledby="hm-fin" style={{ gap: 12 }}>
            <div className="hm-q-head">
              <h2 className="ad-h" id="hm-fin" style={{ fontWeight: 700 }}>
                <span className="ad-n" style={{ background: "#E6EDF7", color: "#24508F" }}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /></svg>
                </span>
                {isAdmin ? "الفلوس وحالة الطلبات المفتوحة" : "حالة الطلبات المفتوحة"}
              </h2>
              {isAdmin ? <Link href={routes.admin.payments} className="hm-all">الجدول المالي ←</Link> : null}
            </div>
            {active.length ? (
              <div className={`hm-tbl${isAdmin ? "" : " hm-nomoney"}`} role="table" aria-label="الطلبات المفتوحة">
                <div className="hm-tr hm-th" role="row">
                  {(isAdmin ? ["الطلب", "الدفع", "الباقي", "المواعيد", "الفحص", "الخطوة"] : ["الطلب", "المشتري", "المواعيد", "الفحص", "الخطوة"]).map((h) => <span key={h} role="columnheader">{h}</span>)}
                </div>
                {active.map((o) => {
                  const [t, bg, fg] = MONEY[moneyStatus(o, now)];
                  return (
                    <Link key={o.id} href={open(routes.admin.orders, o.id)} className="hm-tr" role="row">
                      <span role="cell" style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <b>{o.id}</b>
                        <span className="hm-sub" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.device}</span>
                      </span>
                      {isAdmin ? (
                        <>
                          <span role="cell" data-l="الدفع"><span className="hm-pill" style={{ background: bg, color: fg }}>{t}</span> <span className="hm-sub">{methodLabel(o.payMethod)}</span></span>
                          <span role="cell" data-l="الباقي" style={{ fontWeight: 700, color: o.remaining ? "#8A4209" : "#3F7A1F" }}>{o.remaining ? `${fmt(o.remaining)} ج.م` : "مفيش"}</span>
                        </>
                      ) : (
                        <span role="cell" data-l="المشتري">{o.buyer} · <span dir="ltr">{o.buyerPhone}</span></span>
                      )}
                      <span role="cell" data-l="المواعيد">{timeline(o)}</span>
                      <span role="cell" data-l="الفحص">{INSPECTION_LABEL[o.insp]}</span>
                      <span role="cell" data-l="الخطوة">{ORDER_STEPS[Math.min(o.step, 6)]}</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Empty>مفيش طلبات شراء مفتوحة.</Empty>
            )}
          </section>
        </>
      )}
    </>
  );
}
