import { ORDER_STEPS, STEP_RELEASED, STEP_REPORT, isSkipped, type Order } from "@/lib/demo/orders";
import { CardIcon, CheckIcon, STEP_ICONS } from "./art";
import { STEP_TEXT } from "./model";
import { ReportCard } from "./ReportCard";

type Props = {
  o: Order;
  reportHref?: string;
  badges: { txt: string; ok: boolean }[];
  onConfirm: () => void;
  onCancel: () => void;
};

export function Timeline({ o, reportHref, badges, onConfirm, onCancel }: Props) {
  const active = o.status === "active";
  const released = o.step >= STEP_RELEASED;
  return (
    <ol className="ot-tl" style={{ listStyle: "none", margin: 0, flex: "999 1 560px", minWidth: 0, borderRadius: 24, background: "#FFFFFF", border: "1px solid #DCE3DF", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
      {ORDER_STEPS.map((label, i) => {
        const Icon = STEP_ICONS[i];
        const done = i < o.step || released;
        const cur = i === o.step && !released;
        const last = i === ORDER_STEPS.length - 1;
        const skip = isSkipped(o, i);
        const nextIsCur = i + 1 === o.step && active;
        const line = done
          ? { width: 3, background: nextIsCur ? "linear-gradient(#0D5C55, #F2A33A)" : "#0D5C55" }
          : { width: 0, borderRight: `3px dashed ${cur ? "#C9D4CF" : "#DCE3DF"}` };
        const box: React.CSSProperties = done
          ? { background: "#0D5C55", color: "#FFFFFF" }
          : cur && active
            ? { background: "#FBEEDC", color: "#C46A12", border: "2px solid #F2A33A", boxShadow: "0 0 0 5px rgba(242, 163, 58, 0.18)" }
            : cur
              ? { background: "#FBE9E7", color: "#B3261E", border: "2px solid #E8B4AE" }
              : { background: "#F5F7F4", color: "#8FA09A", border: "1px dashed #C9D4CF" };
        return (
          <li key={label} aria-current={cur ? "step" : undefined} className="ot-li">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
              <span className="ot-ico" style={{ position: "relative", borderRadius: 16, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...box }}>
                <Icon />
                {done ? (
                  <span style={{ position: "absolute", bottom: -4, left: -4, width: 20, height: 20, borderRadius: 999, background: "#FFFFFF", color: "#0D5C55", border: "2px solid #0D5C55", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckIcon />
                  </span>
                ) : null}
              </span>
              {!last ? <span style={{ flex: 1, minHeight: 24, margin: "6px 0", borderRadius: 3, ...line }} /> : null}
            </div>
            {cur && active && i === STEP_REPORT ? (
              <ReportCard text={STEP_TEXT[i][0]} reportHref={reportHref} badges={badges} onConfirm={onConfirm} onCancel={onCancel} />
            ) : cur ? (
              <div className="ot-cur" style={{ flex: 1, minWidth: 0, marginBottom: 24, padding: 18, borderRadius: 18, background: active ? "#FDF6EC" : "#FDF1EF", border: `1px solid ${active ? "#F0C88A" : "#E8B4AE"}` }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{label}</div>
                <div style={{ color: active ? "#5A4A3C" : "#7A1A14", fontSize: 15 }}>
                  {active ? STEP_TEXT[i][1] : "إنت رفضت تقرير الفحص، فالطلب اتلغى وفلوسك هترجعلك كاملة بنفس طريقة الدفع."}
                </div>
              </div>
            ) : (
              <div style={{ minWidth: 0, padding: last ? "8px 0 0" : "8px 0 22px", color: "#4A5A56" }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#12221F" }}>{label}</div>
                <div style={{ fontSize: 15 }}>
                  {skip ? "مش محتاجة — الجهاز اتفحص قبل ما يتعرض" : done ? STEP_TEXT[i][0] : STEP_TEXT[i][1]}
                </div>
              </div>
            )}
          </li>
        );
      })}
      <li className="ot-li" style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #E5EBE8" }}>
        <span className="ot-ico" style={{ borderRadius: 16, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", ...(released ? { background: "#3F7A1F", color: "#FFFFFF" } : { background: "#F5F7F4", color: "#8FA09A", border: "1px dashed #C9D4CF" }) }}>
          <CardIcon />
        </span>
        <div style={{ minWidth: 0, paddingTop: 8, color: "#4A5A56" }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: released ? "#3F7A1F" : "#12221F" }}>{released ? "اتحوّل للبايع" : "وبعدها: اتحوّل للبايع"}</div>
          <div style={{ fontSize: 15 }}>
            {released
              ? `فترة التجربة خلصت من غير مشاكل، والفلوس اتحولت للبايع. الصيانة ${o.maint} شهور شغالة.`
              : `بعد ما فترة التجربة تخلص من غير مشاكل، وتبدأ الصيانة ${o.maint} شهور`}
          </div>
        </div>
      </li>
    </ol>
  );
}
