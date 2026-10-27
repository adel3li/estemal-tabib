import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";

const DAYS = BUSINESS.trialDays;
const SELLER_FEE = BUSINESS.sellerSeriousnessFeeEGP;
const MIN_DAYS = BUSINESS.minListingDays;

export function SellerTerms() {
  return (
    <>
    <div id="tm-panel-sell" role="tabpanel" aria-labelledby="tm-tab-sell" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
      <aside className="tm-aside" style={{ minWidth: 0, gap: 14 }}>
        <nav className="tm-toc" aria-label="محتويات شروط البايع" style={{ padding: 18, borderRadius: 20, background: "#FFFFFF", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ padding: "0 8px 6px", fontSize: 13, fontWeight: 700, color: "#4A5A56" }}>المحتويات</span>
          <a href="#tm-s1" style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "#E3F0ED", color: "#0D5C55", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>١</span>
            شروط العرض والجدية
          </a>
          <a href="#tm-s2" style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "#E6EDF7", color: "#24508F", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>٢</span>
            الشفافية ووصف الجهاز
          </a>
          <a href="#tm-s3" style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "#FBEEDC", color: "#8A4209", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>٣</span>
            الشحن والتسليم والإرجاع
          </a>
          <a href="#tm-s4" style={{ padding: "8px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "#EAF5DD", color: "#3F7A1F", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>٤</span>
            خدمة إيداع الجهاز لدى المنصة
          </a>
        </nav>
        <div style={{ padding: 18, borderRadius: 20, background: "#0F2A26", color: "#C3D3CE", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>أرقام مهمة</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, paddingBottom: 8, borderBottom: "1px solid #2E5650" }}>
            <span style={{ fontSize: 14 }}>رسوم جدية العرض</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F2A33A", whiteSpace: "nowrap", flex: "none" }}>{SELLER_FEE} جنيه</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, paddingBottom: 8, borderBottom: "1px solid #2E5650" }}>
            <span style={{ fontSize: 14 }}>أقل مدة عرض</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F2A33A", whiteSpace: "nowrap", flex: "none" }}>{MIN_DAYS} أيام</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, paddingBottom: 8, borderBottom: "1px solid #2E5650" }}>
            <span style={{ fontSize: 14 }}>تسليم المنتج بعد طلب الشراء</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F2A33A", whiteSpace: "nowrap", flex: "none" }}>3 أيام عمل</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 14 }}>حفظ الثمن بعد استلام المشتري</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#F2A33A", whiteSpace: "nowrap", flex: "none" }}>{DAYS} أيام</span>
          </div>
        </div>
      </aside>
      <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        <article id="tm-s1" className="tm-art" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ position: "relative", flex: "none", width: 52, height: 52, borderRadius: 16, background: "#E3F0ED", color: "#0D5C55", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M9 12l2 2 4-4" /></svg>
              <span aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFFFFF" }}>١</span>
            </span>
            <h2 className="tm-h2" style={{ margin: 0, lineHeight: 1.4 }}>١. شروط العرض والجدية</h2>
          </div>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>التزام العرض:</strong>
            {" "}عرضك للمنتج يُعد موافقة رسمية على إتاحته للعرض على المنصة لمدة لا تقل عن{" "}
            <span className="tm-num">أسبوع ({MIN_DAYS} أيام)</span>
            .
          </p>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>توافر المنتج:</strong>
            {" "}يُعتبر المنتج متاحاً للبيع طالما لم يقم البائع بإزالته أو تحديث حالته عبر المنصة.
          </p>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>رسوم جدية العرض:</strong>
            {" "}يتم سداد مبلغ{" "}
            <span className="tm-num">{SELLER_FEE} جنيه</span>
            {" "}كرسوم جدية عند تقديم طلب عرض الجهاز أو الأداة.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            <div style={{ padding: "16px 18px", borderRadius: 16, background: "#E3F0ED", border: "1px solid #9CCBC2", color: "#0B4A44" }}>
              <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: "none", width: 26, height: 26, borderRadius: 999, background: "#0D5C55", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
                </span>
                حالات استرداد رسوم الجدية
              </div>
              <ul style={{ margin: "8px 0 0", paddingRight: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>عند إتمام عملية البيع بنجاح عبر المنصة.</li>
                <li>
                  عند طلب البائع إلغاء العرض وإزالة المنتج بعد مرور{" "}
                  <span className="tm-num-t">أسبوع كامل ({MIN_DAYS} أيام)</span>
                  {" "}على الأقل دون وقوع طلب الجهاز للبيع.
                </li>
              </ul>
            </div>
            <div style={{ padding: "16px 18px", borderRadius: 16, background: "#FBEEDC", border: "1px solid #F0C88A", color: "#6B3A10" }}>
              <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: "none", width: 26, height: 26, borderRadius: 999, background: "#C46A12", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </span>
                حالات مصادرة رسوم الجدية (غير قابلة للاسترداد)
              </div>
              <ul style={{ margin: "8px 0 0", paddingRight: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>
                  عدم توفير أو تسليم المنتج لشحن أو معاينة المنصة خلال{" "}
                  <span className="tm-num" style={{ background: "#FFFFFF" }}>3 أيام عمل</span>
                  {" "}من طلب الشراء.
                </li>
                <li>ثبوت عدم مطابقة المنتج للوصف أو المواصفات والعيوب المذكورة في النموذج عند الفحص.</li>
              </ul>
            </div>
          </div>
        </article>
        <article id="tm-s2" className="tm-art" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ position: "relative", flex: "none", width: 52, height: 52, borderRadius: 16, background: "#E6EDF7", color: "#24508F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
              <span aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 999, background: "#24508F", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFFFFF" }}>٢</span>
            </span>
            <h2 className="tm-h2" style={{ margin: 0, lineHeight: 1.4 }}>٢. الشفافية ووصف الجهاز</h2>
          </div>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>دقة الوصف والمرفقات:</strong>
            {" "}يلتزم البائع بذكر كافة التفاصيل الفنية، وعمر الجهاز، وعدد ساعات التشغيل (إن وجدت)، وتاريخ آخر صيانة، وتوضيح أي عيوب ظاهرة أو خفية بكل أمانة.
          </p>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>الصور والفيديوهات:</strong>
            {" "}يجب على البائع إرفاق صور وفيديوهات حديثة وواضحة للجهاز أثناء عمله، وتصوير كافة الملحقات والعيوب إن وجدت.
          </p>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>الملكية:</strong>
            {" "}يقر البائع بأنه المالك القانوني للمعدة أو يمتلك تفويضاً رسمياً ببيعها، وأنها غير مرهونة أو محل نزاع.
          </p>
        </article>
        <article id="tm-s3" className="tm-art" style={{ borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ position: "relative", flex: "none", width: 52, height: 52, borderRadius: 16, background: "#FBEEDC", color: "#C46A12", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h11v9H3z" />
                <path d="M14 10h4l3 3v3h-7" />
                <circle cx="7" cy="17.5" r="1.8" />
                <circle cx="17" cy="17.5" r="1.8" />
              </svg>
              <span aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 999, background: "#C46A12", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFFFFF" }}>٣</span>
            </span>
            <h2 className="tm-h2" style={{ margin: 0, lineHeight: 1.4 }}>٣. الشحن والتسليم والإرجاع</h2>
          </div>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>التغليف الآمن:</strong>
            {" "}البائع مسؤول عن تغليف الجهاز بشكل آمن ومناسب لطبيعة الأجهزة الطبية الحساسة قبل تسليمه لشركة الشحن أو مندوب الفحص.
          </p>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>فترة الحماية والاسترجاع:</strong>
            {" "}يُحفظ ثمن المنتج لدى المنصة لمدة{" "}
            <span className="tm-num">{DAYS} أيام</span>
            {" "}من تاريخ استلام المشتري له، وهي الفترة المخصصة للتجربة والفحص التأكيدي. يتم تحويل المبلغ لحساب البائع فور انتهاء الفترة دون تقديم طلب استرجاع مقبول.
          </p>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>إلغاء البيع المفاجئ:</strong>
            {" "}في حال تراجع البائع عن البيع بعد إتمام المشتري للدفع وقبل الشحن، يُلزم البائع بدفع مصاريف الفحص أو المصاريف الإدارية إن وجدت، بالإضافة لمصادرة رسوم الجدية.
          </p>
        </article>
        <article id="tm-s4" className="tm-art" style={{ borderRadius: 24, background: "#FFFFFF", border: "2px solid #0D5C55", boxShadow: "0 10px 30px rgba(18, 34, 31, 0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <span style={{ position: "relative", flex: "none", width: 52, height: 52, borderRadius: 16, background: "#EAF5DD", color: "#3F7A1F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-6 9 6v10H3z" /><path d="M8 20v-6h8v6" /><path d="M8 17h8" /></svg>
              <span aria-hidden="true" style={{ position: "absolute", top: -6, left: -6, width: 22, height: 22, borderRadius: 999, background: "#3F7A1F", color: "#FFFFFF", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFFFFF" }}>٤</span>
            </span>
            <h2 className="tm-h2" style={{ margin: 0, lineHeight: 1.4 }}>٤. خدمة إيداع الجهاز لدى المنصة</h2>
            <span style={{ padding: "3px 12px", borderRadius: 999, background: "#E3F0ED", color: "#0D5C55", fontSize: 13, fontWeight: 700 }}>اختيارية</span>
          </div>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>الهدف من الخدمة:</strong>
            {" "}لزيادة فرص بيع الجهاز وتسريع وصوله للمشتري، يحق للبائع إرسال جهازه إلى المنصة، حيث يتم فحصه وحفظه لديها لحين إتمام عملية البيع.
          </p>
          <p className="tm-p" style={{ margin: 0, borderRadius: 14, background: "#F7FAF8", border: "1px solid #E5EBE8" }}>
            <strong>استرداد الجهاز:</strong>
            {" "}يحق للبائع استرداد جهازه المودَع في أي وقت، بشرط تحمّل تكلفة شحن إعادته إليه.
          </p>
        </article>
        <Link href={routes.sell} className="tm-cta tm-cta-amber" style={{ minHeight: 54, padding: "0 26px", borderRadius: 14, background: "#F2A33A", color: "#12221F", fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
          اعرض جهازك للبيع
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
        </Link>
      </div>
    </div>
    </>
  );
}
