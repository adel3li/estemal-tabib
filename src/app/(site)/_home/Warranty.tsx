// `/warranty` body — v2 direction: page head with the escrow drawing, the three
// guarantees as a flat numbered row, and the money-held note. Copy unchanged.
import { BUSINESS, MAINT_LIST } from "@/config/business";
import { PageHead } from "../_v2/PageHead";

const DAYS = BUSINESS.trialDays;

const ITEMS = [
  { title: "استبدال أو استرجاع", text: `خلال ${DAYS} أيام لو الجهاز مطلعش زي التقرير.` },
  { title: `ضمان تشغيل ${DAYS} أيام`, text: "جرّب الجهاز في عيادتك على حالات حقيقية واتأكد بنفسك." },
  { title: `صيانة ${MAINT_LIST}`, text: "حسب نوع الجهاز، ومكتوبة بوضوح على كل جهاز." },
];

export function Warranty() {
  return (
    <>
      <PageHead
        eyebrow="الضمان"
        title={<>جهازك مضمون..<br />فتشتري وأنت متطمن.</>}
        lede="من أول ما الموقع يفحصه.. لحد المعاينة وفترة الصيانة."
        aside={<svg aria-hidden="true" viewBox="0 0 360 300" className="hm-head-art"><use href="#mn-escrow" /></svg>}
      />
      <section id="warranty" className="hm-sec">
        <div className="hm-wrap">
          <ol className="hm-steps hm-steps-3">
            {ITEMS.map((it, i) => (
              <li key={it.title}>
                <span className="hm-n hm-num">0{i + 1}</span>
                <h2>{it.title}</h2>
                <p>{it.text}</p>
              </li>
            ))}
          </ol>
          <div className="hm-note">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            <span>وطول فترة التجربة، فلوسك محفوظة عندنا ومش بتتحول للبايع غير بعد تأكيدك.</span>
          </div>
        </div>
      </section>
    </>
  );
}
