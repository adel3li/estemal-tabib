import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";

const SELLER_FEE = BUSINESS.sellerSeriousnessFeeEGP;
const FEE_PCT = Math.round(BUSINESS.platformFeeMaxRate * 100);
const BUYER_DEPOSIT = BUSINESS.buyerReservationDepositEGP;

export function Faq() {
  return (
    <>
    <section id="faq" style={{ background: "#FFFFFF", borderTop: "1px solid #E5EBE8" }}>
      <div className="mn-sec" style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 className="mn-h2" style={{ margin: "0 0 12px", fontWeight: 700 }}>أسئلة شائعة</h1>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            مين اللي بيفحص الأجهزة؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>فني معتمد متخصص في أجهزة الأسنان.</p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            يعني إيه &quot;يُفحص عند الطلب&quot;؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>
            لما تطلب الجهاز، فريقنا بيفحصه قبل الشحن. تقرير الفحص بيوصلك قبل الشحن، ولو الجهاز مش مطابق فلوسك بترجعلك كاملة.
          </p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            المنصة بتاخد كام؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          {/* Client answer (WhatsApp, Nov 2026) — closes open question §12.1. */}
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>
            نسبة المنصة بتختلف حسب الجهاز، وحالياً أقل من {FEE_PCT}% من سعر البيع النهائي. والنسبة دي بتغطي توصيل الجهاز لحد باب المشتري، والفحص، والصيانة طول فترة الضمان.
          </p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            بتوصلوا لأنهي محافظات؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          {/* Client answer (Nov 2026) for open question §12.9. */}
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>{`بنوصّل لكل المحافظات والأماكن من غير استثناء: ${BUSINESS.deliveryDaysInspected} أيام لو الجهاز متفحص وجاهز، و${BUSINESS.deliveryDaysWithInspection} أيام لو هيتفحص بعد طلبك.`}</p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F5F7F4", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            إيه هي رسوم الجدية؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D5C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A5A56" }}>
            لو الجهاز هيفضل مع البايع، بيدفع رسوم جدية {SELLER_FEE} ج.م بحد أدنى (حسب قيمة الجهاز) وبترجعله لما الجهاز يتباع. ولو بعت الجهاز يفضل عندنا {BUSINESS.minListingDays} أيام على الأقل، مفيش رسوم جدية. الشحن على البايع. المشتري بيحجز الجهاز بـ {BUYER_DEPOSIT} ج.م بحد أدنى بتتخصم من سعره.{" "}
            <Link href={routes.terms} style={{ fontWeight: 600 }}>اقرأ شروط البيع والشراء كاملة</Link>
          </p>
        </details>
      </div>
    </section>
    </>
  );
}
