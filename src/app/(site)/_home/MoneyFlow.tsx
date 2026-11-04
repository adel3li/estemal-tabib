// «إزاي بنشتغل» on the home page — v2 dark band: the five steps of an order on
// one line, with the stretch where the platform holds the buyer's money marked.
// The full explanation stays on /how.
import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { routes } from "@/lib/routes";

const STEPS: { title: string; text: string; held?: boolean }[] = [
  { title: "تدفع للمنصة", text: "مش للبايع. الفلوس بتتحفظ عندنا من أول لحظة." },
  { title: "فني معتمد يفحص", text: "قبل النشر أو بعد طلبك، وبيكتب تقرير بالحالة.", held: true },
  { title: "التوصيل لباب عيادتك", text: `في خلال ${BUSINESS.maxDeliveryDays} يوم بحد أقصى من تأكيد الشراء.`, held: true },
  { title: `تجرب ${BUSINESS.trialDays} أيام`, text: "لو فيه مشكلة: استبدال أو استرجاع.", held: true },
  { title: "البايع ياخد فلوسه", text: "بعد ما المدة تخلص والجهاز تمام." },
];

export function MoneyFlow() {
  return (
    <section className="hm-band hm-sec">
      <div className="hm-wrap">
        <div className="hm-eyebrow">إزاي بنشتغل</div>
        <h2 className="hm-h2 hm-band-h">فلوسك مش بتروح للبايع غير لما الجهاز يوصلك ويشتغل قدامك.</h2>
        <ol className="hm-ledger">
          {STEPS.map((s, i) => (
            <li key={s.title} className={s.held ? "hm-hold" : undefined}>
              <span className="hm-n hm-num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="hm-held"><span>الفترة دي فلوسك محفوظة معانا</span></div>
        <Link href={routes.how} className="hm-tlink hm-band-link">التفاصيل كاملة <span aria-hidden="true">←</span></Link>
      </div>
    </section>
  );
}
