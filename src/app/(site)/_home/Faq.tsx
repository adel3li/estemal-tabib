import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";

const [M1, M2] = BUSINESS.maintenanceMonthsOptions;
const SELLER_FEE = BUSINESS.sellerSeriousnessFeeEGP;
const BUYER_DEPOSIT = BUSINESS.buyerReservationDepositEGP;

export function Faq() {
  return (
    <>
    <section id="faq" style={{ background: "#FFFFFF", borderTop: "1px solid #E5EBE8" }}>
      <div className="mn-sec" style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className="mn-h2" style={{ margin: "0 0 12px", fontWeight: 700 }}>أسئلة شائعة</h2>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            مين اللي بيفحص الأجهزة؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>فني معتمد متخصص في أجهزة الأسنان. اسم الفاحص وتاريخ الفحص مكتوبين في كل تقرير.</p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            يعني إيه &quot;يُفحص عند الطلب&quot;؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>
            لما تطلب الجهاز، فريقنا بيروح يفحصه عند البايع. تقرير الفحص بيوصلك قبل الشحن، ولو الجهاز مش مطابق فلوسك بترجعلك كاملة.
          </p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            ليه الصيانة {M1} شهور في أجهزة و{M2} في أجهزة تانية؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>المدة بتختلف حسب نوع الجهاز. [المعيار النهائي لتحديد المدة]</p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            المنصة بتاخد كام؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          {/* TODO(open question §12.1) */}
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>[نموذج العمولة: نسبة من البايع / المشتري / الاتنين]</p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            بتوصلوا لأنهي محافظات؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>[المحافظات المتاحة في البداية]</p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            إيه هي رسوم الجدية؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>
            البايع بيدفع {SELLER_FEE} ج.م لما يعرض جهازه، وبترجعله لما الجهاز يتباع. المشتري بيحجز الجهاز بـ {BUYER_DEPOSIT} ج.م بتتخصم من سعره.{" "}
            <Link href={routes.terms} style={{ fontWeight: 600 }}>اقرأ شروط البيع والشراء كاملة</Link>
          </p>
        </details>
      </div>
    </section>
    </>
  );
}
