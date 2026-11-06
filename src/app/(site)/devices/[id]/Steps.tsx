// On-order devices: what happens after the order — v2 numbered list.
const STEPS = [
  { text: "تدفع الفلوس أو جزء منها، والفلوس بتتحفظ عندنا" },
  { text: "نفحص الجهاز" },
  { text: "تقرير الفحص يوصلك وتأكّد على الطلب" },
  { text: "نشحن لك لحد بابك وتعاين بنفسك" },
];

export function Steps() {
  return (
    <section className="li-report li-steps-box">
      <div className="li-report-top">
        <div>
          <h2 className="li-h2">إيه اللي هيحصل بعد ما تطلب</h2>
          <span>4 خطوات، وفي كل خطوة بنبلغك على واتساب.</span>
        </div>
      </div>
      <ol className="li-steps">
        {STEPS.map((s, i) => (
          <li key={s.text}>
            <span className="li-step-n hm-num" aria-hidden="true">{i + 1}</span>
            {s.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
