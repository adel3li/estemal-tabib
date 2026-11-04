import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";

const SELLER_FEE = BUSINESS.sellerSeriousnessFeeEGP;
const FEE_PCT = Math.round(BUSINESS.platformFeeMaxRate * 100);
const BUYER_DEPOSIT = BUSINESS.buyerReservationDepositEGP;

export function Faq() {
  return (
    <>
    <section id="faq" style={{ background: "#FFFFFF", borderTop: "1px solid #E5EBEA" }}>
      <div className="mn-sec" style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 className="mn-h2" style={{ margin: "0 0 12px", fontWeight: 700 }}>أسئلة شائعة</h1>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F3F6F7", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            مين اللي بيفحص الأجهزة؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A595A" }}>فني معتمد متخصص في أجهزة الأسنان.</p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F3F6F7", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            يعني إيه &quot;يُفحص عند الطلب&quot;؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A595A" }}>
            لما تطلب الجهاز، فريقنا بيفحصه قبل الشحن. تقرير الفحص بيوصلك قبل الشحن، ولو الجهاز مش مطابق فلوسك بترجعلك كاملة.
          </p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F3F6F7", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            المنصة بتاخد كام؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          {/* Client answer (WhatsApp, Nov 2026) — closes open question §12.1. */}
          <p style={{ margin: "10px 0 0", color: "#4A595A" }}>
            نسبة المنصة بتختلف حسب الجهاز، وحالياً أقل من {FEE_PCT}% من سعر البيع النهائي. والنسبة دي بتغطي توصيل الجهاز لحد باب المشتري، والفحص، والصيانة طول فترة الضمان.
          </p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F3F6F7", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            بتوصلوا لأنهي محافظات؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          {/* Client answer (Nov 2026) for open question §12.9. */}
          <p style={{ margin: "10px 0 0", color: "#4A595A" }}>بنسعى نكون في كل المحافظات.</p>
        </details>
        <details className="mn-faq" style={{ padding: "18px 22px", borderRadius: 16, background: "#F3F6F7", border: "1px solid transparent" }}>
          <summary style={{ fontWeight: 600, fontSize: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            إيه هي رسوم الجدية؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p style={{ margin: "10px 0 0", color: "#4A595A" }}>
            البايع بيدفع رسوم جدية {SELLER_FEE} ج.م بحد أدنى لما يعرض جهازه، وبترجعله لما الجهاز يتباع. المشتري بيحجز الجهاز بـ {BUYER_DEPOSIT} ج.م بحد أدنى بتتخصم من سعره.{" "}
            <Link href={routes.terms} style={{ fontWeight: 600 }}>اقرأ شروط البيع والشراء كاملة</Link>
          </p>
        </details>
      </div>
    </section>
    </>
  );
}
