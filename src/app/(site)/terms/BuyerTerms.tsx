import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";

const DAYS = BUSINESS.trialDays;
const [M1, M2] = BUSINESS.maintenanceMonthsOptions;
const BUYER_DEPOSIT = BUSINESS.buyerReservationDepositEGP;

export function BuyerTerms() {
  return (
    <>
    <div id="tm-panel-buy" role="tabpanel" aria-labelledby="tm-tab-buy" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
      <aside className="tm-aside" style={{ minWidth: 0, gap: 14 }}>
        <nav className="tm-toc" aria-label="محتويات شروط المشتري" style={{ padding: 18, borderRadius: 20, background: "#FFFFFF", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ padding: "0 8px 6px", fontSize: 13, fontWeight: 700, color: "#4A5A56" }}>المحتويات</span>
          <a href="#tm-b1" style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "#E3F0ED", color: "#0D5C55", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>١</span>
            حجز الجدية والطلب
          </a>
          <a href="#tm-b2" style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "#EAF5DD", color: "#3F7A1F", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>٢</span>
            حالات استرداد أموالك كاملة
          </a>
          <a href="#tm-b3" style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "#FBEEDC", color: "#8A4209", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>٣</span>
            حالات عدم استرداد رسوم الحجز
          </a>
          <a href="#tm-b4" style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "#0F2A26", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /></svg>
            </span>
            ضمانك على كل جهاز
          </a>
        </nav>
        <div style={{ padding: 18, borderRadius: 20, background: "#0F2A26", color: "#C3D3CE", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>أرقام مهمة</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, paddingBottom: 8, borderBottom: "1px solid #2E5650" }}>
            <span style={{ fontSize: 14 }}>رسوم جدية الحجز (بتتخصم من الثمن)</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F2A33A", whiteSpace: "nowrap", flex: "none" }}>{BUYER_DEPOSIT} جنيه <span style={{ fontSize: 13, fontWeight: 600 }}>بحد أدنى</span></span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, paddingBottom: 8, borderBottom: "1px solid #2E5650" }}>
            <span style={{ fontSize: 14 }}>تأخير التوصيل أكتر من</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F2A33A", whiteSpace: "nowrap", flex: "none" }}>أسبوع</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, paddingBottom: 8, borderBottom: "1px solid #2E5650" }}>
            <span style={{ fontSize: 14 }}>استبدال أو استرجاع</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F2A33A", whiteSpace: "nowrap", flex: "none" }}>{DAYS} أيام</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 14 }}>صيانة مجانية</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F2A33A", whiteSpace: "nowrap", flex: "none" }}>{M1} – {M2} شهور</span>
          </div>
        </div>
      </aside>
      <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        <article id="tm-b1" className="tm-art" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ position: "relative", flex: "none", width: 52, height: 52, borderRadius: 16, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              <span aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFFFFF" }}>١</span>
            </span>
            <h2 className="tm-h2" style={{ margin: 0, lineHeight: 1.4 }}>١. حجز الجدية والطلب</h2>
          </div>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>رسوم جدية الحجز:</strong>
            {" "}لتأكيد عملية الشراء وجدية الطلب، يتم سداد مبلغ{" "}
            <span className="tm-num">{BUYER_DEPOSIT} جنيه</span>
            {" "}بحد أدنى كرسوم جدية حجز، ويتم خصمها بالكامل من إجمالي ثمن المنتج عند إتمام الصفقة.
          </p>
        </article>
        <article id="tm-b2" className="tm-art" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ position: "relative", flex: "none", width: 52, height: 52, borderRadius: 16, background: "#EAF5DD", color: "#3F7A1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12a8 8 0 0 1 14-5.3L20 9" />
                <path d="M20 4v5h-5" />
                <path d="M20 12a8 8 0 0 1-14 5.3L4 15" />
                <path d="M4 20v-5h5" />
              </svg>
              <span aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 999, background: "#3F7A1F", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFFFFF" }}>٢</span>
            </span>
            <h2 className="tm-h2" style={{ margin: 0, lineHeight: 1.4 }}>٢. حالات استرداد أموالك كاملة</h2>
          </div>
          <div style={{ padding: "16px 18px", borderRadius: 16, background: "#E3F0ED", border: "1px solid #9CCBC2", color: "#0B4A44" }}>
            <ul style={{ margin: 0, paddingRight: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <strong>التأخير في التوصيل:</strong>
                {" "}إذا تأخر البائع أو تعطل توصيل المنتج لمدة تزيد عن{" "}
                <span className="tm-num-t">أسبوع</span>
                {" "}من تاريخ تأكيد الطلب.
              </li>
              <li>
                <strong>عدم المطابقة:</strong>
                {" "}عند قيام المنصة بفحص المنتج وثبوت أنه غير مطابق للمواصفات أو الحالة التي ذكرها البائع في الإعلان.
              </li>
            </ul>
          </div>
        </article>
        <article id="tm-b3" className="tm-art" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ position: "relative", flex: "none", width: 52, height: 52, borderRadius: 16, background: "#FBEEDC", color: "#C46A12", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v6" /><path d="M12 16.5h.01" /></svg>
              <span aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 999, background: "#C46A12", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFFFFF" }}>٣</span>
            </span>
            <h2 className="tm-h2" style={{ margin: 0, lineHeight: 1.4 }}>٣. حالات عدم استرداد رسوم الحجز</h2>
          </div>
          <div style={{ padding: "16px 18px", borderRadius: 16, background: "#FBEEDC", border: "1px solid #F0C88A", color: "#6B3A10" }}>
            لا يتم استرداد رسوم الحجز في حال قام المشتري بطلب شحن المنتج وفحصه ثم ألغى عملية البيع لأسباب شخصية (وليس بسبب عيب في الجهاز أو عدم مطابقة للمواصفات)، وذلك لتغطية تكاليف الشحن والمجهود الإداري والفحص.
          </div>
        </article>
        <article id="tm-b4" className="tm-art tm-art-dark" style={{ borderRadius: 24, background: "#0F2A26", color: "#FFFFFF", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px 24px" }}>
          <div style={{ flex: "1 1 220px", minWidth: 0, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ flex: "none", width: 52, height: 52, borderRadius: 16, background: "#F2A33A", color: "#12221F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
            </span>
            <h2 style={{ margin: 0, fontSize: 20 }}>ضمانك على كل جهاز</h2>
          </div>
          <div style={{ flex: "2 1 320px", minWidth: 0, display: "flex", flexWrap: "wrap", gap: 10, color: "#C3D3CE" }}>
            <span style={{ flex: "1 1 180px", padding: "12px 16px", borderRadius: 14, background: "rgba(255, 255, 255, 0.07)", border: "1px solid #2E5650", display: "flex", alignItems: "center", gap: 10 }}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2A33A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
                <path d="M4 12a8 8 0 0 1 14-5.3L20 9" />
                <path d="M20 4v5h-5" />
                <path d="M20 12a8 8 0 0 1-14 5.3L4 15" />
                <path d="M4 20v-5h5" />
              </svg>
              <span>استبدال أو استرجاع: <strong style={{ color: "#FFFFFF" }}>{DAYS} أيام</strong></span>
            </span>
            <span style={{ flex: "1 1 220px", padding: "12px 16px", borderRadius: 14, background: "rgba(255, 255, 255, 0.07)", border: "1px solid #2E5650", display: "flex", alignItems: "center", gap: 10 }}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2A33A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>
                <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z" />
              </svg>
              <span>صيانة مجانية: <strong style={{ color: "#FFFFFF" }}>{M1} – {M2} شهور</strong> حسب الجهاز</span>
            </span>
          </div>
        </article>
        <Link href={routes.devices} className="tm-cta tm-cta-teal" style={{ minHeight: 54, padding: "0 26px", borderRadius: 14, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
          تصفّح الأجهزة
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
        </Link>
      </div>
    </div>
    </>
  );
}
