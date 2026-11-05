// Buyer terms — content from the client's draft «مسودة شروط وأحكام البيع والشراء»
// (WhatsApp, 2026-11-01): sections أولاً، ثالثاً، رابعاً، خامساً.
import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS, MAINT_SPAN, MAINT_LIST } from "@/config/business";
import { Article, Clause, GeneralClauses, ICONS, Min, Num, Numbers, Outcome, TONES, Toc, Two } from "./parts";

const DAYS = BUSINESS.trialDays;
const BUYER_DEPOSIT = BUSINESS.buyerReservationDepositEGP;
const NO_REPLY = BUSINESS.noReplyBusinessDays;
const MAX_DELIVERY = BUSINESS.maxDeliveryDays;

const SECTIONS = [
  { id: "tm-b1", title: "أحكام عامة", tone: TONES.teal },
  { id: "tm-b2", title: "رسوم جدية الحجز", tone: TONES.amber },
  { id: "tm-b3", title: "الدفع وحفظ الأموال", tone: TONES.green },
  { id: "tm-b4", title: "الفحص والاسترجاع والضمان", tone: TONES.blue },
  { id: "tm-b5", title: "النقل والتوصيل", tone: TONES.amber },
];

export function BuyerTerms() {
  return (
    <div id="tm-panel-buy" role="tabpanel" aria-labelledby="tm-tab-buy" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
      <aside className="tm-aside" style={{ minWidth: 0, gap: 14 }}>
        <Toc label="محتويات شروط المشتري" items={SECTIONS} />
        <Numbers
          rows={[
            { label: "رسوم جدية الحجز (بتتخصم من الثمن)", value: <>{BUYER_DEPOSIT} جنيه <Min /></> },
            { label: "أقصى مدة لتوصيل الجهاز", value: `${MAX_DELIVERY} يوم` },
            { label: "فترة التجربة والاسترجاع", value: `${DAYS} أيام` },
            { label: "صيانة مجانية", value: MAINT_SPAN },
          ]}
        />
      </aside>
      <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        <Article id="tm-b1" n={1} title="أحكام عامة" tone={TONES.teal} icon={ICONS.scales}>
          <GeneralClauses />
        </Article>

        <Article id="tm-b2" n={2} title="رسوم جدية الحجز" tone={TONES.amber} icon={ICONS.lock}>
          <Clause title="قيمة الرسوم">
            يدفع المشتري رسم جدية حجز يبدأ من <Num>{BUYER_DEPOSIT} ج.م</Num> كحد أدنى (تُحدد قيمته النهائية بحسب نوع الجهاز وحجمه) قبل الشروع في الشحن أو الفحص الميداني، ويُخصم هذا المبلغ تلقائياً من الإجمالي المتبقي لسعر الجهاز عند إتمام الشراء.
          </Clause>
          <Clause title="التواصل وتأكيد المعاملة">
            في حال التواصل مع المشتري من قبل المنصة لإتمام إجراءات المعاملة أو ترتيب الاستلام وعدم الرد لمدة <Num>{NO_REPLY} أيام عمل</Num>، يُعتبر الحجز ملغياً ولا يتم استرداد قيمة جدية الحجز.
          </Clause>
          <Two>
            <Outcome
              kind="ok"
              title="حالات استرداد رسوم الحجز كاملة"
              items={["إثبات عدم مطابقة الجهاز لتقرير الفحص.", "إلغاء الصفقة بناءً على تقرير الفحص."]}
            />
            <Outcome
              kind="no"
              title="حالات عدم استرداد رسوم الحجز"
              items={[
                "تراجع المشتري عن الشراء بدون أسباب فنية مثبتة بتقرير الفحص.",
                `عدم رد المشتري على تواصل المنصة لمدة ${NO_REPLY} أيام عمل.`,
              ]}
            />
          </Two>
        </Article>

        <Article id="tm-b3" n={3} title="الدفع وحفظ الأموال" tone={TONES.green} icon={ICONS.coins}>
          <Clause title="خيارات السداد">
            يجوز للمشتري سداد المبلغ المتبقي من قيمة الجهاز قبل الشحن، أو عند الاستلام بمعاينة الجهاز بالعيادة. وطرق الدفع المتاحة: إنستاباي، فودافون كاش، أو الدفع عند الاستلام.
          </Clause>
          <Clause title="فترة الحماية">
            تظل أموال المشتري محجوزة ومحمية لدى المنصة طوال فترة ضمان التشغيل: <Num>{DAYS} أيام تقويمية</Num> تبدأ من أول لحظة يستلم فيها المشتري الجهاز فعلياً، ولا يتم تحويلها للبائع إلا بعد انقضاء هذه المدة وتأكيد المشتري.
          </Clause>
          <Clause title="تجربة الجهاز">
            يلتزم المشتري بتجربة الجهاز على حالات حقيقية والإبلاغ عن أي ملاحظة غير مذكورة بتقرير الفحص خلال فترة الـ {DAYS} أيام.
          </Clause>
        </Article>

        <Article id="tm-b4" n={4} title="الفحص والاسترجاع والضمان" tone={TONES.blue} icon={ICONS.search}>
          <Clause title="نوعا الفحص">
            <strong>تم الفحص:</strong> أجهزة تم فحصها مسبقاً وتوثيق حالتها بتقرير معتمد وصور حقيقية قبل العرض. <strong>يُفحص عند الطلب:</strong> أجهزة يشحنها البائع إلى مقر المنصة فور قيام المشتري بدفع رسوم جدية الحجز، ويتم فحصها في المقر، ويحق للمشتري الاطلاع على التقرير قبل تأكيد الشحن. ويتم فحص جميع الأجهزة في مقر المنصة فقط.
          </Clause>
          <Clause title={`سياسة الاسترجاع (خلال ${DAYS} أيام)`}>
            يحق للمشتري إرجاع الجهاز واسترداد أمواله وفق آلية المنصة في حال وجود عيب جوهري غير مذكور في تقرير الفحص المعتمد خلال فترة التجربة ({DAYS} أيام)، وتبدأ هذه الفترة من تاريخ ووقت استلام المشتري الفعلي للجهاز.
          </Clause>
          <Clause title="مصاريف شحن الإرجاع">
            إذا كان سبب الإرجاع عيباً أو خطأً من جهة المنصة، تُرد رسوم الجدية للمشتري. أما إذا طلب المشتري الإرجاع لأسباب شخصية خلال فترة التجربة، فيتحمل مصاريف الشحن العكسي ولا تُرد رسوم جدية الحجز.
          </Clause>
          <Clause title={`الصيانة والضمان (${MAINT_SPAN})`}>
            تُحدد مدة الضمان والصيانة ({MAINT_LIST}) بوضوح في صفحة كل جهاز وفقاً لنوعه وحالته الفنية.
          </Clause>
          <Two>
            <Outcome kind="ok" title="يشمل الضمان" items={["الأعطال الفنية والكهربائية والهيدروليكية الناتجة عن الاستخدام الطبي الطبيعي."]} />
            <Outcome
              kind="no"
              title="لا يشمل الضمان الأعطال الناتجة عن"
              items={[
                "سوء الاستخدام.",
                "التذبذب الشديد في التيار الكهربائي بدون منظم.",
                "سوء التحميل والنقل إذا تم بواسطة طرف خارجي غير تابع للمنصة.",
              ]}
            />
          </Two>
        </Article>

        <Article id="tm-b5" n={5} title="النقل والتوصيل" tone={TONES.amber} icon={ICONS.truck}>
          <Clause title="مسؤولية الشحن">تتولى المنصة تنظيم عملية النقل والتوصيل لضمان سلامة الأجهزة الحساسة.</Clause>
          <Clause title="مدة التوصيل">
            تلتزم المنصة بأن تكون أقصى مدة للتوصيل هي <Num>{MAX_DELIVERY} يوماً</Num> من تاريخ تأكيد الشراء وتسوية رسوم الشحن/الحجز.
          </Clause>
          <Clause title="نطاق التوصيل">
            التوصيل متاح لكل المحافظات والأماكن بدون استثناء. المدة المتوقعة: <Num>{BUSINESS.deliveryDaysInspected} أيام</Num> للجهاز المفحوص والجاهز مسبقاً، و<Num>{BUSINESS.deliveryDaysWithInspection} أيام</Num> لو الفحص بيتم بعد طلب الشراء.
          </Clause>
          <Clause title="التركيب">لا تقدّم المنصة أي خدمات تركيب.</Clause>
        </Article>

        <article className="tm-art tm-art-dark" style={{ borderRadius: 24, background: "#0F2A26", color: "#FFFFFF", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px 24px" }}>
          <div style={{ flex: "1 1 220px", minWidth: 0, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ flex: "none", width: 52, height: 52, borderRadius: 16, background: "#F2A33A", color: "#12221F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
            </span>
            <h2 style={{ margin: 0, fontSize: 20 }}>ضمانك على كل جهاز</h2>
          </div>
          <div style={{ flex: "2 1 320px", minWidth: 0, display: "flex", flexWrap: "wrap", gap: 10, color: "#C3D3CE" }}>
            <span style={{ flex: "1 1 180px", padding: "12px 16px", borderRadius: 14, background: "rgba(255, 255, 255, 0.07)", border: "1px solid #2E5650" }}>
              استرجاع خلال: <strong style={{ color: "#FFFFFF" }}>{DAYS} أيام</strong>
            </span>
            <span style={{ flex: "1 1 220px", padding: "12px 16px", borderRadius: 14, background: "rgba(255, 255, 255, 0.07)", border: "1px solid #2E5650" }}>
              صيانة مجانية: <strong style={{ color: "#FFFFFF" }}>{MAINT_SPAN}</strong> حسب الجهاز
            </span>
          </div>
        </article>
        <Link href={routes.devices} className="tm-cta tm-cta-teal" style={{ minHeight: 54, padding: "0 26px", borderRadius: 14, background: "#0D5C55", color: "#FFFFFF", fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
          تصفّح الأجهزة
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
        </Link>
      </div>
    </div>
  );
}
