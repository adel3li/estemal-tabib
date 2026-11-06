// Seller terms — content from the client's draft «مسودة شروط وأحكام البيع والشراء»
// (WhatsApp, 2026-11-01): sections أولاً، ثانياً، سادساً. «خدمة إيداع الجهاز» is
// not in the draft but the sell form offers it, so it stays (DECISIONS.md).
import Link from "next/link";
import { routes } from "@/lib/routes";
import { BUSINESS } from "@/config/business";
import { Article, Clause, GeneralClauses, ICONS, Min, Num, Numbers, Outcome, TONES, Toc, Two } from "./parts";

const DAYS = BUSINESS.trialDays;
const SELLER_FEE = BUSINESS.sellerSeriousnessFeeEGP;
const KEEP_DAYS = BUSINESS.minListingDays;
const NO_REPLY = BUSINESS.noReplyBusinessDays;

const SECTIONS = [
  { id: "tm-s1", title: "أحكام عامة", tone: TONES.teal },
  { id: "tm-s2", title: "الإفصاح والملكية", tone: TONES.blue },
  { id: "tm-s3", title: "رسوم جدية العرض", tone: TONES.amber },
  { id: "tm-s4", title: "العمولة وتحويل المستحقات", tone: TONES.green },
  { id: "tm-s5", title: "خدمة إيداع الجهاز لدى المنصة", tone: TONES.teal },
];

export function SellerTerms() {
  return (
    <div id="tm-panel-sell" role="tabpanel" aria-labelledby="tm-tab-sell" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
      <aside className="tm-aside" style={{ minWidth: 0, gap: 14 }}>
        <Toc label="محتويات شروط البايع" items={SECTIONS} />
        <Numbers
          rows={[
            { label: "رسوم جدية العرض (الجهاز معاك)", value: <>{SELLER_FEE} جنيه <Min /></> },
            { label: `رسوم الجدية لو الجهاز عندنا ${KEEP_DAYS} أيام`, value: "مفيش" },
            { label: "الرد على تواصل المنصة خلال", value: `${NO_REPLY} أيام عمل` },
            { label: "تحويل مستحقاتك بعد استلام المشتري", value: `${DAYS} أيام` },
          ]}
        />
      </aside>
      <div style={{ flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        <Article id="tm-s1" n={1} title="أحكام عامة" tone={TONES.teal} icon={ICONS.scales}>
          <GeneralClauses />
        </Article>

        <Article id="tm-s2" n={2} title="الإفصاح والملكية" tone={TONES.blue} icon={ICONS.eye}>
          <Clause title="الإفصاح والأمانة">
            يلتزم البائع بتقديم بيانات صحيحة وكاملة عن الجهاز (الموديل، سنة الصنع، حالة الاستخدام، أي عيوب أو صيانة سابقة).
          </Clause>
          <Clause title="الملكية والمسؤولية">يضمن البائع خلو الجهاز من أي أحكام، أو مستحقات مالية للغير، أو نزاعات قانونية.</Clause>
        </Article>

        <Article id="tm-s3" n={3} title="رسوم جدية العرض" tone={TONES.amber} icon={ICONS.clipboard}>
          <Clause title="قيمة الرسوم">
            لا يُدفع أي مبلغ عند تقديم طلب العرض. تراجع المنصة الطلب خلال 24 ساعة.
          </Clause>
          <Clause title="إرسال الجهاز للمنصة أولاً (للفحص ثم العرض)">
            لا توجد أي رسوم جدية، بشرط التزام البائع بترك الجهاز لدى المنصة لمدة لا تقل عن <Num>{KEEP_DAYS} أيام</Num>.
          </Clause>
          <Clause title="عرض الجهاز دون إرساله للمنصة">
            في حال قبول الطلب يُطلب من البائع سداد رسوم جدية عرض بحد أدنى <Num>{SELLER_FEE} ج.م</Num> (قابلة للزيادة بحسب قيمة الجهاز)، ويُنشر الإعلان على المنصة فور وصول الرسوم.
          </Clause>
          <Clause title="تكاليف الشحن">
            يتحمل البائع تكاليف الشحن في جميع الأحوال.
          </Clause>
          <Clause title="الفحص والشحن للمقر">
            يتم فحص جميع الأجهزة في مقر المنصة فقط. إذا اختار البائع بقاء الجهاز معه، يلتزم بشحنه إلى مقر المنصة على نفقته فور طلب المشتري له، ليتم فحصه قبل شحنه للمشتري. وتتحمل المنصة تكلفة الفحص عند إتمام البيع.
          </Clause>
          <Clause title="إعادة الجهاز للبائع">
            في حال إعادة الجهاز للبائع بسبب يرجع للمنصة أو للبائع، تتحمل المنصة مصاريف شحن الإرجاع، أو تُخصم من رسوم الجدية بحسب المتسبب.
          </Clause>
          <Clause title="التواصل وتحديث حالة العرض">
            في حال محاولة المنصة التواصل مع البائع لترتيب الفحص أو البيع وعدم الرد لمدة <Num>{NO_REPLY} أيام عمل</Num>، يحق للمنصة إلغاء العرض ولا يتم استرداد قيمة جدية العرض.
          </Clause>
          <Two>
            <Outcome kind="ok" title="حالات استرداد رسوم الجدية" items={["تُرد الرسوم بالكامل للبائع فور إتمام عملية البيع وتحويل مستحقاته."]} />
            <Outcome
              kind="no"
              title="حالات عدم استرداد رسوم الجدية"
              items={[
                "ثبوت إخفاء البائع لعيوب جوهرية أدت لإلغاء البيع أثناء الفحص أو تجربة المشتري.",
                `عدم رد البائع على تواصل المنصة لمدة ${NO_REPLY} أيام عمل.`,
              ]}
            />
          </Two>
        </Article>

        <Article id="tm-s4" n={4} title="العمولة وتحويل المستحقات" tone={TONES.green} icon={ICONS.coins}>
          <Clause title="عمولة المنصة">
            تحتفظ المنصة بحقها في تحديد واستيفاء عمولة عن الخدمات المقدمة (الفحص، الضمان، الوساطة، وحفظ الأموال). وتعتبر عمولة المنصة متغيرة وغير ثابتة، وتختلف بحسب نوع الجهاز ورتبته وقيمته السعرية، والمنصة غير ملزمة بالإفصاح عن تفاصيل أو قيمة عمولتها لأي من الأطراف.
          </Clause>
          <Clause title="تحويل المستحقات">
            يتم تحويل مستحقات البائع بعد انقضاء فترة التجربة (<Num>{DAYS} أيام</Num> من الاستلام) وتأكيد سلامة المعاملة.
          </Clause>
        </Article>

        <Article id="tm-s5" n={5} title="خدمة إيداع الجهاز لدى المنصة" tone={TONES.teal} icon={ICONS.home}>
          <span style={{ alignSelf: "flex-start", padding: "3px 12px", borderRadius: 999, background: "#E2F4F8", color: "#0A7E99", fontSize: 13, fontWeight: 700 }}>خدمة اختيارية</span>
          <Clause title="الهدف من الخدمة">
            لزيادة فرص بيع الجهاز وتسريع وصوله للمشتري، يحق للبائع إرسال جهازه إلى المنصة، حيث يتم فحصه وحفظه لديها لحين إتمام عملية البيع.
          </Clause>
          <Clause title="الرسوم والمدة">
            لا توجد رسوم جدية على الجهاز المودَع، بشرط بقائه لدى المنصة مدة لا تقل عن <Num>{KEEP_DAYS} أيام</Num>.
          </Clause>
          <Clause title="استرداد الجهاز">يحق للبائع استرداد جهازه المودَع بعد انقضاء هذه المدة، ويتحمل تكلفة شحن إعادته إليه.</Clause>
        </Article>

        <Link href={routes.sell} className="tm-cta tm-cta-amber" style={{ minHeight: 54, padding: "0 26px", borderRadius: 14, background: "#F5921C", color: "#122022", fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
          اعرض جهازك للبيع
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
        </Link>
      </div>
    </div>
  );
}
