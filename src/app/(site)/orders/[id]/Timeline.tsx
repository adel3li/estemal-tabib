import { ORDER_STEPS, STEP_RELEASED, STEP_REPORT, isSkipped, type Order } from "@/lib/orders/orders";
import { STEP_TEXT } from "./model";
import { ReportCard } from "./ReportCard";

type Props = {
  o: Order;
  reportHref?: string;
  badges: { txt: string; ok: boolean }[];
  onConfirm: () => void;
  onCancel: () => void;
};

// The buyer's money is held by the platform from «فلوسك محفوظة» (step 1) until
// the trial ends (last step) — that stretch of the line is drawn in cyan.
const HELD_FROM = 1;
const HELD_TO = ORDER_STEPS.length - 1;

/** Order steps as a v2 ledger: a dot line, the money-held stretch in cyan. */
export function Timeline({ o, reportHref, badges, onConfirm, onCancel }: Props) {
  const active = o.status === "active";
  const released = o.step >= STEP_RELEASED;
  return (
    <div className="ot-tl" style={{ flex: "999 1 560px", minWidth: 0, borderRadius: 12, background: "#FFFFFF", border: "1px solid #DFE7EA", boxSizing: "border-box" }}>
      <div className="ot-legend">
        <span aria-hidden="true" />
        الخط السماوي: الفترة اللي فلوسك فيها محفوظة معانا
      </div>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
        {ORDER_STEPS.map((label, i) => {
          const done = i < o.step || released;
          const cur = i === o.step && !released;
          const last = i === ORDER_STEPS.length - 1;
          const skip = isSkipped(o, i);
          const held = i >= HELD_FROM && i < HELD_TO;
          const dot = done ? (i >= HELD_FROM ? "ot-dot is-held" : "ot-dot is-done") : cur ? (active ? "ot-dot is-cur" : "ot-dot is-bad") : "ot-dot";
          const line = `ot-line${held ? " is-held" : ""}${done && !(i + 1 === o.step && active) ? " is-done" : ""}`;
          return (
            <li key={label} aria-current={cur ? "step" : undefined} className="ot-li">
              <div className="ot-rail" aria-hidden="true">
                <span className={dot} />
                {!last ? <span className={line} /> : null}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 22 }}>
                <span className="ot-n ot-num">0{i + 1}</span>
                {cur && active && i === STEP_REPORT ? (
                  <ReportCard text={STEP_TEXT[i][0]} reportHref={reportHref} badges={badges} onConfirm={onConfirm} onCancel={onCancel} />
                ) : cur ? (
                  <div className="ot-cur" style={{ padding: 16, borderRadius: 10, background: active ? "#FFF6EC" : "#FDF1EF", border: `1px solid ${active ? "#F8C788" : "#E8B4AE"}` }}>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{label}</div>
                    <div style={{ color: active ? "#5A4A3C" : "#7A1A14", fontSize: 15 }}>
                      {active ? STEP_TEXT[i][1] : "إنت رفضت تقرير الفحص، فالطلب اتلغى وفلوسك هترجعلك كاملة بنفس طريقة الدفع."}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#5A6F76" }}>
                    <div style={{ fontWeight: 600, fontSize: 17, color: done ? "#0F2A33" : "#5A6F76" }}>{label}</div>
                    <div style={{ fontSize: 15 }}>
                      {skip ? "مش محتاجة — الجهاز اتفحص قبل ما يتعرض" : done ? `${STEP_TEXT[i][0]}${o.stepDates[i] ? ` · ${o.stepDates[i]}` : ""}` : STEP_TEXT[i][1]}
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="ot-release" style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #DFE7EA", color: "#5A6F76" }}>
        <div style={{ fontWeight: 700, fontSize: 17, color: released ? "#3F7A1F" : "#0F2A33" }}>{released ? "اتحوّل للبايع" : "وبعدها: اتحوّل للبايع"}</div>
        <div style={{ fontSize: 15 }}>
          {released
            ? `فترة التجربة خلصت من غير مشاكل، والفلوس اتحولت للبايع. الصيانة ${o.maint} شهور شغالة.`
            : `بعد ما فترة التجربة تخلص من غير مشاكل، وتبدأ الصيانة ${o.maint} شهور`}
        </div>
      </div>
    </div>
  );
}
