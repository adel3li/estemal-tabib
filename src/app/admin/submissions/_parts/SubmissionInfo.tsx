"use client";

import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { CONDITIONS, fmt, typeLabel } from "@/lib/demo/labels";
import type { Submission } from "@/lib/demo/types";
import { routes } from "@/lib/routes";
import { waLink } from "@/lib/whatsapp";
import { artFor } from "../art";
import { DOT, FEE, ST, THUMB_TF } from "./meta";

/** Read-only part of the detail panel: header, banners, seller/device blocks, media, reason, log. */
export function SubmissionInfo({ p, onReopen }: { p: Submission; onReopen: () => void }) {
  const st = ST[p.status];
  const fee = FEE[p.feeStatus];
  const cond = CONDITIONS[p.condition].label;
  const open = p.status === "new" || p.status === "follow_up";
  const img = artFor(p.deviceType);
  const wa = waLink(`أهلاً ${p.fullName}، بخصوص طلب بيع ${p.details} (${p.id}) على استعمال طبيب.`, p.phone);
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: "#4A5A56" }}>
            طلب {p.id} · وصل {p.createdAt}
          </div>
          <h2 id="sb-dt" className="sb-h2" style={{ margin: 0, lineHeight: 1.4, overflowWrap: "anywhere" }}>
            {p.details}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            <span className="sb-pill" style={{ background: st.bg, color: st.fg }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: st.fg }} />
              {st.l}
            </span>
            <span className="sb-pill" style={{ background: "#E6EDF7", color: "#24508F" }}>
              {typeLabel(p.deviceType)}
            </span>
            <span className="sb-pill" style={{ background: "#F5F7F4", color: "#3C4C48" }}>
              الحالة: {cond}
            </span>
          </div>
        </div>
        <div className="sb-price">
          <div style={{ fontSize: 13, color: "#4A5A56" }}>السعر المطلوب</div>
          <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
            {fmt(p.salePrice)} <span style={{ fontSize: 14, fontWeight: 400, color: "#4A5A56" }}>ج.م</span>
          </div>
          <div style={{ fontSize: 13, color: "#8A4209" }}>
            صافي البايع: {fmt(p.sellerNet)} ج.م<span className="ad-int">داخلي</span>
          </div>
        </div>
      </div>

      {p.feeStatus === "pending" && open ? (
        <div style={{ padding: "12px 16px", borderRadius: 14, background: "#FBEEDC", border: "1px solid #F0C88A", color: "#6B3A10", fontSize: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}>
            <path d="M12 3l9 16H3z" />
            <path d="M12 10v4M12 17h.01" />
          </svg>
          <span>
            <b>رسوم الجدية ({BUSINESS.sellerSeriousnessFeeEGP} ج.م) لسه متدفعتش.</b> فكّر البايع يدفعها قبل ما نحدد ميعاد فحص. الرسوم بتترد حسب الشروط.
          </span>
        </div>
      ) : null}

      {p.status === "accepted" ? (
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "#EAF5DD", border: "1px solid #B9DB9A", color: "#2C5A13", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span>
            <b>اتقبل الطلب واتعمل له إعلان مسودة{p.deviceId ? ` (${p.deviceId})` : ""}.</b> كمّل بيانات الإعلان وانشره من «إضافة جهاز».
          </span>
          <Link href={p.deviceId ? routes.admin.editDevice(p.deviceId) : routes.admin.newDevice} className="sb-act sb-ok" style={{ color: "#FFFFFF" }}>
            كمّل الإعلان
          </Link>
        </div>
      ) : null}
      {p.status === "rejected" ? (
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "#FBE9E7", border: "1px solid #E9B3AE", color: "#7A1A14", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span>
            <b>اترفض:</b> {p.rejectReason}
          </span>
          <button type="button" className="sb-act" onClick={onReopen}>
            رجّعه «محتاج متابعة»
          </button>
        </div>
      ) : null}

      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          البايع
          <a href={wa} target="_blank" rel="noopener noreferrer" className="sb-walink" style={{ fontSize: 13, fontWeight: 600, color: "#156B35" }}>
            كلّمه على واتساب ↗
          </a>
        </h3>
        <div className="sb-kvs">
          <div className="sb-kv"><span>الدكتور</span><span>{p.fullName}</span></div>
          <div className="sb-kv"><span>الموبايل</span><span dir="ltr" style={{ textAlign: "right" }}>{p.phone}</span></div>
          <div className="sb-kv"><span>المحافظة</span><span>{p.governorate}</span></div>
          <div className="sb-kv">
            <span>رسوم الجدية {BUSINESS.sellerSeriousnessFeeEGP} ج.م</span>
            <span style={{ color: fee.fg }}>{fee.txt}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>الجهاز</h3>
        <div className="sb-kvs">
          <div className="sb-kv"><span>نوع الجهاز</span><span>{typeLabel(p.deviceType)}</span></div>
          <div className="sb-kv"><span>سنة الصنع</span><span>{p.year || "—"}</span></div>
          <div className="sb-kv"><span>حالة المنتج</span><span>{cond}</span></div>
          <div className="sb-kv">
            <span>مكان الجهاز للفحص</span>
            <span>{p.keepLocation === "with_seller" ? "يفضل معايا (الفني يروح له)" : "أبعته يتفحص (في مقر الفحص)"}</span>
          </div>
        </div>
        <div className="sb-kv" style={{ marginTop: 10 }}>
          <span>الملحقات</span>
          <span style={{ fontWeight: 400 }}>{p.accessories || "—"}</span>
        </div>
        {p.defects ? (
          <div className="sb-kv" style={{ marginTop: 10 }}>
            <span>العيوب اللي البايع كتبها</span>
            <span style={{ fontWeight: 400 }}>{p.defects}</span>
          </div>
        ) : null}
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
          الصور والفيديو
          <span style={{ fontSize: 13, fontWeight: 400, color: "#4A5A56" }}>
            {p.photos} صور · {p.hasVideo ? "فيه فيديو" : "مفيش فيديو"}
          </span>
        </h3>
        <div className="sb-photos">
          {Array.from({ length: p.photos }, (_, i) => (
            <span key={i} style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 12, overflow: "hidden", border: "1px solid #DCE3DF", display: "block" }}>
              <svg role="img" aria-label={`صورة ${i + 1} من ${p.photos} — ${p.details}`} viewBox="0 0 120 90" style={{ display: "block", width: "100%", height: "100%", transform: THUMB_TF[i % THUMB_TF.length] }}>
                <use href={img} />
              </svg>
              <span style={{ position: "absolute", bottom: 4, right: 4, padding: "0 6px", borderRadius: 6, background: "rgba(18, 34, 31, 0.7)", color: "#FFFFFF" }} className="sb-num">{i + 1}</span>
            </span>
          ))}
          {p.hasVideo ? (
            <span role="img" aria-label="فيديو الجهاز وهو شغال" style={{ aspectRatio: "4 / 3", borderRadius: 12, background: "#12221F", color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, fontSize: 12 }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              فيديو وهو شغال
            </span>
          ) : null}
        </div>
        {p.photos < BUSINESS.photos.min ? (
          <div className="ad-hint" style={{ marginTop: 6, color: "#8A4209" }}>
            أقل من الحد المطلوب للإعلان ({BUSINESS.photos.min} صور على الأقل، والأفضل صور من كل الجهات).
          </div>
        ) : null}
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 14, background: "#FFF8EE", border: "1px dashed #F0C88A" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#8A4209", display: "flex", alignItems: "center", gap: 6 }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          سبب البيع<span className="ad-int">داخلي — مش بيظهر للمشتري</span>
        </div>
        <div style={{ marginTop: 4 }}>{p.saleReason || "—"}</div>
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>سجل الطلب</h3>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
          {p.log.map((lg, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0" }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: DOT[lg.tone ?? "info"], marginTop: 8, flex: "none" }} />
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.5 }}>
                <span style={{ fontSize: 14 }}>{lg.text}</span>
                <span style={{ fontSize: 12, color: "#4A5A56" }}>{lg.at}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
