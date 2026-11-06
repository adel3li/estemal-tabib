import Link from "next/link";
import { useState } from "react";
import { ArrowIcon, CheckIcon, DocIcon } from "./art";

type Props = {
  text: string;
  reportHref?: string;
  badges: { txt: string; ok: boolean }[];
  onConfirm: () => void;
  onCancel: () => void;
};

/** Current-step card for «تقرير الفحص»: buyer confirms (→ shipping) or cancels (full refund). */
export function ReportCard({ text, reportHref, badges, onConfirm, onCancel }: Props) {
  const [asking, setAsking] = useState(false);
  return (
    <div className="ot-cur" style={{ minWidth: 0, padding: 16, borderRadius: 10, background: "#FFF5EA", border: "1px solid #F8C788" }}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>تقرير الفحص وصلك</div>
      <div style={{ color: "#5A4A3C", fontSize: 15 }}>{text}</div>
      <div className="ot-cur-box" style={{ marginTop: 14, padding: 16, borderRadius: 12, background: "#FFFFFF", border: "1px solid #F9DDBE", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ flex: "1 1 220px", minWidth: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {badges.map((b) =>
            b.ok ? (
              <span key={b.txt} style={{ padding: "3px 12px", borderRadius: 999, background: "#E2F4F8", color: "#0A7E99", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckIcon size={13} width={2.6} />
                {b.txt}
              </span>
            ) : (
              <span key={b.txt} style={{ padding: "3px 12px", borderRadius: 999, background: "#FEEEDB", color: "#8A4A05", fontWeight: 600, fontSize: 14 }}>{b.txt}</span>
            ),
          )}
        </div>
        <div className="ot-actions" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {reportHref ? (
            <Link href={reportHref} className="ot-ghost" style={{ minHeight: 46, padding: "0 18px", borderRadius: 12, border: "1px solid #C9D4D3", background: "#FFFFFF", color: "#122022", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <DocIcon />
              شوف التقرير
            </Link>
          ) : null}
          <button type="button" className="ot-cta" onClick={onConfirm} style={{ minHeight: 46, padding: "0 20px", borderRadius: 12, border: 0, background: "#0A7E99", color: "#FFFFFF", font: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            أكّد وابدأ الشحن
            <ArrowIcon />
          </button>
        </div>
      </div>
      {!asking ? (
        <div style={{ marginTop: 10, fontSize: 14, color: "#4A595A" }}>
          مش موافق على التقرير؟{" "}
          <button type="button" className="ot-linkbtn" onClick={() => setAsking(true)} style={{ background: "none", border: 0, padding: 0, font: "inherit", fontWeight: 600, color: "#0A7E99", cursor: "pointer" }}>
            إلغي الطلب واسترد فلوسك كاملة
          </button>
        </div>
      ) : (
        <div role="alertdialog" aria-label="تأكيد إلغاء الطلب" style={{ marginTop: 12, padding: 14, borderRadius: 10, background: "#FBE9E7", border: "1px solid #E8B4AE", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 15, color: "#7A1A14", fontWeight: 600 }}>متأكد إنك عايز تلغي الطلب؟ فلوسك هترجعلك كاملة بنفس طريقة الدفع.</div>
          <div className="ot-actions" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" onClick={onCancel} style={{ minHeight: 44, padding: "0 18px", borderRadius: 12, border: 0, background: "#B3261E", color: "#FFFFFF", font: "inherit", fontWeight: 700, cursor: "pointer" }}>أيوه، إلغي الطلب</button>
            <button type="button" className="ot-ghost" onClick={() => setAsking(false)} style={{ minHeight: 44, padding: "0 18px", borderRadius: 12, border: "1px solid #C9D4D3", background: "#FFFFFF", color: "#122022", font: "inherit", fontWeight: 600, cursor: "pointer" }}>لأ، رجوع</button>
          </div>
        </div>
      )}
    </div>
  );
}
