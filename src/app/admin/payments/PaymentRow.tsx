import Link from "next/link";
import { useState } from "react";
import { BUSINESS } from "@/config/business";
import { fmt } from "@/lib/demo/labels";
import type { Payment } from "@/lib/demo/orders";
import { routes } from "@/lib/routes";
import { PmIcon } from "./art";
import { FEE_PCT, LEVEL, ST, feeOf, netOf, trialOf } from "./model";

type Props = {
  p: Payment;
  open: boolean;
  onToggle: () => void;
  onConfirm: (ref: string, file: File | null) => void;
  onDeliver: () => void;
  onTransfer: () => void;
  onRefund: () => void;
};

const PATH = ["الفلوس وصلت", "محفوظة عندنا", "المشتري استلم", `خلصت التجربة (${BUSINESS.trialDays} أيام)`, "اتحوّلت للبايع"];

const Box = ({ label, children, sub, ltr }: { label: string; children: React.ReactNode; sub: React.ReactNode; ltr?: boolean }) => (
  <div style={{ padding: "12px 14px", borderRadius: 14, background: "#FFFFFF", border: "1px solid #DCE3DF", fontSize: 14, display: "flex", flexDirection: "column" }}>
    <span className="pm-sub">{label}</span>
    <span style={{ fontWeight: 600, overflowWrap: "anywhere" }} dir={ltr ? "ltr" : undefined}>{children}</span>
    {sub}
  </div>
);

export function PaymentRow({ p, open, onToggle, onConfirm, onDeliver, onTransfer, onRefund }: Props) {
  const [stTxt, stBg, stFg] = ST[p.st];
  const [trTxt, trBg, trFg] = trialOf(p);
  const lv = LEVEL[p.st];
  const net = fmt(netOf(p));
  const fee = fmt(feeOf(p));
  const amount = fmt(p.amount);
  const bar = (i: number) => (p.st === "refunded" && i > 2 ? "#E8B4AE" : i <= lv ? "#0D5C55" : "#C9D4CF");
  const transferHint =
    p.st === "ready"
      ? "فترة التجربة خلصت من غير شكوى — جاهز."
      : p.st === "trial"
        ? `بيتفتح لما فترة التجربة تخلص (${trTxt}).`
        : `بيتفتح بعد الاستلام + ${BUSINESS.trialDays} أيام تجربة.`;
  const live = p.st === "held" || p.st === "trial" || p.st === "ready";

  // Per-row action state (reset when the row is collapsed: the parent remounts via key).
  const [ref, setRef] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [asking, setAsking] = useState(false);

  return (
    <div>
      <button type="button" className="pm-row pm-cols" onClick={onToggle} aria-expanded={open} style={{ background: open ? "#F5F7F4" : "#FFFFFF" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <PmIcon icon={p.icon} />
          <span style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.45 }}>
            <span style={{ fontWeight: 700 }}>#{p.id}</span>
            <span className="pm-sub" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.device}</span>
          </span>
        </span>
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45, minWidth: 0 }}>
          <span style={{ fontWeight: 600 }}>{p.buyer}</span>
          <span className="pm-sub">{p.gov}</span>
        </span>
        <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, lineHeight: 1.45 }}>
          <span style={{ fontWeight: 700 }}>{amount} <span className="pm-sub">ج.م</span></span>
          <span className="pm-pill" style={{ background: "#F5F7F4", color: "#3C4C48", border: "1px solid #DCE3DF", fontWeight: 600 }}>{p.method}</span>
        </span>
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.5, fontSize: 13 }}>
          <span><span style={{ color: "#4A5A56" }}>وصلت:</span> {p.recv || "—"}</span>
          <span><span style={{ color: "#4A5A56" }}>استلام:</span> {p.deliv || (p.st === "pending" || p.st === "held" ? "لسه" : "—")}</span>
        </span>
        <span><span className="pm-net-l">فترة التجربة: </span><span className="pm-pill" style={{ background: trBg, color: trFg }}>{trTxt}</span></span>
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.45 }}>
          <span style={{ fontWeight: 700 }}><span className="pm-net-l">صافي البايع: </span>{net} <span className="pm-sub">ج.م</span></span>
          <span className="pm-sub">رسوم المنصة {fee}</span>
        </span>
        <span><span className="pm-pill" style={{ background: stBg, color: stFg }}><span className="pm-dot" />{stTxt}</span></span>
        <span aria-hidden="true" style={{ color: "#4A5A56", fontSize: 14, transform: `rotate(${open ? "180deg" : "0deg"})`, transition: "transform .15s", display: "inline-block" }}>⌄</span>
      </button>

      {open ? (
        <div className="pm-exp" style={{ background: "#F5F7F4", borderTop: "1px solid #E5EBE8", display: "flex", flexWrap: "wrap", gap: 20 }}>
          <div style={{ flex: "999 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontWeight: 700 }}>مسار الفلوس — #{p.id}</div>
            <ol aria-label="مسار الفلوس" className="pm-path">
              {PATH.map((label, i) => (
                <li key={label} className="pm-path-i">
                  <span className="pm-path-bar" style={{ background: bar(i + 1) }} />
                  {label}
                </li>
              ))}
            </ol>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
              <Box label="المشتري" sub={<span className="pm-sub" dir="ltr" style={{ textAlign: "right" }}>{p.phone}</span>}>{p.buyer}</Box>
              <Box label="البايع" sub={<span className="pm-sub">{p.device}</span>}>{p.seller}</Box>
              <Box label="مرجع التحويل" ltr sub={<span className="pm-sub">{p.receipt ? `الإيصال: ${p.receipt}` : "مفيش إيصال مرفوع"}</span>}>{p.ref || "—"}</Box>
            </div>
            <div style={{ padding: "12px 16px", borderRadius: 14, background: "#FFFFFF", border: "1px solid #DCE3DF", fontSize: 14, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>اللي دفعه المشتري</span><span style={{ fontWeight: 600 }}>{amount} ج.م</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "#8A4209" }}><span>رسوم المنصة ({FEE_PCT})</span><span style={{ fontWeight: 600 }}>− {fee} ج.م</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingTop: 6, borderTop: "1px solid #E5EBE8", fontWeight: 700 }}><span>صافي البايع</span><span>{net} ج.م</span></div>
            </div>
          </div>

          <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontWeight: 700 }}>الإجراءات</div>

            {p.st === "pending" ? (
              <div style={{ padding: 14, borderRadius: 14, background: "#FBEEDC", border: "1px solid #F0C88A", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 14, color: "#6B3A10" }}>المشتري قال إنه دفع بـ{p.method}. اتأكد من الحساب الأول، وبعدين أكّد.</div>
                <label className="ad-field">
                  رقم مرجع التحويل
                  <input type="text" className="ad-in" dir="ltr" style={{ textAlign: "right" }} autoCapitalize="characters" autoCorrect="off" spellCheck={false} enterKeyHint="done" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="مثال: [IPN-xxxxxxxx]" />
                </label>
                <label className="ad-drop pm-drop" style={{ padding: 12, position: "relative" }}>
                  <input type="file" className="pm-file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v4h16v-4" /></svg>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>ارفع إيصال التحويل</span>
                    <span className="ad-hint" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file ? file.name : "صورة أو PDF (اختياري)"}</span>
                  </span>
                </label>
                <button type="button" className="pm-act ad-pri" disabled={!ref.trim()} onClick={() => onConfirm(ref.trim(), file)}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
                  أكّد إن الفلوس وصلت
                </button>
                <span className="ad-hint">لازم تكتب رقم المرجع الأول.</span>
              </div>
            ) : null}

            {p.st === "held" ? (
              <>
                <button type="button" className="pm-act ad-sec" onClick={onDeliver}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>
                  سجّل إن المشتري استلم
                </button>
                <span className="ad-hint">التسجيل بيبدأ فترة التجربة {BUSINESS.trialDays} أيام.</span>
              </>
            ) : null}

            {live ? (
              <>
                <button type="button" className="pm-act pm-green" disabled={p.st !== "ready"} onClick={onTransfer}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  حوّل للبايع · {net} ج.م
                </button>
                <span className="ad-hint" style={{ color: p.st === "ready" ? "#3F7A1F" : "#4A5A56" }}>{transferHint}</span>
                {!asking ? (
                  <button type="button" className="pm-act pm-red" onClick={() => setAsking(true)}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14L4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></svg>
                    رجّع للمشتري
                  </button>
                ) : (
                  <div role="alertdialog" aria-label="تأكيد الإرجاع" style={{ padding: 14, borderRadius: 14, background: "#FBE9E7", border: "1px solid #E8B4AE", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 14, color: "#7A1A14", fontWeight: 600 }}>هيرجع {amount} ج.م للمشتري بنفس طريقة الدفع ({p.method}). متأكد؟</div>
                    <div className="pm-confirm" style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="pm-act pm-redf" onClick={onRefund}>أيوه، رجّع الفلوس</button>
                      <button type="button" className="pm-act ad-sec" onClick={() => setAsking(false)}>لأ</button>
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {p.st === "paid" || p.st === "refunded" ? (
              <div style={{ padding: 14, borderRadius: 14, background: stBg, color: stFg, fontSize: 14, fontWeight: 600 }}>
                {p.st === "paid" ? `اتحوّل ${net} ج.م للبايع يوم ${p.doneOn ?? ""}.` : `اترجع ${amount} ج.م للمشتري يوم ${p.doneOn ?? ""}.`}
              </div>
            ) : null}

            <Link href={routes.admin.orders} className="pm-olink" style={{ fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              شوف الطلب في «الطلبات والشحن» ←
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
