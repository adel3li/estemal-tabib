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
    <div style={{ flex: 1, minWidth: 0, marginBottom: 24, padding: 18, borderRadius: 18, background: "#FDF6EC", border: "1px solid #F0C88A" }}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>تقرير الفحص وصلك</div>
      <div style={{ color: "#5A4A3C", fontSize: 15 }}>{text}</div>
      <div style={{ marginTop: 14, padding: 16, borderRadius: 16, background: "#FFFFFF", border: "1px solid #F3DFC2", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ flex: "1 1 220px", minWidth: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {badges.map((b) =>
            b.ok ? (
              <span key={b.txt} style={{ padding: "3px 12px", borderRadius: 999, background: "#E3F0ED", color: "#0D5C55", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckIcon size={13} width={2.6} />
                {b.txt}
              </span>
            ) : (
              <span key={b.txt} style={{ padding: "3px 12px", borderRadius: 999, background: "#FBEEDC", color: "#8A4209", fontWeight: 600, fontSize: 14 }}>{b.txt}</span>
            ),
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {reportHref ? (
            <Link href={reportHref} className="ot-ghost" style={{ minHeight: 46, padding: "0 18px", borderRadius: 12, border: "1px solid #C9D4CF", background: "#FFFFFF", color: "#12221F", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <DocIcon />
              شوف التقرير
            </Link>
          ) : null}
          <button type="button" className="ot-cta" onClick={onConfirm} style={{ minHeight: 46, padding: "0 20px", borderRadius: 12, border: 0, background: "#0D5C55", color: "#FFFFFF", font: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            أكّد وابدأ الشحن
            <ArrowIcon />
          </button>
        </div>
      </div>
      {!asking ? (
        <div style={{ marginTop: 10, fontSize: 14, color: "#4A5A56" }}>
          مش موافق على التقرير؟{" "}
          <button type="button" onClick={() => setAsking(true)} style={{ background: "none", border: 0, padding: 0, font: "inherit", fontWeight: 600, color: "#0D5C55", cursor: "pointer" }}>
            إلغي الطلب واسترد فلوسك كاملة
          </button>
        </div>
      ) : (
        <div role="alertdialog" aria-label="تأكيد إلغاء الطلب" style={{ marginTop: 12, padding: 14, borderRadius: 14, background: "#FBE9E7", border: "1px solid #E8B4AE", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 15, color: "#7A1A14", fontWeight: 600 }}>متأكد إنك عايز تلغي الطلب؟ فلوسك هترجعلك كاملة بنفس طريقة الدفع.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" onClick={onCancel} style={{ minHeight: 44, padding: "0 18px", borderRadius: 12, border: 0, background: "#B3261E", color: "#FFFFFF", font: "inherit", fontWeight: 700, cursor: "pointer" }}>أيوه، إلغي الطلب</button>
            <button type="button" className="ot-ghost" onClick={() => setAsking(false)} style={{ minHeight: 44, padding: "0 18px", borderRadius: 12, border: "1px solid #C9D4CF", background: "#FFFFFF", color: "#12221F", font: "inherit", fontWeight: 600, cursor: "pointer" }}>لأ، رجوع</button>
          </div>
        </div>
      )}
    </div>
  );
}
