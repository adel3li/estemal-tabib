import { useState } from "react";
import { STEP_SHIPPING, type Order } from "@/lib/demo/orders";

type Ship = Pick<Order, "co" | "no" | "eta">;

/** Render with key={order.id} so the draft resets when another order is opened. */
export function ShippingForm({ o, onSave, onError }: { o: Order; onSave: (s: Ship) => void; onError: (msg: string) => void }) {
  const [s, setS] = useState<Ship>({ co: o.co, no: o.no, eta: o.eta });
  const set = (k: keyof Ship) => (e: React.ChangeEvent<HTMLInputElement>) => setS((x) => ({ ...x, [k]: e.target.value }));
  const save = () => {
    if (!s.co.trim() || !s.no.trim()) {
      onError("اكتب شركة الشحن ورقم الشحنة الأول.");
      return;
    }
    onSave({ co: s.co.trim(), no: s.no.trim(), eta: s.eta });
  };
  return (
    <div className="or-box" style={{ padding: 18, borderRadius: 18, border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>
        بيانات الشحن
      </h3>
      <div className="ad-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
        <label className="ad-field">
          شركة الشحن
          <input type="text" className="ad-in" value={s.co} onChange={set("co")} placeholder="[اسم شركة الشحن]" enterKeyHint="next" />
        </label>
        <label className="ad-field">
          رقم الشحنة
          <input type="text" className="ad-in" value={s.no} onChange={set("no")} placeholder="[رقم الشحنة]" enterKeyHint="next" autoCapitalize="characters" dir="ltr" style={{ textAlign: "right" }} />
        </label>
        <label className="ad-field">
          ميعاد التسليم المتوقع
          <input type="date" className="ad-in" value={s.eta} onChange={set("eta")} />
        </label>
      </div>
      <div className="or-ship-foot">
        {/* PHASE1_PROMPT §2.1 #2: delivery is to the buyer's door, never "clinic". */}
        <span className="ad-hint">التوصيل لحد باب بيتك.{o.step < STEP_SHIPPING ? " بتتملي قبل خطوة الشحن." : ""}</span>
        <button type="button" className="ad-btn ad-sec or-ship-save" onClick={save}>احفظ بيانات الشحن</button>
      </div>
    </div>
  );
}
