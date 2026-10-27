import Link from "next/link";
import { INSPECTION_LABEL, fmt, typeLabel } from "@/lib/demo/labels";
import type { Device, DeviceRequest } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { RqIcon } from "./art";
import { ST, budgetTxt, condTxt, prefOf, waMessage } from "./model";

type Props = {
  r: DeviceRequest;
  matches: Device[];
  onSend: () => void;
  onClose: () => void;
  onReopen: () => void;
};

const Cell = ({ label, children, ltr }: { label: string; children: React.ReactNode; ltr?: boolean }) => (
  <div style={{ padding: "10px 12px", borderRadius: 12, background: "#F5F7F4", display: "flex", flexDirection: "column" }}>
    <span className="rq-sub" style={{ fontSize: 12 }}>{label}</span>
    <span style={{ fontWeight: 600 }} dir={ltr ? "ltr" : undefined}>{children}</span>
  </div>
);

export function RequestDetail({ r, matches: m, onSend, onClose, onReopen }: Props) {
  const [stTxt, stBg, stFg] = ST[r.status];
  const [pref, prefBg, prefFg] = prefOf(r);
  const isClosed = r.status === "closed";
  return (
    <div className="ad-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="rq-sub">طلب #{r.id} · {r.createdAt}</span>
          <h2 className="ad-h" style={{ fontSize: 21, fontWeight: 700 }}>{typeLabel(r.deviceType)}</h2>
        </div>
        <span className="rq-pill" style={{ background: stBg, color: stFg }}><span className="rq-dot" />{stTxt}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 14 }}>
        <Cell label="الدكتور">{r.fullName}</Cell>
        <Cell label="الموبايل" ltr>{r.phone}</Cell>
        <Cell label="الميزانية">{budgetTxt(r)} ج.م</Cell>
        <Cell label="المحافظة">{r.governorate}</Cell>
        <div style={{ gridColumn: "1 / -1", padding: "10px 12px", borderRadius: 12, background: "#F5F7F4", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span className="rq-sub" style={{ fontSize: 12 }}>الفحص</span>
          <span className="rq-pill" style={{ background: prefBg, color: prefFg }}>{pref}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>أجهزة مطابقة ({m.length})</span>
          <span className="rq-sub" style={{ fontWeight: 400, fontSize: 12 }}>نفس النوع وفي حدود الميزانية</span>
        </div>
        {m.map((d) => {
          const done = d.inspection === "inspected";
          return (
            <div key={d.id} className="rq-match">
              <RqIcon type={d.type} />
              <span style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{d.title}</span>
                <span className="rq-sub" style={{ fontSize: 12 }}>{d.governorate} · {condTxt(d)}</span>
                <span>
                  <span className="rq-pill" style={{ background: done ? "#0D5C55" : "#E6EDF7", color: done ? "#FFFFFF" : "#24508F", marginTop: 2 }}>
                    {INSPECTION_LABEL[d.inspection]}
                  </span>
                </span>
              </span>
              <span style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <span style={{ fontWeight: 700 }}>{fmt(d.price)} <span className="rq-sub" style={{ fontSize: 12 }}>ج.م</span></span>
                <Link href={routes.device(d.id)} style={{ fontSize: 13, fontWeight: 600 }}>الإعلان ←</Link>
              </span>
            </div>
          );
        })}
        {m.length === 0 ? (
          <div style={{ padding: 14, borderRadius: 14, background: "#FBEEDC", color: "#6B3A10", fontSize: 14 }}>
            مفيش جهاز مطابق دلوقتي. سيب الطلب مفتوح وبلّغ الدكتور أول ما يتعرض جهاز.
          </div>
        ) : null}
      </div>

      {m.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>الرسالة اللي هتتبعت</span>
          <div style={{ padding: "12px 14px", borderRadius: "14px 14px 4px 14px", background: "#E3F0ED", fontSize: 14, color: "#12221F", whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
            {waMessage(r, m, (id) => `\u2066${routes.device(id)}\u2069`)}
          </div>
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {!isClosed && m.length > 0 ? (
          <button type="button" className="rq-act rq-wa" onClick={onSend}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-2z" /></svg>
            {r.status === "notified" ? "ابعت تاني على واتساب" : "ابعت للدكتور على واتساب"}
          </button>
        ) : null}
        {!isClosed ? (
          <button type="button" className="rq-act rq-close" onClick={onClose}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            اقفل الطلب
          </button>
        ) : (
          <>
            <div style={{ padding: "12px 14px", borderRadius: 14, background: "#E5EBE8", fontSize: 14, fontWeight: 600 }}>الطلب مقفول.</div>
            <button type="button" className="rq-act ad-sec" onClick={onReopen}>افتح الطلب تاني</button>
          </>
        )}
        {r.notifiedAt && r.status !== "new" ? <span className="ad-hint">اتبلّغ يوم {r.notifiedAt}.</span> : null}
      </div>
    </div>
  );
}
