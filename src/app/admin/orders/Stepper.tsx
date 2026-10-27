import { AR_DIGITS, ORDER_STEPS, STEP_RELEASED, isSkipped, type Order } from "@/lib/demo/orders";

export function Stepper({ o }: { o: Order }) {
  const all = o.step >= STEP_RELEASED;
  return (
    <ol aria-label="خطوات الطلب" className="or-steps">
      {ORDER_STEPS.map((label, i) => {
        const done = i < o.step || all;
        const cur = i === o.step && o.status === "active";
        const skip = isSkipped(o, i);
        return (
          <li key={label} aria-current={cur ? "step" : undefined} className="or-step">
            {i > 0 ? (
              <span aria-hidden="true" className="or-step-line" style={{ background: i <= o.step || all ? "#0D5C55" : "#DCE3DF" }} />
            ) : null}
            <span
              className="or-step-dot"
              style={{
                position: "relative",
                width: 36,
                height: 36,
                borderRadius: 999,
                background: done ? "#0D5C55" : cur ? "#F2A33A" : "#FFFFFF",
                color: done ? "#FFFFFF" : "#12221F",
                border: `2px solid ${done ? "#0D5C55" : cur ? "#F2A33A" : "#C9D4CF"}`,
                boxShadow: cur ? "0 0 0 5px rgba(242,163,58,.25)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            >
              {done ? "✓" : AR_DIGITS[i]}
            </span>
            <span className="or-step-lbl" style={{ fontSize: 13, fontWeight: cur ? 700 : 500, color: done || cur ? "#12221F" : "#4A5A56", lineHeight: 1.4 }}>{label}</span>
            <span className="or-step-st" style={{ color: cur ? "#8A4209" : done ? "#0D5C55" : "#4A5A56" }}>
              {skip ? "مش محتاجة" : done ? "خلصت" : cur ? "دلوقتي" : "لسه"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
