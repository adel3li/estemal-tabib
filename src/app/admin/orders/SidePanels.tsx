import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import { heldOf, realPhone, type Order } from "@/lib/demo/orders";
import { waLink } from "@/lib/whatsapp";
import { netTxt } from "./model";

const WaIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-.9-.4-1.6-1.1-2-2l.8-1-1-2z" /></svg>
);

export function Contacts({ o }: { o: Order }) {
  const phone = "[01xxxxxxxxx]"; // TODO(Step 2): real buyer/seller phones from profiles
  const people = [
    { role: "المشتري", name: o.buyer, gov: o.bGov, initial: "م", bg: "#E6EDF7", fg: "#24508F" },
    { role: "البايع", name: o.seller, gov: o.gov, initial: o.sellerCo ? "ط" : "ب", bg: "#E3F0ED", fg: "#0D5C55" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
      {people.map((c) => (
        <div key={c.role} style={{ padding: 16, borderRadius: 18, border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 40, height: 40, borderRadius: 999, background: c.bg, color: c.fg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flex: "none" }}>{c.initial}</span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.4 }}>
              <span style={{ fontSize: 12, color: "#4A5A56" }}>{c.role}</span>
              <span style={{ fontWeight: 700 }}>{c.name}</span>
            </span>
          </span>
          <span style={{ fontSize: 14, color: "#3C4C48" }}>{c.gov} · <span dir="ltr">{phone}</span></span>
          <a
            href={waLink(`أهلاً ${c.name}، معاك استعمال طبيب بخصوص طلب ${o.id} (${o.device}).`, realPhone(phone))}
            target="_blank"
            rel="noopener noreferrer"
            className="or-wa"
            aria-label={`كلّم ${c.role} على واتساب`}
            style={{ alignSelf: "flex-start" }}
          >
            <WaIcon />
            واتساب
          </a>
        </div>
      ))}
    </div>
  );
}

export function MoneyBox({ o }: { o: Order }) {
  const dep = o.paid === "dep";
  const t = BUSINESS.trialDays;
  return (
    <div style={{ padding: 16, borderRadius: 18, background: "#F5F7F4", display: "grid", gridTemplateColumns: "1fr auto", gap: "8px 12px", fontSize: 14 }}>
      <span style={{ color: "#4A5A56" }}>سعر البيع</span><span style={{ fontWeight: 700 }}>{fmt(o.amount)} ج.م</span>
      <span style={{ color: "#4A5A56" }}>المدفوع ومحفوظ</span><span style={{ fontWeight: 700 }}>{fmt(heldOf(o))} ج.م</span>
      {dep ? (
        <>
          <span style={{ color: "#8A4209" }}>الباقي على المشتري</span>
          <span style={{ fontWeight: 700, color: "#8A4209" }}>{fmt(o.amount - BUSINESS.buyerReservationDepositEGP)} ج.م</span>
        </>
      ) : null}
      <span style={{ color: "#4A5A56" }}>صافي البايع<span className="ad-int">داخلي</span></span><span style={{ fontWeight: 700 }}>{netTxt(o)} ج.م</span>
      <span style={{ gridColumn: "1 / -1", fontSize: 12, color: "#4A5A56", borderTop: "1px solid #DCE3DF", paddingTop: 8 }}>
        الفلوس محفوظة لحد الاستلام + {t} أيام تجربة، وبعدها تتحول للبايع. استبدال أو استرجاع خلال {t} أيام.
      </span>
    </div>
  );
}

export function ActivityLog({ o, onAdd }: { o: Order; onAdd: (txt: string) => void }) {
  const [note, setNote] = useState("");
  const add = () => {
    const n = note.trim();
    if (!n) return;
    onAdd(n);
    setNote("");
  };
  return (
    <div style={{ padding: 16, borderRadius: 18, border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 10 }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>سجل النشاط</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <label style={{ flex: 1 }}>
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>ملاحظة جديدة</span>
          <input
            type="text"
            className="ad-in"
            style={{ minHeight: 40, fontSize: 14 }}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") add(); }}
            placeholder="اكتب ملاحظة للفريق"
          />
        </label>
        <button type="button" className="or-mini" onClick={add} style={{ border: 0, background: "#0D5C55", color: "#FFFFFF", minHeight: 40 }}>أضف</button>
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 0 }}>
        {o.log.map((l, i) => (
          <li key={`${i}-${l.when}-${l.txt}`} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #EDF1EF" }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 999, background: l.col, marginTop: 8, flex: "none" }} />
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.5, fontSize: 14 }}>
              <span>{l.txt}</span>
              <span style={{ fontSize: 12, color: "#4A5A56" }}>{l.when} · {l.who}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
