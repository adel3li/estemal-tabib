import Link from "next/link";
import { isPublic } from "@/lib/demo/store";
import { STEP_DELIVERY, STEP_RELEASED, STEP_SHIPPING, STEP_TRIAL, type Order, type PayMethod } from "@/lib/orders/orders";
import { whenAr } from "@/lib/submissions/db";
import { MoneyActions } from "./MoneyActions";
import type { Device } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { OrSymbol } from "./art";
import { inspView, payView } from "./model";
import { ShippingForm } from "./ShippingForm";
import { ActivityLog, Contacts, MoneyBox } from "./SidePanels";
import { Stepper } from "./Stepper";

type Props = {
  o: Order;
  device?: Device;
  sellerPhone?: string;
  busy: boolean;
  /** false = the marketing team: no money, and only the shipping → receipt moves. */
  money: boolean;
  now: number;
  err: string;
  onAdvance: () => void;
  onPay: (amount: number, method: PayMethod, reference: string) => void;
  onLocation: (loc: string) => void;
  onCancelOrder: (refund: number) => void;
  onReturn: (refund: number, ourFault: boolean) => void;
  onClose: () => void;
  onBack: () => void;
  onShip: (s: Pick<Order, "co" | "no" | "eta">) => void;
  onError: (msg: string) => void;
  onNote: (txt: string) => void;
};

export function OrderDetail({ o, device, sellerPhone, busy, money, now, err, onAdvance, onPay, onLocation, onCancelOrder, onReturn, onClose, onBack, onShip, onError, onNote }: Props) {
  const [payTxt, payBg, payFg] = payView(o);
  const [insp, inspBg, inspFg] = inspView(o);
  const active = o.status === "active";
  const open = active && o.step < STEP_RELEASED && (money || o.step === STEP_SHIPPING || o.step === STEP_DELIVERY);
  return (
    <section className="ad-card or-det" aria-labelledby="or-det-h" style={{ borderColor: "#9CCBC2" }}>
      <button type="button" className="or-back" onClick={onBack}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        رجوع للقائمة
      </button>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 14 }}>
        <OrSymbol sym={`or-${o.sym}`} size={56} />
        <div style={{ flex: "1 1 300px", minWidth: 0, lineHeight: 1.5 }}>
          <div style={{ fontSize: 13, color: "#4A5A56" }}>
            الطلب {o.id} · {o.date} ·{" "}
            <Link href={routes.order(o.id)} className="or-buyer-link">شوف صفحة المشتري ←</Link>
          </div>
          <h2 id="or-det-h" style={{ margin: 0, fontSize: 21, fontWeight: 700, overflowWrap: "anywhere" }}>
            {device && isPublic(device) ? <Link href={routes.device(device.id)} style={{ color: "inherit" }}>{o.device}</Link> : o.device}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {money ? <span className="or-pill" style={{ background: payBg, color: payFg }}>{payTxt}</span> : null}
            <span className="or-pill" style={{ background: inspBg, color: inspFg }}>{insp}</span>
            <span className="or-pill" style={{ background: "#F5F7F4", color: "#3C4C48" }}>صيانة مجانية {o.maint} شهور</span>
          </div>
        </div>
        <div className="or-acts">
          {open ? (
            <button type="button" className="ad-btn ad-pri" onClick={onAdvance} disabled={busy}>
              {o.step === STEP_TRIAL ? "خلص الضمان · حوّل للبايع" : o.step === STEP_DELIVERY ? "المشتري استلم · ابدأ الضمان" : "حرّك للخطوة الجاية"}
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
          ) : null}
          <button type="button" className="or-x" onClick={onClose} aria-label="اقفل تفاصيل الطلب">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
          </button>
        </div>
      </div>

      <Stepper o={o} />
      {o.step >= STEP_RELEASED && active ? (
        <div style={{ padding: "12px 16px", borderRadius: 14, background: "#EAF5DD", color: "#3F7A1F", fontWeight: 600 }}>الطلب اتقفل · الفلوس اتحولت للبايع.</div>
      ) : null}
      {!active ? (
        <div style={{ padding: "12px 16px", borderRadius: 14, background: "#FBE9E7", color: "#B3261E", fontWeight: 600 }}>
          {o.status === "returned" ? "المشتري رجّع الجهاز · الإعلان رجع متاح على الموقع." : "الطلب اتلغى · الجهاز رجع متاح على الموقع."}
        </div>
      ) : null}
      {active && o.step === STEP_TRIAL && o.trialEndsAt ? (
        <div style={{ padding: "12px 16px", borderRadius: 14, background: "#E3F0ED", color: "#0B4A44", fontWeight: 600 }}>
          المشتري استلم {o.deliveredAt ? whenAr(o.deliveredAt) : ""} · الضمان لحد {whenAr(o.trialEndsAt)}.{" "}
          {Date.parse(o.trialEndsAt) < now ? "الضمان خلص — تقدر تحوّل للبايع." : ""}
        </div>
      ) : null}
      {err ? (
        <div role="alert" style={{ padding: "12px 16px", borderRadius: 14, background: "#FBE9E7", border: "1px solid #E8B4AE", color: "#B3261E", fontSize: 14, fontWeight: 600 }}>{err}</div>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-start" }}>
        <div style={{ flex: "999 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <ShippingForm key={o.id} o={o} onSave={onShip} onError={onError} />
          <Contacts o={o} sellerPhone={sellerPhone} />
        </div>
        <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          {money ? <MoneyBox o={o} /> : null}
          <MoneyActions key={`${o.id}-${o.remaining}-${o.status}`} o={o} money={money} busy={busy} onPay={onPay} onLocation={onLocation} onCancel={onCancelOrder} onReturn={onReturn} />
          <ActivityLog o={o} onAdd={onNote} />
        </div>
      </div>
    </section>
  );
}
