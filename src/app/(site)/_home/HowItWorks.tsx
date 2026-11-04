// `/how` body — v2 direction: page head, the four steps on one numbered line,
// then the two inspection types side by side. Copy unchanged from the
// Main.dc.html port.
import { BUSINESS } from "@/config/business";
import { PageHead } from "../_v2/PageHead";

const DAYS = BUSINESS.trialDays;

const STEPS = [
  { title: "البايع بيعرض جهازه", text: "بيانات الجهاز، وصوره وهو شغال." },
  { title: "بنفحص الجهاز", text: "أجهزة بتتفحص قبل ما تتعرض، والباقي بنفحصه أول ما تطلبه وقبل الشحن." },
  { title: "تدفع وفلوسك محفوظة", text: `تدفع الفلوس أو جزء منها، وبتفضل عندنا ${DAYS} أيام بعد الاستلام قبل ما تتحول للبايع.`, held: true },
  { title: "نوصّل لحد بابك بضمان", text: "شحن آمن لحد بابك وتعاين بنفسك، مع ضمان تشغيل واستبدال وصيانة.", held: true },
];

const Check = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

export function HowItWorks() {
  return (
    <>
      <PageHead eyebrow="إزاي بنشتغل" title="إزاي بنشتغل؟" lede="أربع خطوات، وكل خطوة واضحة قدامك." />
      <section id="how" className="hm-sec">
        <div className="hm-wrap">
          <ol className="hm-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className={s.held ? "hm-hold" : undefined}>
                <span className="hm-n hm-num">0{i + 1}</span>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TWO INSPECTION TYPES */}
      <section className="hm-sec hm-sec-top0">
        <div className="hm-wrap">
          <div className="hm-sec-head">
            <div>
              <div className="hm-eyebrow">علامة على كل جهاز</div>
              <h2 className="hm-h2">نوعين من الفحص… وانت عارف كل جهاز فين</h2>
              <p className="hm-lede hm-lede-sm" style={{ marginTop: 10 }}>على كل جهاز علامة بتقولك اتفحص ولا لسه هيتفحص قبل ما يتشحن لك.</p>
            </div>
          </div>
          <div className="hm-split hm-split-flush">
            <div>
              <span className="hm-ph hm-ph-wide">
                <svg aria-hidden="true" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice"><use href="#mn-report" /></svg>
              </span>
              <div className="hm-status hm-ok hm-status-top"><span className="hm-d" aria-hidden="true" />تم الفحص</div>
              <h3 className="hm-h3">الجهاز اتفحص قبل ما يتعرض</h3>
              <ul className="hm-checks hm-ok">
                <li><Check />تقرير الفحص الكامل قدامك قبل ما تدفع</li>
                <li><Check />الصور من فريق الفحص</li>
                <li><Check />شحن أسرع لأن الفحص خلص</li>
              </ul>
            </div>
            <div>
              <span className="hm-ph hm-ph-wide">
                <svg aria-hidden="true" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice"><use href="#mn-visit" /></svg>
              </span>
              <div className="hm-status hm-ord hm-status-top"><span className="hm-d" aria-hidden="true" />يُفحص عند الطلب</div>
              <h3 className="hm-h3">بنفحصه بعد طلبك وقبل الشحن</h3>
              <ul className="hm-checks hm-ord">
                <li><Check />تقرير الفحص بيوصلك قبل ما الجهاز يتشحن</li>
                <li><Check />لو الجهاز طلع مش مطابق، فلوسك بترجعلك كاملة</li>
                <li><Check />لحد الفحص، الصور من البايع</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
