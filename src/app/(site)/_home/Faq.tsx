import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";
import { PageHead } from "../_v2/PageHead";

const SELLER_FEE = BUSINESS.sellerSeriousnessFeeEGP;
const FEE_PCT = Math.round(BUSINESS.platformFeeMaxRate * 100);
const BUYER_DEPOSIT = BUSINESS.buyerReservationDepositEGP;

export function Faq() {
  return (
    <>
    <PageHead eyebrow="عندك سؤال؟" title="أسئلة شائعة" />
    <section id="faq" className="hm-sec">
      <div className="hm-wrap hm-faqs">
        <details className="mn-faq hm-faq">
          <summary>
            مين اللي بيفحص الأجهزة؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p>فني معتمد متخصص في أجهزة الأسنان.</p>
        </details>
        <details className="mn-faq hm-faq">
          <summary>
            يعني إيه &quot;يُفحص عند الطلب&quot;؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p>
            لما تطلب الجهاز، فريقنا بيفحصه قبل الشحن. تقرير الفحص بيوصلك قبل الشحن، ولو الجهاز مش مطابق فلوسك بترجعلك كاملة.
          </p>
        </details>
        <details className="mn-faq hm-faq">
          <summary>
            المنصة بتاخد كام؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          {/* Client answer (WhatsApp, Nov 2026) — closes open question §12.1. */}
          <p>
            نسبة المنصة بتختلف حسب الجهاز، وحالياً أقل من {FEE_PCT}% من سعر البيع النهائي. والنسبة دي بتغطي توصيل الجهاز لحد باب المشتري، والفحص، والصيانة طول فترة الضمان.
          </p>
        </details>
        <details className="mn-faq hm-faq">
          <summary>
            بتوصلوا لأنهي محافظات؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          {/* Client answer (Nov 2026) for open question §12.9. */}
          <p>{`بنوصّل لكل المحافظات والأماكن من غير استثناء: ${BUSINESS.deliveryDaysInspected} أيام لو الجهاز متفحص وجاهز، و${BUSINESS.deliveryDaysWithInspection} أيام لو هيتفحص بعد طلبك.`}</p>
        </details>
        <details className="mn-faq hm-faq">
          <summary>
            إيه هي رسوم الجدية؟
            <svg className="mn-chev" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A7E99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <p>
            لو الجهاز هيفضل مع البايع، بيدفع رسوم جدية {SELLER_FEE} ج.م بحد أدنى (حسب قيمة الجهاز) وبترجعله لما الجهاز يتباع. ولو بعت الجهاز يفضل عندنا {BUSINESS.minListingDays} أيام على الأقل، مفيش رسوم جدية. الشحن على البايع. المشتري بيحجز الجهاز بـ {BUYER_DEPOSIT} ج.م بحد أدنى بتتخصم من سعره.{" "}
            <Link href={routes.terms} style={{ fontWeight: 600 }}>اقرأ شروط البيع والشراء كاملة</Link>
          </p>
        </details>
      </div>
    </section>
    </>
  );
}
