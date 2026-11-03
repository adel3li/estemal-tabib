"use client";

// Orders from the database (control panel step 3, docs/ADMIN_SPEC.md §5, §9).
// Layout from design-reference/Admin-Orders.dc.html; the new-order form,
// payments and cancel/return panels are additions in the same style.
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useRef, useState } from "react";
import { BUSINESS } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import { useDemo } from "@/lib/demo/store";
import type { Device } from "@/lib/demo/types";
import { ORDER_STEPS, STEP_RELEASED, STEP_SHIPPING, STEP_TRIAL, methodLabel, useOrders, type NewOrder, type Order } from "@/lib/orders/orders";
import { supabaseBrowser } from "@/lib/supabase/client";
import { OrSprite } from "./art";
import { Kpis } from "./Kpis";
import { NewOrderForm } from "./NewOrderForm";
import { OrderDetail } from "./OrderDetail";
import { OrdersTable } from "./OrdersTable";
import { TK, inFilter, netOf, type Filter, type Toast } from "./model";
import "./styles.css";

export default function OrdersPageRoute() {
  return (
    <Suspense>
      <OrdersPage />
    </Suspense>
  );
}

function OrdersPage() {
  const api = useOrders();
  const { ready: storeReady, state, updateDevice, updateSubmission } = useDemo();
  // ?open=#2001 (links from the financial table).
  const [sel, setSel] = useState<string | null>(useSearchParams().get("open"));
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [now] = useState(() => Date.now());
  const detRef = useRef<HTMLDivElement>(null);

  // Seller side comes from the listing and its sell request (admin data).
  const orders = useMemo(
    () =>
      api.orders.map((o): Order => {
        const dev = state.devices.find((d) => d.dbId === o.deviceDbId);
        const co = dev?.source === "company";
        const sub = dev?.submissionId ? state.submissions.find((s) => s.id === dev.submissionId) : undefined;
        return { ...o, sellerCo: co, seller: co ? "استعمال طبيب" : (sub?.fullName ?? "[البايع]"), sellerNet: dev?.sellerNet };
      }),
    [api.orders, state.devices, state.submissions],
  );
  const deviceOf = (o: Order) => state.devices.find((d) => d.dbId === o.deviceDbId);
  const sellerPhoneOf = (o: Order) => {
    const dev = deviceOf(o);
    return dev?.submissionId ? state.submissions.find((s) => s.id === dev.submissionId)?.phone : undefined;
  };

  const narrow = () => window.matchMedia("(max-width: 1023px)").matches;
  const scrollToEl = (el: Element | null) => {
    if (!el || !narrow()) return;
    requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const openOrder = (id: string) => {
    setSel(id);
    setErr("");
    setCreating(false);
    scrollToEl(detRef.current);
  };
  const backToList = () => scrollToEl(document.getElementById(`or-row-${(sel ?? "").replace("#", "")}`) ?? document.getElementById("or-tbl-h"));

  const query = q.trim();
  const base = orders.filter((o) => !query || `${o.id} ${o.device} ${o.cat} ${o.buyer} ${o.buyerPhone}`.includes(query));
  const rows = base.filter((o) => inFilter(o, filter));
  const so = orders.find((o) => o.id === sel) ?? null;

  /** Run a database action with a busy flag and an error message. */
  const run = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      setErr("ما قدرناش نحفظ التغيير في قاعدة البيانات. جرّب تاني.");
    } finally {
      setBusy(false);
    }
  };

  const create = (n: NewOrder, d: Device) =>
    run(async () => {
      const code = await api.createOrder(n);
      if (d.status === "published") updateDevice(d.id, { status: "reserved" });
      setCreating(false);
      setSel(code);
      setToast({ kind: "ok", txt: `طلب ${code} اتسجل، و${d.id} بقى «محجوز» على الموقع.` });
    });

  const findAccount = async (email: string) => {
    const { data } = await supabaseBrowser().from("profiles").select("id").ilike("email", email).maybeSingle();
    return (data?.id as string | undefined) ?? undefined;
  };

  /** Seller paid out + their seriousness fee refunded in full (ADMIN_SPEC §5, open point G). */
  const release = async (o: Order) => {
    const dev = deviceOf(o);
    if (!o.sellerCo) {
      await api.addPayment(o.id, { kind: "seller_payout", amount: netOf(o), method: "", reference: "", payerless: true }, `${fmt(netOf(o))} ج.م اتحولوا للبايع`);
    }
    const sub = dev?.submissionId ? state.submissions.find((s) => s.id === dev.submissionId) : undefined;
    if (sub?.dbId && sub.feeStatus === "paid") {
      const amount = sub.feeAmount ?? BUSINESS.sellerSeriousnessFeeEGP;
      const { error } = await supabaseBrowser().from("payments").insert({
        submission_id: sub.dbId,
        kind: "refund",
        amount,
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      });
      if (error) throw error;
      updateSubmission(sub.id, { feeStatus: "refunded" }, { text: `الجهاز اتباع (${o.id}) · رسوم الجدية ${fmt(amount)} ج.م اترجعت للبايع`, tone: "ok" });
    }
  };

  const advance = () => {
    if (!so) return;
    if (so.step === STEP_SHIPPING && (!so.co.trim() || !so.no.trim())) {
      setErr("قبل ما تحرّكه للاستلام: اكتب شركة الشحن ورقم الشحنة واحفظهم.");
      return;
    }
    void run(async () => {
      let txt = "";
      const next = await api.advanceOrder(so.id, (n) => {
        txt =
          n >= STEP_RELEASED
            ? "فترة الضمان خلصت · الطلب اتقفل"
            : n === STEP_TRIAL
              ? `المشتري استلم · بدأ الضمان ${BUSINESS.trialDays} أيام`
              : `الطلب اتحرك لخطوة «${ORDER_STEPS[n]}»`;
        return txt;
      });
      const dev = deviceOf(so);
      // Received → «تم البيع» on the site for the warranty window, then archived.
      if (next === STEP_TRIAL && dev) {
        updateDevice(dev.id, { status: "sold", archiveAt: new Date(Date.now() + BUSINESS.trialDays * 86_400_000).toISOString() });
      }
      if (next >= STEP_RELEASED) await release(so);
      setErr("");
      setToast({ kind: "ok", txt: `${so.id}: ${txt}.` });
    });
  };

  /** Cancel / return: refund what's due, put the same listing back on sale. */
  const close = (kind: "cancelled_refunded" | "returned", refund: number, why: string) => {
    if (!so) return;
    void run(async () => {
      if (refund > 0) {
        await api.addPayment(so.id, { kind: "refund", amount: refund, method: so.payMethod ?? "", reference: "" }, `${fmt(refund)} ج.م رجعت للمشتري`);
      }
      await api.closeOrder(so.id, kind, why);
      const dev = deviceOf(so);
      if (dev && (dev.status === "reserved" || dev.status === "sold")) updateDevice(dev.id, { status: "published", archiveAt: undefined });
      setErr("");
      setToast({ kind: "info", txt: `${so.id}: ${why}. الإعلان رجع متاح.` });
    });
  };

  const tk = TK[toast?.kind ?? "ok"];
  const orderable = state.devices.filter((d) => d.status === "published" && d.dbId);

  return (
    <>
      <OrSprite />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: "#4A5A56" }}>لوحة التحكم › الطلبات والشحن</div>
          <h1 className="or-h1" style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>الطلبات والشحن</h1>
          <div style={{ color: "#4A5A56" }}>تابع كل طلب في خطواته السبعة، من التأكيد لحد ما الفلوس تتحول للبايع.</div>
        </div>
        <div className="or-acts">
          <label className="or-search">
            <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>دوّر في الطلبات</span>
            <input type="search" className="ad-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="دوّر برقم الطلب، الجهاز أو المشتري" />
          </label>
          <button type="button" className="ad-btn ad-pri" onClick={() => { setCreating(true); setSel(null); scrollToEl(detRef.current); }}>
            + طلب جديد
          </button>
        </div>
      </div>

      {toast ? (
        <div role="status" className="or-toast" style={{ padding: "14px 18px", borderRadius: 16, background: tk[0], border: `1px solid ${tk[1]}`, color: tk[2], display: "flex", alignItems: "center", gap: 12, fontWeight: 600 }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: tk[2], color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: 14 }}>{tk[3]}</span>
          <span style={{ flex: 1 }}>{toast.txt}</span>
          <button type="button" className="or-mini" onClick={() => setToast(null)} style={{ border: `1px solid ${tk[1]}`, background: "#FFFFFF", color: "#12221F" }}>تمام</button>
        </div>
      ) : null}

      {!api.ready || !storeReady ? (
        <div className="ad-card" role="status" style={{ minHeight: 160, alignItems: "center", justifyContent: "center", color: "#4A5A56" }}>بنحمّل الطلبات…</div>
      ) : api.error ? (
        <div className="ad-card" role="alert" style={{ minHeight: 160, alignItems: "center", justifyContent: "center", color: "#7A1A14" }}>ما قدرناش نحمّل الطلبات. حدّث الصفحة.</div>
      ) : (
        <>
          <Kpis orders={orders} />
          <OrdersTable orders={orders} base={base} rows={rows} filter={filter} sel={sel} onFilter={setFilter} onOpen={openOrder} />

          <div ref={detRef} className="or-det-anchor">
            {creating ? (
              <NewOrderForm devices={orderable} busy={busy} findAccount={findAccount} onCreate={(n, d) => void create(n, d)} onCancel={() => setCreating(false)} />
            ) : so ? (
              <OrderDetail
                o={so}
                device={deviceOf(so)}
                sellerPhone={sellerPhoneOf(so)}
                busy={busy}
                now={now}
                err={err}
                onAdvance={advance}
                onPay={(amount, method, reference) =>
                  void run(async () => {
                    const kind = so.collected === 0 && amount < so.amount ? "reservation_deposit" : "balance";
                    await api.addPayment(so.id, { kind, amount, method, reference }, `دفعة ${fmt(amount)} ج.م (${methodLabel(method)}${reference ? ` · ${reference}` : ""})`);
                    if (so.step === 0) await api.ensureStep(so.id, 1, "الفلوس اتحفظت");
                    setToast({ kind: "ok", txt: `اتسجلت دفعة ${fmt(amount)} ج.م على ${so.id}.` });
                  })
                }
                onLocation={(loc) => void run(() => api.updateOrder(so.id, { location: loc }, loc ? `الجهاز دلوقتي: ${loc}` : undefined))}
                onCancelOrder={(refund) => close("cancelled_refunded", refund, "الطلب اتلغى")}
                onReturn={(refund, ourFault) => close("returned", refund, ourFault ? "مرتجع · عيب أو خطأ من جهتنا" : "مرتجع · أسباب شخصية من المشتري")}
                onClose={() => { setSel(null); setErr(""); }}
                onBack={backToList}
                onError={setErr}
                onShip={(s) =>
                  void run(async () => {
                    await api.updateOrder(so.id, s, `بيانات الشحن: ${s.co} · ${s.no}${s.eta ? ` · التسليم ${s.eta}` : ""}`);
                    setErr("");
                    setToast({ kind: "info", txt: `بيانات شحن ${so.id} اتحفظت.` });
                  })
                }
                onNote={(txt) => void run(() => api.updateOrder(so.id, {}, txt))}
              />
            ) : (
              <div className="ad-card" style={{ alignItems: "center", textAlign: "center", padding: 32 }}>
                <div style={{ fontWeight: 700 }}>{orders.length ? "اختار طلب من الجدول" : "لسه مفيش طلبات"}</div>
                <div className="ad-hint">{orders.length ? "هتشوف خطواته، بيانات الشحن، الفلوس، أرقام الطرفين، وسجل النشاط." : "لما مشتري يطلب جهاز على واتساب، سجّله من «+ طلب جديد»."}</div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
